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
import { ADMIN_CREATE_DOCTOR } from '../../apis/endpoints';

const AddDoctor = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    specialization: '',
    email: '',
    phone: '',
    about: '',
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

    if (!form.username || !form.password || !form.name || !form.specialization) {
      setIsError(true);
      setModalMessage('Please fill all required fields.');
      setOpenModal(true);
      return;
    }

    try {
      const response = await PostRequest(ADMIN_CREATE_DOCTOR, form);

      //Friendly duplicate handling
      if (
        response?.message?.toLowerCase().includes('exists') ||
        response?.message?.toLowerCase().includes('duplicate')
      ) {
        setIsError(true);
        setModalMessage('A doctor with this username or email already exists.');
      } else {
        setIsError(false);
        setModalMessage(response.message || 'Doctor added successfully!');

        // Reset form on success
        setForm({
          username: '',
          password: '',
          name: '',
          specialization: '',
          email: '',
          phone: '',
          about: '',
        });
      }

      setOpenModal(true);
    } catch (error) {
      console.error('Error adding doctor:', error);

      //Handle duplicate error from backend gracefully
      const backendMsg = error?.response?.data?.message?.toLowerCase() || '';

      if (backendMsg.includes('exists') || backendMsg.includes('duplicate')) {
        setModalMessage('A doctor with this username or email already exists.');
      } else {
        setModalMessage('Failed to add doctor! Please try again.');
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
          Add New Doctor
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
            label="Specialization"
            name="specialization"
            value={form.specialization}
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
          <TextField
            label="About"
            name="about"
            multiline
            rows={3}
            value={form.about}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" size="large">
            Add Doctor
          </Button>
        </Box>
      </Box>

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

export default AddDoctor;
