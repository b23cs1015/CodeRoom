import mongoose from 'mongoose';

const resultSchema = mongoose.Schema({
    testCase: { type: mongoose.Schema.Types.ObjectId },
    passed: { type: Boolean, required: true },
    actualOutput: { type: String },
});

const problemSubmissionSchema = mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Problem',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    language: { type: String, required: true },
    code: { type: String, required: true },
    score: { type: Number, required: true },
    totalTestCases: { type: Number, required: true },
    results: [resultSchema],
  },
  { timestamps: true }
);

const ProblemSubmission = mongoose.model('ProblemSubmission', problemSubmissionSchema);
export default ProblemSubmission;