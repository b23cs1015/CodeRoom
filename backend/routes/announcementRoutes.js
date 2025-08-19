import express from 'express';
const router = express.Router({ mergeParams: true }); // Important: mergeParams allows us to get classroomId
import {
  createAnnouncement,
  getAnnouncements,
} from '../controllers/announcementController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createAnnouncement).get(protect, getAnnouncements);

export default router;