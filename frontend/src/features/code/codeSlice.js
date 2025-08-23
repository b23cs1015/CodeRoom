import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import codeService from './codeService';

const initialState = {
  output: '',
  isLoading: false,
  isError: false,
  message: '',
};

// Execute code
export const executeCode = createAsyncThunk(
  'code/execute',
  async (codeData, thunkAPI) => {
    try {
      // Get the token from the auth state
      const token = thunkAPI.getState().auth.user.token;
      // Pass the token to the service function
      return await codeService.executeCode(codeData, token); 
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(executeCode.fulfilled, (state, action) => {
        state.isLoading = false;
        // The payload from our API is an object with stdout and stderr
        // We need to check if it exists and handle both cases.
        if (action.payload) {
            state.output = action.payload.stdout || action.payload.stderr || "No output received.";
        } else {
            state.output = "Execution failed to return a result.";
        }
      })
      .addCase(executeCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.output = action.payload; // Display the error message in the output
      });
  },
});

export const { reset } = codeSlice.actions;
export default codeSlice.reducer;