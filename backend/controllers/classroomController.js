import Classroom from '../models/classroomModel.js';
import { nanoid } from 'nanoid';

// @desc    Create a new classroom
// @route   POST /api/classrooms
// @access  Private/Teacher
const createClassroom = async (req, res) => {
    const { name, subject } = req.body;
    const classroom = new Classroom({
        name,
        subject,
        teacher: req.user._id,
        joinCode: nanoid(6) // Generates a unique 6-character code
    });
    const createdClassroom = await classroom.save();
    res.status(201).json(createdClassroom);
};

// @desc    Get all classrooms for a teacher
// @route   GET /api/classrooms
// @access  Private/Teacher
const getMyClassrooms = async (req, res) => {
    const classrooms = await Classroom.find({ teacher: req.user._id });
    res.json(classrooms);
};

// NOTE: Add other controllers for joining, getting details, posting announcements etc.
// The logic will be similar: find the classroom by ID, update it, and save.

export { createClassroom, getMyClassrooms };