import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import classroomReducer from '../features/classrooms/classroomSlice';
import announcementReducer from '../features/announcements/announcementSlice'; // 1. Import the new reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classrooms: classroomReducer,
    announcements: announcementReducer, // 2. Add it to the reducer object
  },
});