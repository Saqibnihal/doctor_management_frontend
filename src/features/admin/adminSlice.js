import { createSlice } from '@reduxjs/toolkit';
import { addDoctor, addPatient, fetchLists } from './adminThunks';

const initialState = {
  doctors: [],
  patients: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => { state.loading = true; })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.patients = action.payload.patients;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      });
  },
});

export default adminSlice.reducer;
