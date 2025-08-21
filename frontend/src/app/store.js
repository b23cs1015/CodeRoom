import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import classroomReducer from '../features/classrooms/classroomSlice';
import announcementReducer from '../features/announcements/announcementSlice';
import materialReducer from '../features/materials/materialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classrooms: classroomReducer,
    announcements: announcementReducer, 
    materials: materialReducer,
  },
});