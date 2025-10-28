import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../apis/api';
import {
  PATIENT_GET_DOCTORS,
  PATIENT_BOOK_APPOINTMENT,
  PATIENT_GET_APPOINTMENTS,
} from '../../apis/endpoints';

//Fetch list of available doctors
export const fetchDoctors = createAsyncThunk(
  'patient/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(PATIENT_GET_DOCTORS);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Book an appointment
export const bookAppointment = createAsyncThunk(
  'patient/bookAppointment',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(PATIENT_BOOK_APPOINTMENT, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Fetch patient appointment history
export const fetchPatientHistory = createAsyncThunk(
  'patient/fetchPatientHistory',
  async (patientId, { rejectWithValue }) => {
    try {
      const res = await api.get(PATIENT_GET_APPOINTMENTS(patientId));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
