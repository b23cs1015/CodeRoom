import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classroomService from './classroomService';

const initialState = {
  classrooms: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Create new classroom
export const createClassroom = createAsyncThunk(
  'classrooms/create',
  async (classroomData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await classroomService.createClassroom(classroomData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user classrooms
export const getClassrooms = createAsyncThunk(
  'classrooms/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await classroomService.getClassrooms(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Join classroom - THIS WAS THE MISSING PART
export const joinClassroom = createAsyncThunk(
  'classrooms/join',
  async (joinCode, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await classroomService.joinClassroom(joinCode, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const classroomSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classrooms.push(action.payload);
      })
      .addCase(createClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getClassrooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClassrooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classrooms = action.payload;
      })
      .addCase(getClassrooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(joinClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(joinClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = classroomSlice.actions;
export default classroomSlice.reducer;