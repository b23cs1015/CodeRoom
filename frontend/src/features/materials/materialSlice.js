import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import materialService from './materialService';

const initialState = {
  materials: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Async Thunks - These are correct
export const uploadMaterial = createAsyncThunk('materials/upload', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await materialService.uploadMaterial(data, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getMaterials = createAsyncThunk('materials/getAll', async (classroomId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await materialService.getMaterials(classroomId, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});


// ✅ Add the 'export' keyword here
export const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadMaterial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials.push(action.payload);
      })
      .addCase(getMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload;
      });
  },
});

export const { reset } = materialSlice.actions;
export default materialSlice.reducer;