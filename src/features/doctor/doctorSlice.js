import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDoctorPatients,
  fetchDoctorAppointments,
  updatePatientNotes,
} from './doctorThunks';

const initialState = {
  patients: [],
  appointments: [],
  loading: false,
  error: null,
  successMessage: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch Doctor's Patients
      .addCase(fetchDoctorPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchDoctorPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Fetch Doctor's Appointments
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Update Patient Notes / Prescriptions
      .addCase(updatePatientNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatientNotes.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Patient notes updated successfully';
      })
      .addCase(updatePatientNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = doctorSlice.actions;
export default doctorSlice.reducer;
