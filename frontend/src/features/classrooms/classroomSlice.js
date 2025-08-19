import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classroomService from './classroomService';

const initialState = {
  classrooms: [],
  selectedClassroom: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// 1. CREATE CLASSROOM
export const createClassroom = createAsyncThunk(
  'classrooms/create',
  async (classroomData, thunkAPI) => {
    try {
      // 👇 ADDED SAFETY CHECK 👇
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }
      const token = user.token;
      return await classroomService.createClassroom(classroomData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. GET ALL CLASSROOMS
export const getClassrooms = createAsyncThunk(
  'classrooms/getAll',
  async (_, thunkAPI) => {
    try {
      // 👇 ADDED SAFETY CHECK 👇
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }
      const token = user.token;
      return await classroomService.getClassrooms(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 3. JOIN A CLASSROOM
export const joinClassroom = createAsyncThunk(
  'classrooms/join',
  async (joinCode, thunkAPI) => {
    try {
      // 👇 ADDED SAFETY CHECK 👇
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }
      const token = user.token;
      return await classroomService.joinClassroom(joinCode, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 4. GET ONE CLASSROOM
export const getOneClassroom = createAsyncThunk(
  'classrooms/getOne',
  async (classroomId, thunkAPI) => {
    try {
      // 👇 ADDED SAFETY CHECK 👇
      const user = thunkAPI.getState().auth.user;
      if (!user) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }
      const token = user.token;
      return await classroomService.getOneClassroom(classroomId, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// THE SINGLE, CORRECT SLICE DEFINITION
export const classroomSlice = createSlice({
  name: 'classrooms',
  initialState,
  reducers: {
    reset: (state) => {
      state.selectedClassroom = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
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
      })
      .addCase(getOneClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedClassroom = action.payload;
      })
      .addCase(getOneClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = classroomSlice.actions;
export default classroomSlice.reducer;