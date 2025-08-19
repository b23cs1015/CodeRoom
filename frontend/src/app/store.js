import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import classroomReducer from '../features/classrooms/classroomSlice'; // Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classrooms: classroomReducer, // Add the reducer
  },
});