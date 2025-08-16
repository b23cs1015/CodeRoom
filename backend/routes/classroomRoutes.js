import express from 'express';
const router = express.Router();
import { createClassroom, getMyClassrooms } from '../controllers/classroomController.js';
import { protect, teacher } from '../middleware/authMiddleware.js';

router.route('/').post(protect, teacher, createClassroom).get(protect, teacher, getMyClassrooms);

// Example for other routes:
// router.route('/:id').get(protect, getClassroomDetails);
// router.route('/:id/join').post(protect, joinClassroom);
// router.route('/:id/announcements').post(protect, teacher, createAnnouncement);

export default router;