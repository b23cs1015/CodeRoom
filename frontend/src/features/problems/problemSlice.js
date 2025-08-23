import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import problemService from './problemService';

const initialState = {
  problems: [],
  currentProblem: null,
  submissions: [],
  runResults: [], // For "Run Code" button
  submissionResult: null, // For "Submit" button
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const createProblem = createAsyncThunk(
  'problems/create',
  async ({ problemData, classroomId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await problemService.createProblem(problemData, classroomId, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProblemsForClassroom = createAsyncThunk(
  'problems/getAllForClassroom',
  async (classroomId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await problemService.getProblemsForClassroom(classroomId, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProblemById = createAsyncThunk(
  'problems/getById',
  async (problemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await problemService.getProblemById(problemId, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const runCode = createAsyncThunk(
  'problems/runCode',
  async ({ problemId, solutionData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await problemService.runCode(problemId, solutionData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const submitSolution = createAsyncThunk(
  'problems/submit',
  async ({ problemId, solutionData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await problemService.submitSolution(problemId, solutionData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProblemSubmissions = createAsyncThunk(
  'problems/getSubmissions',
  async (problemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await problemService.getProblemSubmissions(problemId, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProblem = createAsyncThunk(
  'problems/update',
  async ({ problemId, problemData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await problemService.updateProblem(problemId, problemData, token);
    } catch (error) { /* ... error handling ... */ }
  }
);

export const problemSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    reset: (state) => {
      state.currentProblem = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
      state.runResults = [];
      state.submissionResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProblem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProblem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProblemsForClassroom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProblemsForClassroom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.problems = action.payload;
      })
      .addCase(getProblemsForClassroom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProblemById.pending, (state) => {
        state.isLoading = true;
        state.currentProblem = null;
      })
      .addCase(getProblemById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProblem = action.payload;
      })
      .addCase(getProblemById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(runCode.pending, (state) => {
        state.isLoading = true;
        state.runResults = [];
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.runResults = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(submitSolution.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitSolution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.submissionResult = action.payload;
      })
      .addCase(submitSolution.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProblemSubmissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProblemSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submissions = action.payload;
      })
      .addCase(updateProblem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentProblem = action.payload;
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = problemSlice.actions;
export default problemSlice.reducer;