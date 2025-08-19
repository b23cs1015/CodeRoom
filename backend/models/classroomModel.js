import mongoose from 'mongoose';
import { nanoid } from 'nanoid'; // For generating unique codes

const classroomSchema = mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a classroom name'],
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
  },
  joinCode: {
    type: String,
    required: true,
    default: () => nanoid(6).toUpperCase(), // Generates a 6-char code
    unique: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom;