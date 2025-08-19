import Classroom from '../models/classroomModel.js';
import User from '../models/userModel.js';

// @desc    Create a new classroom
// @route   POST /api/classrooms
// @access  Private/Teacher
const createClassroom = async (req, res) => {
  const { name, subject } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ message: 'Please provide a name and subject' });
  }

  const classroom = await Classroom.create({
    name,
    subject,
    teacher: req.user._id,
  });

  res.status(201).json(classroom);
};

// @desc    Get classrooms for the logged-in user
// @route   GET /api/classrooms
// @access  Private
const getClassrooms = async (req, res) => {
  let classrooms;
  if (req.user.role === 'Teacher') {
    // Find classrooms where the user is the teacher
    classrooms = await Classroom.find({ teacher: req.user._id });
  } else {
    // Find classrooms where the user is in the students array
    classrooms = await Classroom.find({ students: req.user._id });
  }
  res.status(200).json(classrooms);
};

// @desc    Join a classroom using a join code
// @route   POST /api/classrooms/join
// @access  Private/Student
const joinClassroom = async (req, res) => {
    const { joinCode } = req.body;
    const classroom = await Classroom.findOne({ joinCode });

    if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if student is already enrolled
    if (classroom.students.includes(req.user._id)) {
        return res.status(400).json({ message: 'You are already in this classroom' });
    }

    classroom.students.push(req.user._id);
    await classroom.save();

    res.status(200).json({ message: 'Successfully joined the classroom' });
};// ... (keep existing functions: createClassroom, getClassrooms, joinClassroom)

// @desc    Get a single classroom by ID
// @route   GET /api/classrooms/:id
// @access  Private
const getClassroomById = async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  // Security Check: Ensure the user is either the teacher or an enrolled student
  const isTeacher = classroom.teacher.toString() === req.user._id.toString();
  const isStudent = classroom.students.some(
    (studentId) => studentId.toString() === req.user._id.toString()
  );

  if (!isTeacher && !isStudent) {
    res.status(401);
    throw new Error('Not authorized to access this classroom');
  }

  res.status(200).json(classroom);
};

// Don't forget to export the new function
export { createClassroom, getClassrooms, joinClassroom, getClassroomById };