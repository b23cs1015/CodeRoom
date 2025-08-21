import express from 'express';
const router = express.Router({ mergeParams: true });
import { uploadMaterial, getMaterials } from '../controllers/materialController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/')
  .post(protect, upload.single('material'), uploadMaterial) // 'material' is the form field name
  .get(protect, getMaterials);

export default router;