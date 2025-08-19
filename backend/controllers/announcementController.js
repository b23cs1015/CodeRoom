import Announcement from '../models/announcementModel.js';
import Classroom from '../models/classroomModel.js';

// @desc    Create an announcement
// @route   POST /api/classrooms/:classroomId/announcements
// @access  Private/Teacher
const createAnnouncement = async (req, res) => {
  const { text } = req.body;
  const classroom = await Classroom.findById(req.params.classroomId);

  // Check if user is the teacher of this class
  if (classroom.teacher.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to make announcements in this class');
  }

  const announcement = await Announcement.create({
    text,
    user: req.user._id,
    classroom: req.params.classroomId,
  });

  res.status(201).json(announcement);
};

// @desc    Get all announcements for a classroom
// @route   GET /api/classrooms/:classroomId/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({
    classroom: req.params.classroomId,
  }).sort({ createdAt: -1 }); // Show newest first

  res.status(200).json(announcements);
};

export { createAnnouncement, getAnnouncements };