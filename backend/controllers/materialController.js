import Material from '../models/materialModel.js';
import Classroom from '../models/classroomModel.js';

// @desc    Upload study material
// @route   POST /api/classrooms/:classroomId/materials
// @access  Private/Teacher
const uploadMaterial = async (req, res) => {
  const classroom = await Classroom.findById(req.params.classroomId);

  if (classroom.teacher.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to upload materials to this class');
  }

  if (req.file) {
    const material = new Material({
      classroom: req.params.classroomId,
      user: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
    });
    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } else {
    res.status(400);
    throw new Error('Please upload a file');
  }
};

// @desc    Get all materials for a classroom
// @route   GET /api/classrooms/:classroomId/materials
// @access  Private
const getMaterials = async (req, res) => {
  const materials = await Material.find({ classroom: req.params.classroomId });
  res.json(materials);
};

export { uploadMaterial, getMaterials };