import Quiz from '../models/quizModel.js';
import Submission from '../models/submissionModel.js';
import Classroom from '../models/classroomModel.js';

// @desc    Create a quiz
// @route   POST /api/classrooms/:classroomId/quizzes
// @access  Private/Teacher
const createQuiz = async (req, res) => {
  const { title, questions } = req.body;
  const classroomId = req.params.classroomId;

  const classroom = await Classroom.findById(classroomId);

  if (classroom.teacher.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to create quizzes in this class');
  }

  const quiz = new Quiz({
    title,
    questions,
    classroom: classroomId,
    teacher: req.user._id,
  });

  const createdQuiz = await quiz.save();
  res.status(201).json(createdQuiz);
};

// @desc    Get all quizzes for a classroom
// @route   GET /api/classrooms/:classroomId/quizzes
// @access  Private
const getQuizzesForClassroom = async (req, res) => {
  const quizzes = await Quiz.find({ classroom: req.params.classroomId });
  res.json(quizzes);
};

// @desc    Get a single quiz by ID (for students to take)
// @route   GET /api/quizzes/:quizId
// @access  Private
const getQuizById = async (req, res) => {
  // Find the quiz but hide the 'isCorrect' field on the options
  const quiz = await Quiz.findById(req.params.quizId).select('-questions.options.isCorrect');
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
};

// @desc    Submit a quiz and calculate the score
// @route   POST /api/quizzes/:quizId/submit
// @access  Private/Student
const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.quizId;
  const studentId = req.user._id;

  // 1. Fetch the full quiz with correct answers from DB
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  // 2. Check if user has already submitted this quiz
  const existingSubmission = await Submission.findOne({ quiz: quizId, student: studentId });
  if (existingSubmission) {
    res.status(400);
    throw new Error('You have already submitted this quiz');
  }

  // 3. Calculate the score
  let score = 0;
  const submissionAnswers = [];
  
  quiz.questions.forEach(question => {
    const studentAnswer = answers.find(a => a.questionId === question._id.toString());
    if (studentAnswer) {
      const correctOption = question.options.find(opt => opt.isCorrect);
      const selectedOption = question.options.find(opt => opt._id.toString() === studentAnswer.selectedOptionId);

      const isCorrect = correctOption._id.toString() === studentAnswer.selectedOptionId;
      if (isCorrect) {
        score++;
      }
      submissionAnswers.push({
          questionText: question.questionText,
          selectedOptionText: selectedOption.text,
          isCorrect: isCorrect,
      });
    }
  });

  // 4. Save the submission to the database
  const submission = new Submission({
    quiz: quizId,
    student: studentId,
    answers: submissionAnswers,
    score: score,
    totalQuestions: quiz.questions.length,
  });

  const createdSubmission = await submission.save();
  res.status(201).json({
    message: 'Submission successful!',
    score: createdSubmission.score,
    totalQuestions: createdSubmission.totalQuestions,
  });
};

// @desc    Get results for a quiz (for the teacher)
// @route   GET /api/quizzes/:quizId/submissions
// @access  Private/Teacher
const getQuizSubmissions = async (req, res) => {
    const submissions = await Submission.find({ quiz: req.params.quizId }).populate('student', 'name email');
    res.json(submissions);
};

export { createQuiz, getQuizzesForClassroom, getQuizById, submitQuiz, getQuizSubmissions };