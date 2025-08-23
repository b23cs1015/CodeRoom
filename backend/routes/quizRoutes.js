import express from 'express';
// We need two separate routers. One for classroom-nested routes, one for general quiz routes.
const classroomRouter = express.Router({ mergeParams: true });
const quizRouter = express.Router();

import {
  createQuiz,
  getQuizzesForClassroom,
  getQuizById,
  submitQuiz,
  getQuizSubmissions,
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

// Routes nested under /api/classrooms/:classroomId/quizzes
classroomRouter.route('/').post(protect, createQuiz).get(protect, getQuizzesForClassroom);

// General quiz routes under /api/quizzes
quizRouter.route('/:quizId').get(protect, getQuizById);
quizRouter.route('/:quizId/submit').post(protect, submitQuiz);
quizRouter.route('/:quizId/submissions').get(protect, getQuizSubmissions);

export { classroomRouter, quizRouter };