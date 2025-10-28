import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice';
import doctorReducer from '../features/doctor/doctorSlice';
import patientReducer from '../features/patient/patientSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    doctor: doctorReducer,
    patient: patientReducer,
  },
});

export default store;
