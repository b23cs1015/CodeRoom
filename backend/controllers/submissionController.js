import Submission from '../models/submissionModel.js';

// @desc    Get submissions for the logged-in student
// @route   GET /api/submissions/mysubmissions
// @access  Private/Student
const getMySubmissions = async (req, res) => {
  const submissions = await Submission.find({ student: req.user._id })
    .populate('quiz', 'title') // Populate the quiz field to get the quiz title
    .sort({ createdAt: -1 }); // Show the most recent first

  res.json(submissions);
};

export { getMySubmissions };