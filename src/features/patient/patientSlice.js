import { createSlice } from '@reduxjs/toolkit';
import { bookAppointment, fetchPatientHistory } from './patientThunks';

const initialState = {
  appointments: [],
  history: [],
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => { state.loading = true; })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(fetchPatientHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default patientSlice.reducer;
