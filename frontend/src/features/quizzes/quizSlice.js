import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quizService from './quizService';

const initialState = {
  quizzes: [],
  currentQuiz: null,
  submissionResult: null,
  submissions: [], // For teacher's results view
  mySubmissions: [], // For the student's score tracker
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const createQuiz = createAsyncThunk(
  'quizzes/create',
  async ({ quizData, classroomId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await quizService.createQuiz(quizData, classroomId, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getQuizzesForClassroom = createAsyncThunk(
    'quizzes/getAllForClassroom',
    async (classroomId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await quizService.getQuizzesForClassroom(classroomId, token);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getQuizById = createAsyncThunk('quizzes/getById', async (quizId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await quizService.getQuizById(quizId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const submitQuiz = createAsyncThunk('quizzes/submit', async ({ quizId, answers }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await quizService.submitQuiz(quizId, answers, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getQuizSubmissions = createAsyncThunk('quizzes/getSubmissions', async (quizId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await quizService.getQuizSubmissions(quizId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMySubmissions = createAsyncThunk('quizzes/getMySubmissions', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await quizService.getMySubmissions(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    reset: (state) => {
      state.quizzes = [];
      state.currentQuiz = null;
      state.submissionResult = null;
      state.submissions = [];
      state.mySubmissions = [];
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuiz.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getQuizzesForClassroom.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(getQuizzesForClassroom.fulfilled, (state, action) => {
          state.isLoading = false;
          state.quizzes = action.payload;
      })
      .addCase(getQuizById.pending, (state) => {
          state.isLoading = true;
          state.currentQuiz = null;
      })
      .addCase(getQuizById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.currentQuiz = action.payload;
      })
      .addCase(submitQuiz.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.submissionResult = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })
      .addCase(getQuizSubmissions.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(getQuizSubmissions.fulfilled, (state, action) => {
          state.isLoading = false;
          state.submissions = action.payload;
      })
      .addCase(getMySubmissions.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(getMySubmissions.fulfilled, (state, action) => {
          state.isLoading = false;
          state.mySubmissions = action.payload;
      });
  },
});

export const { reset } = quizSlice.actions;
export default quizSlice.reducer;