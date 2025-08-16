import mongoose from 'mongoose';

const classroomSchema = mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  joinCode: { type: String, required: true, unique: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  announcements: [{
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  // You would add refs to materials, problems, quizzes etc. here
}, { timestamps: true });

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom;