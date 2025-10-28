import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "../components/ProtectedRoute";

// AUTH PAGES 
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

//ADMIN PAGES 
import AdminDashboard from "../pages/Admin/Dashboard";
import AddDoctor from "../pages/Admin/AddDoctor";
import AddPatient from "../pages/Admin/AddPatient";
import AssignPatientToDoctor from "../pages/Admin/AssignPatientToDoctor";
import DoctorList from "../pages/Admin/lists/DoctorList";
import PatientList from "../pages/Admin/lists/PatientList";
import AppointmentList from "../pages/Admin/lists/AppointmentList";

//  DOCTOR PAGES 
import DoctorDashboard from "../pages/doctor/Dashboard";
import Appointment from "../pages/doctor/lists/Appointments";
import Prescription from "../pages/doctor/Prescription";
import Patients from "../pages/doctor/Patient";

// PATIENT PAGES 
import PatientDashboard from "../pages/Patient/Dashboard";
import BookAppointment from "../pages/Patient/BookAppointment";
import History from "../pages/Patient/History";

const AppRoutes = () => {
  const { token, user, role } = useSelector((state) => state.auth);

  // Helper decide landing redirect
  const getRedirect = () => {
    if (!token || !user) return "/login";
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "patient":
        return "/patient/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <Routes>
      {/*  PUBLIC ROUTES  */}
      <Route
        path="/"
        element={<Navigate to={getRedirect()} replace />}
      />
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to={getRedirect()} replace />}
      />
      <Route
        path="/register"
        element={!token ? <Register /> : <Navigate to={getRedirect()} replace />}
      />

      {/*  ADMIN ROUTES  */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-doctor"
        element={
          <ProtectedRoute role="admin">
            <AddDoctor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-patient"
        element={
          <ProtectedRoute role="admin">
            <AddPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assign-patient"
        element={
          <ProtectedRoute role="admin">
            <AssignPatientToDoctor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute role="admin">
            <DoctorList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute role="admin">
            <PatientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute role="admin">
            <AppointmentList />
          </ProtectedRoute>
        }
      />

      {/*  DOCTOR ROUTES  */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute role="doctor">
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute role="doctor">
            <Appointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/prescription"
        element={
          <ProtectedRoute role="doctor">
            <Prescription />
          </ProtectedRoute>
        }
      />

      {/*  PATIENT ROUTES  */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute role="patient">
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/history"
        element={
          <ProtectedRoute role="patient">
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <h2 style={{ textAlign: "center", marginTop: "50px" }}>
            404 - Page Not Found
          </h2>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
