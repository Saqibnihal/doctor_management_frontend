import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authThunks';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    address: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(registerUser(form));

      // If registration successful
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        mx: 'auto',
        mt: 10,
        p: 3,
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center" fontWeight="bold">
        Patient Registration
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <TextField
          label="Phone"
          type="tel"
          fullWidth
          margin="normal"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <TextField
          label="Age"
          type="number"
          fullWidth
          margin="normal"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <TextField
          label="Address"
          fullWidth
          margin="normal"
          multiline
          minRows={2}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, py: 1 }}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>

        {error && (
          <Typography color="error" mt={2} textAlign="center">
            {typeof error === 'string' ? error : error.message}
          </Typography>
        )}

        <Typography mt={2} textAlign="center">
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Login
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Register;
