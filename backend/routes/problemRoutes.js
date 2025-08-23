import express from 'express';
const classroomRouter = express.Router({ mergeParams: true });
const problemRouter = express.Router();

import {
  createProblem,
  getProblemsForClassroom,
  getProblemById,
  submitSolution,
  getProblemSubmissions,
  runCode, 
  updateProblem,
} from '../controllers/problemController.js';
import { protect } from '../middleware/authMiddleware.js';

// Routes nested under /api/classrooms/:classroomId/problems
classroomRouter.route('/').post(protect, createProblem).get(protect, getProblemsForClassroom);

// General problem routes under /api/problems
problemRouter.route('/:problemId').get(protect, getProblemById);
problemRouter.route('/:problemId/submit').post(protect, submitSolution);
problemRouter.route('/:problemId/submissions').get(protect, getProblemSubmissions);
problemRouter.route('/:problemId/run').post(protect, runCode);
problemRouter.route('/:problemId')
  .get(protect, getProblemById)
  .put(protect, updateProblem);

export { classroomRouter as problemClassroomRouter, problemRouter };