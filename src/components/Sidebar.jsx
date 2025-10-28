import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user, role } = useSelector((state) => state.auth);
  const userRole = role || user?.role; // safer fallback

  // ===== ADMIN LINKS =====
  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Add Doctor', path: '/admin/add-doctor' },
    { name: 'Add Patient', path: '/admin/add-patient' },
    { name: 'Assign Patient to Doctor', path: '/admin/assign-patient' },
    { name: 'Doctor List', path: '/admin/doctors' },
    { name: 'Patient List', path: '/admin/patients' },
    { name: 'Appointments', path: '/admin/appointments' },
  ];

  // ===== DOCTOR LINKS =====
  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard' },
    { name: 'My Patients', path: '/doctor/patients' },
    { name: 'Prescriptions', path: '/doctor/prescription' },
    { name: 'Appointments', path: '/doctor/appointments' },
  ];

  // ===== PATIENT LINKS =====
  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard' },
    { name: 'Book Appointment', path: '/patient/book-appointment' },
    { name: 'My Appointments', path: '/patient/history' }, 
  ];

  const links =
    userRole === 'admin'
      ? adminLinks
      : userRole === 'doctor'
      ? doctorLinks
      : patientLinks;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          background: '#f7f9fc',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <List>
        {links.map((item) => (
          <ListItem
            key={item.name}
            component={Link}
            to={item.path}
            sx={{
              '&:hover': { backgroundColor: '#e3f2fd' },
              borderRadius: 1,
              mx: 1,
              color: 'black',
              textDecoration: 'none',
            }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
