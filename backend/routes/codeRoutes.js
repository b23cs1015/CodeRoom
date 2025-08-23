import express from 'express';
const router = express.Router();
import { executeCode } from '../controllers/codeController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/execute', protect, executeCode);

export default router;