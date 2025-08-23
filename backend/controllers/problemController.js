import Problem from '../models/problemModel.js';
import ProblemSubmission from '../models/problemSubmissionModel.js';
import Classroom from '../models/classroomModel.js';
import axios from 'axios';

// @desc    Create a coding problem
// @route   POST /api/classrooms/:classroomId/problems
// @access  Private/Teacher
const createProblem = async (req, res) => {
  const { title, description, testCases, codeTemplates } = req.body;
  const classroomId = req.params.classroomId;
  const classroom = await Classroom.findById(classroomId);

  if (classroom.teacher.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const problem = new Problem({
    title,
    description,
    testCases,
    codeTemplates,
    classroom: classroomId,
    teacher: req.user._id,
  });

  const createdProblem = await problem.save();
  res.status(201).json(createdProblem);
};

// @desc    Get all submissions for a problem
// @route   GET /api/problems/:problemId/submissions
// @access  Private/Teacher
const getProblemSubmissions = async (req, res) => {
    const problem = await Problem.findById(req.params.problemId).populate('classroom');
    if (!problem) {
        res.status(404);
        throw new Error('Problem not found');
    }
    if (problem.teacher.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to view submissions for this problem');
    }

    const submissions = await ProblemSubmission.find({ problem: req.params.problemId })
        .populate('student', 'name email') 
        .sort({ createdAt: -1 });

    res.json(submissions);
};


// =================================================================
// TEMPORARY DEBUGGING VERSION OF THIS FUNCTION
// =================================================================
// @desc    Get all problems for a classroom
// @route   GET /api/classrooms/:classroomId/problems
// @access  Private
const getProblemsForClassroom = async (req, res) => {
  const problems = await Problem.find({ classroom: req.params.classroomId })
    .select('title createdAt')
    .lean();

  const problemsWithCounts = await Promise.all(
    problems.map(async (problem) => {
      const submissionCount = await ProblemSubmission.countDocuments({ problem: problem._id });
      return { ...problem, submissionCount };
    })
  );
  res.json(problemsWithCounts);
};

// @desc    Get a single problem by ID
// @route   GET /api/problems/:problemId
// @access  Private
const getProblemById = async (req, res) => {
  const problem = await Problem.findById(req.params.problemId);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  const submissionCount = await ProblemSubmission.countDocuments({ problem: req.params.problemId });
  const studentSubmission = await ProblemSubmission.findOne({ problem: req.params.problemId, student: req.user._id });

  if (req.user.role === 'Student') {
    problem.testCases = problem.testCases.filter(tc => !tc.isHidden);
  }

  res.json({
    ...problem.toObject(),
    submissionCount,
    studentSubmissionStatus: studentSubmission ? 'Submitted' : 'Not Submitted',
    studentSubmissionDetails: studentSubmission || null
  });
};

// @desc    Run code against visible test cases
// @route   POST /api/problems/:problemId/run
// @access  Private/Student
const runCode = async (req, res) => {
    const { code, language } = req.body;
    const problemId = req.params.problemId;
    const problem = await Problem.findById(problemId);

    if (!problem) {
        res.status(404);
        throw new Error('Problem not found');
    }

    const teacherTemplate = problem.codeTemplates.find(t => t.language === language)?.template;
    if (!teacherTemplate) {
        throw new Error(`No template found for ${language}`);
    }

    const fullCode = teacherTemplate.replace(
        /(\/\/|#) START_STUDENT_CODE[\s\S]*(\/\/|#) END_STUDENT_CODE/,
        `$1 START_STUDENT_CODE\n${code}\n$1 END_STUDENT_CODE`
    );

    const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);
    const results = [];

    for (const [index, tc] of visibleTestCases.entries()) {
        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language,
                version: '*',
                files: [{ content: fullCode }],
                stdin: tc.input,
            });

            const actualOutput = response.data.run.stdout.trim();
            const expectedOutput = tc.expectedOutput.trim();
            const passed = actualOutput === expectedOutput;
            
            results.push({
                testCase: `Test Case ${index + 1}`,
                passed,
                input: tc.input,
                expectedOutput,
                actualOutput,
            });
        } catch (error) {
            results.push({
                testCase: `Test Case ${index + 1}`,
                passed: false,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: 'Execution Error',
            });
        }
    }
    res.json(results);
};

// @desc    Submit a solution to a problem
// @route   POST /api/problems/:problemId/submit
// @access  Private/Student
const submitSolution = async (req, res) => {
    const { code, language } = req.body;
    const problemId = req.params.problemId;
    const problem = await Problem.findById(problemId);

    if (!problem) { throw new Error('Problem not found'); }
    
    const teacherTemplate = problem.codeTemplates.find(t => t.language === language)?.template;
    if (!teacherTemplate) { throw new Error(`No template for ${language}`); }

    const fullCode = teacherTemplate.replace(
        /(\/\/|#) START_STUDENT_CODE[\s\S]*(\/\/|#) END_STUDENT_CODE/,
        `$1 START_STUDENT_CODE\n${code}\n$1 END_STUDENT_CODE`
    );

    let score = 0;
    const submissionResults = [];
    let visibleIndex = 1;
    let hiddenIndex = 1;
    
    for (const tc of problem.testCases) {
        let passed = false;
        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language,
                version: '*',
                files: [{ content: fullCode }],
                stdin: tc.input,
            });
            const actualOutput = response.data.run.stdout.trim();
            passed = actualOutput === tc.expectedOutput.trim();
        } catch (error) {
            passed = false;
        }

        if (passed) score++;

        if (tc.isHidden) {
            submissionResults.push({ name: `Hidden Test Case ${hiddenIndex++}`, passed });
        } else {
            submissionResults.push({ name: `Test Case ${visibleIndex++}`, passed });
        }
    }

    const newSubmission = await ProblemSubmission.create({
        problem: problemId,
        student: req.user._id,
        language,
        code,
        score,
        totalTestCases: problem.testCases.length,
    });

    res.status(201).json({ submission: newSubmission, results: submissionResults });
};

// @desc    Update a coding problem
// @route   PUT /api/problems/:problemId
// @access  Private/Teacher
const updateProblem = async (req, res) => {
  const { title, description, testCases, codeTemplates } = req.body;
  const problem = await Problem.findById(req.params.problemId);

  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  // Check if the user is the teacher who created the problem
  if (problem.teacher.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to edit this problem');
  }

  problem.title = title || problem.title;
  problem.description = description || problem.description;
  problem.testCases = testCases || problem.testCases;
  problem.codeTemplates = codeTemplates || problem.codeTemplates;

  const updatedProblem = await problem.save();
  res.json(updatedProblem);
};


export { createProblem, getProblemsForClassroom, getProblemById, submitSolution, getProblemSubmissions, runCode, updateProblem };