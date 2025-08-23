import express from 'express';
const router = express.Router();
import { getMySubmissions } from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/mysubmissions').get(protect, getMySubmissions);

export default router;