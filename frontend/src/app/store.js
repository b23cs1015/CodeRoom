import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import classroomReducer from '../features/classrooms/classroomSlice';
import announcementReducer from '../features/announcements/announcementSlice';
import materialReducer from '../features/materials/materialSlice';
import codeReducer from '../features/code/codeSlice';
import quizReducer from '../features/quizzes/quizSlice';
import problemReducer from '../features/problems/problemSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classrooms: classroomReducer,
    announcements: announcementReducer, 
    materials: materialReducer,
    code: codeReducer,
    quizzes: quizReducer,
    problems: problemReducer,
  },
});