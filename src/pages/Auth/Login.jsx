import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, doctorLogin, patientLogin } from '../../features/auth/authThunks';
import { Box, Button, TextField, Typography, MenuItem, Select } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'patient' });
  const { loading, error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, role } = form;

    if (!username || !password) {
      alert('Please fill in both fields.');
      return;
    }

    if (role === 'admin') dispatch(adminLogin({ username, password }));
    else if (role === 'doctor') dispatch(doctorLogin({ username, password }));
    else dispatch(patientLogin({ username, password }));
  };

  // Redirect after login
  useEffect(() => {
    if (user) {
      const userRole = user.role || localStorage.getItem('role');
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    }
  }, [user, navigate]);

  return (
    <Box sx={{ width: 320, mx: 'auto', mt: 10 }}>
      <Typography variant="h5" mb={2}>Login</Typography>

      <form onSubmit={handleSubmit}>
        <Select
          fullWidth
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          sx={{ mb: 2 }}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="patient">Patient</MenuItem>
        </Select>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          name="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {error && (
          <Typography color="error" mt={2}>
            {typeof error === 'string' ? error : error.message}
          </Typography>
        )}

        <Typography mt={2} textAlign="center">
          Don’t have an account?{' '}
          <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Register
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Login;
