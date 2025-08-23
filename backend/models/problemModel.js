import mongoose from 'mongoose';

const testCaseSchema = mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const problemSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
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
    // Ensure this section is exactly as follows
    codeTemplates: [
        {
            language: { type: String, required: true, enum: ['javascript', 'python', 'cpp'] },
            template: { type: String, required: true }
        }
    ],
    testCases: [testCaseSchema],
  },
  { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;