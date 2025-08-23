import mongoose from 'mongoose';

const submissionSchema = mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Quiz',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    answers: [
      {
        questionText: String, // Storing the text for easier review
        selectedOptionText: String,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;