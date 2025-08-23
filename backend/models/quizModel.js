import mongoose from 'mongoose';

const optionSchema = mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false },
});

const questionSchema = mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema],
});

const quizSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Classroom',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;