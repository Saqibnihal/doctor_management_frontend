import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import { GetRequest } from "../../../apis/config";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch all appointments booked by patients
  const fetchAppointments = async () => {
    try {
      const res = await GetRequest("/admin/appointments");
      setAppointments(res);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Patient Appointments
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: "gray" }}>
          View all appointments booked by patients.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell><b>Appointment ID</b></TableCell>
                  <TableCell><b>Doctor Name</b></TableCell>
                  <TableCell><b>Patient Name</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Notes</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.id}</TableCell>
                      <TableCell>{a.doctorName || "N/A"}</TableCell>
                      <TableCell>{a.patientName || "N/A"}</TableCell>
                      <TableCell>{a.appointment_date}</TableCell>
                      <TableCell>{a.status || "Pending"}</TableCell>
                      <TableCell>{a.notes || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentList;
