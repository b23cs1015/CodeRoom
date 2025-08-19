import express from 'express';
const router = express.Router();
import {
  createClassroom,
  getClassrooms,
  joinClassroom,
  getClassroomById
} from '../controllers/classroomController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route to get all relevant classrooms (for both students and teachers)
router.route('/').get(protect, getClassrooms);

// Route for teachers to create classrooms
router.route('/create').post(protect, createClassroom); // Add teacher middleware later if needed

// Route for students to join a classroom
router.route('/join').post(protect, joinClassroom); // Add student middleware later if needed

router.route('/:id').get(protect, getClassroomById);

export default router;