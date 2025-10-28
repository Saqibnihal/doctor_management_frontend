import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../apis/api';
import {
  DOCTOR_GET_PATIENTS,
  DOCTOR_GET_APPOINTMENTS,
  DOCTOR_UPDATE_PATIENT,
} from '../../apis/endpoints';

//Fetch all patients assigned to a specific doctor
export const fetchDoctorPatients = createAsyncThunk(
  'doctor/fetchPatients',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await api.get(DOCTOR_GET_PATIENTS(doctorId));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Fetch all appointments for a specific doctor
export const fetchDoctorAppointments = createAsyncThunk(
  'doctor/fetchAppointments',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await api.get(DOCTOR_GET_APPOINTMENTS(doctorId));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Update patient notes / prescriptions
export const updatePatientNotes = createAsyncThunk(
  'doctor/updatePatientNotes',
  async ({ patientId, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(DOCTOR_UPDATE_PATIENT(patientId), data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
