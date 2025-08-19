import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import announcementService from './announcementService';

const initialState = {
  announcements: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const createAnnouncement = createAsyncThunk(
  'announcements/create',
  async (data, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }
      const token = user.token;
      return await announcementService.createAnnouncement(data, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAnnouncements = createAsyncThunk(
  'announcements/getAll',
  async (classroomId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }
      const token = user.token;
      return await announcementService.getAnnouncements(classroomId, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements.unshift(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAnnouncements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload;
      })
      .addCase(getAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = announcementSlice.actions;
export default announcementSlice.reducer;