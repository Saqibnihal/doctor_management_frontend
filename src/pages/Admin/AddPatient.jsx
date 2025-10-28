import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { PostRequest } from '../../apis/config';
import { ADMIN_CREATE_PATIENT } from '../../apis/endpoints';

const AddPatient = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password || !form.name) {
      setIsError(true);
      setModalMessage('Please fill all required fields.');
      setOpenModal(true);
      return;
    }

    try {
      const response = await PostRequest(ADMIN_CREATE_PATIENT, form);

      // ✅ Detect duplicate or existing user
      if (
        response?.message?.toLowerCase().includes('exists') ||
        response?.message?.toLowerCase().includes('duplicate')
      ) {
        setIsError(true);
        setModalMessage('A patient with this username or email already exists.');
      } else {
        setIsError(false);
        setModalMessage(response.message || 'Patient added successfully!');

        // ✅ Reset form
        setForm({
          username: '',
          password: '',
          name: '',
          email: '',
          phone: '',
        });
      }

      setOpenModal(true);
    } catch (error) {
      console.error('Error adding patient:', error);

      const backendMsg = error?.response?.data?.message?.toLowerCase() || '';

      if (backendMsg.includes('exists') || backendMsg.includes('duplicate')) {
        setModalMessage('A patient with this username or email already exists.');
      } else {
        setModalMessage('Failed to add patient! Please try again.');
      }

      setIsError(true);
      setOpenModal(true);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h5" mb={2}>
          Add New Patient
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: 400,
            backgroundColor: '#fff',
            p: 3,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" size="large">
            Add Patient
          </Button>
        </Box>
      </Box>

      {/* ✅ Modal for Success/Error */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle
          sx={{
            color: isError ? 'error.main' : 'success.main',
            fontWeight: 600,
          }}
        >
          {isError ? 'Error' : 'Success'}
        </DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color={isError ? 'error' : 'success'}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddPatient;
