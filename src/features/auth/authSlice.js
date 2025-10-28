import { createSlice } from '@reduxjs/toolkit';
import {
  adminLogin,
  doctorLogin,
  patientLogin,
  registerUser,
} from './authThunks';

// ✅ Parse user safely from localStorage
let parsedUser = null;
const storedUser = localStorage.getItem('user');
if (storedUser && storedUser !== 'undefined') {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch {
    parsedUser = null;
  }
}

const initialState = {
  user: parsedUser,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  role: localStorage.getItem('role') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    // ================= ADMIN LOGIN =================
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.token || 'dummy-admin-token';
        const user = action.payload.admin || action.payload.user || {};

        // ✅ Make sure name field is consistent
        const normalizedUser = {
          id: user.id,
          name: user.name || user.fullName || user.username || 'Admin',
          email: user.email,
          role: 'admin',
        };

        state.user = normalizedUser;
        state.token = token;
        state.role = 'admin';

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'admin');
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // ================= DOCTOR LOGIN =================
    builder
      .addCase(doctorLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doctorLogin.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.token || 'dummy-doctor-token';
        const user = action.payload.doctor || action.payload.user || {};

        const normalizedUser = {
          id: user.id,
          name: user.name || user.fullName || user.username || 'Doctor',
          email: user.email,
          role: 'doctor',
        };

        state.user = normalizedUser;
        state.token = token;
        state.role = 'doctor';

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'doctor');
      })
      .addCase(doctorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // ================= PATIENT LOGIN =================
    builder
      .addCase(patientLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientLogin.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.token || 'dummy-patient-token';
        const user = action.payload.patient || action.payload.user || {};

        const normalizedUser = {
          id: user.id,
          name: user.name || user.fullName || user.username || 'Patient',
          email: user.email,
          role: 'patient',
        };

        state.user = normalizedUser;
        state.token = token;
        state.role = 'patient';

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'patient');
      })
      .addCase(patientLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // ================= REGISTER (PATIENT) =================
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.token || 'dummy-register-token';
        const user = action.payload.user || action.payload.patient || {};

        const normalizedUser = {
          id: user.id,
          name: user.name || user.fullName || user.username || 'Patient',
          email: user.email,
          role: user.role || 'patient',
        };

        state.user = normalizedUser;
        state.token = token;
        state.role = normalizedUser.role;

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('token', token);
        localStorage.setItem('role', normalizedUser.role);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
