import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import classroomRoutes from './routes/classroomRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import { classroomRouter as quizClassroomRouter, quizRouter } from './routes/quizRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { problemClassroomRouter, problemRouter } from './routes/problemRoutes.js';

console.log('--- [1] Starting server.js ---');

dotenv.config();
console.log('--- [2] dotenv configured. ---');

connectDB();
console.log('--- [3] connectDB function called. ---');

const app = express();
console.log('--- [4] Express app initialized. ---');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('--- [5] Core middleware setup complete. ---');

app.get('/', (req, res) => {
  res.send('API is running...');
});
console.log('--- [6] Root route "/" setup. ---');

// API Routes
app.use('/api/users', authRoutes);
console.log('--- [7] Auth routes setup. ---');
app.use('/api/classrooms', classroomRoutes);
console.log('--- [8] Classroom routes setup. ---');
app.use('/api/classrooms/:classroomId/announcements', announcementRoutes);
console.log('--- [9] Announcement routes setup. ---');
app.use('/api/classrooms/:classroomId/materials', materialRoutes);
console.log('--- [10] Material routes setup. ---');
app.use('/api/code', codeRoutes);
console.log('--- [11] Code routes setup. ---');
app.use('/api/classrooms/:classroomId/quizzes', quizClassroomRouter);
console.log('--- [12] Quiz classroom routes setup. ---');
app.use('/api/quizzes', quizRouter);
console.log('--- [13] Quiz routes setup. ---');
app.use('/api/submissions', submissionRoutes);
console.log('--- [14] Submission routes setup. ---');
app.use('/api/classrooms/:classroomId/problems', problemClassroomRouter);
console.log('--- [15] Problem classroom routes setup. ---');
app.use('/api/problems', problemRouter);
console.log('--- [16] Problem routes setup. ---');

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
console.log('--- [17] Static file serving for uploads setup. ---');

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);
console.log('--- [18] Error handling middleware setup. ---');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
console.log('--- [19] Server is now listening. ---');