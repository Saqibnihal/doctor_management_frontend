import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../apis/api';
import { 
  ADMIN_LOGIN, 
  DOCTOR_LOGIN, 
  PATIENT_LOGIN, 
  PATIENT_REGISTER
} from '../../apis/endpoints';

//LOGIN THUNKS

//Admin login
export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(ADMIN_LOGIN, { username, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Doctor login
export const doctorLogin = createAsyncThunk(
  'auth/doctorLogin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(DOCTOR_LOGIN, { username, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Patient login
export const patientLogin = createAsyncThunk(
  'auth/patientLogin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(PATIENT_LOGIN, { username, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//PATIENT REGISTER THUNK
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(PATIENT_REGISTER, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
