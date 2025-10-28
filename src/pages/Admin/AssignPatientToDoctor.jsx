import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GetRequest, PatchRequest } from "../../apis/config";
import {
  ADMIN_GET_ALL_DOCTORS,
  ADMIN_GET_ALL_PATIENTS,
  ADMIN_ASSIGN_PATIENT_TO_DOCTOR,
} from "../../apis/endpoints";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const AssignPatientToDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [assignedPairs, setAssignedPairs] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ Fetch doctors and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes] = await Promise.all([
          GetRequest(ADMIN_GET_ALL_DOCTORS),
          GetRequest(ADMIN_GET_ALL_PATIENTS),
        ]);

        const rawDoctors = doctorsRes?.doctors || doctorsRes || [];
        const rawPatients = patientsRes?.patients || patientsRes || [];

        // ✅ Separate assigned & unassigned patients
        const unassignedPatients = rawPatients.filter((p) => !p.doctor_id);
        const assignedPatients = rawPatients.filter((p) => p.doctor_id);

        setDoctors(rawDoctors);
        setPatients(unassignedPatients);

        // ✅ Build assigned pairs table
        const pairs = assignedPatients.map((patient) => {
          const doctor = rawDoctors.find((d) => d.id === patient.doctor_id);
          return {
            patientName: patient.name,
            patientEmail: patient.email,
            doctorName: doctor ? doctor.name : "Unknown",
            specialization: doctor ? doctor.specialization : "N/A",
          };
        });
        setAssignedPairs(pairs);
      } catch (error) {
        console.error("Error fetching doctors/patients:", error);
        setModalMessage("Failed to fetch data. Try again later.");
        setIsSuccess(false);
        setModalOpen(true);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Assign
  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedPatient) {
      setModalMessage("Please select both doctor and patient.");
      setIsSuccess(false);
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await PatchRequest(
        ADMIN_ASSIGN_PATIENT_TO_DOCTOR(selectedPatient),
        { doctor_id: selectedDoctor }
      );

      setModalMessage(response.message || "Patient assigned successfully!");
      setIsSuccess(true);

      // ✅ Update assigned pairs
      const assignedPatient = patients.find((p) => p.id === selectedPatient);
      const assignedDoctor = doctors.find((d) => d.id === selectedDoctor);

      setAssignedPairs((prev) => [
        ...prev,
        {
          patientName: assignedPatient?.name,
          patientEmail: assignedPatient?.email,
          doctorName: assignedDoctor?.name,
          specialization: assignedDoctor?.specialization,
        },
      ]);

      // ✅ Remove from dropdowns
      setPatients((prev) => prev.filter((p) => p.id !== selectedPatient));
      setDoctors((prev) => prev.filter((d) => d.id !== selectedDoctor));

      // ✅ Reset selections
      setSelectedDoctor("");
      setSelectedPatient("");
    } catch (error) {
      console.error("Error assigning:", error);
      setModalMessage(error.response?.data?.message || "Something went wrong.");
      setIsSuccess(false);
    } finally {
      setModalOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ===== Form Section ===== */}
        <Box
          component={Paper}
          sx={{
            width: 400,
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: "#fff",
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: 600, mb: 3 }}
          >
            Assign Patient to Doctor
          </Typography>

          <form onSubmit={handleAssign}>
            {/* Patient Dropdown */}
            <TextField
              select
              fullWidth
              label="Select Patient"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              sx={{ mb: 3 }}
            >
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name} ({patient.email})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No unassigned patients</MenuItem>
              )}
            </TextField>

            {/* Doctor Dropdown */}
            <TextField
              select
              fullWidth
              label="Select Doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              sx={{ mb: 3 }}
            >
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} ({doctor.specialization})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No doctors available</MenuItem>
              )}
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
                mb: 2,
              }}
            >
              {loading ? "Assigning..." : "Assign"}
            </Button>
          </form>
        </Box>

        {/* ===== Assigned Pairs Table ===== */}
        <Box sx={{ width: "80%", mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Assigned Patients to Doctors
          </Typography>

          {assignedPairs.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Patient Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Patient Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Doctor Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Specialization</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignedPairs.map((pair, index) => (
                    <TableRow key={index}>
                      <TableCell>{pair.patientName}</TableCell>
                      <TableCell>{pair.patientEmail}</TableCell>
                      <TableCell>Dr. {pair.doctorName}</TableCell>
                      <TableCell>{pair.specialization}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No assigned pairs yet.</Typography>
          )}
        </Box>
      </Box>

      {/* ✅ Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: isSuccess ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {isSuccess ? "Success" : "Error"}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {modalMessage}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setModalOpen(false)}
            sx={{
              backgroundColor: isSuccess ? "green" : "red",
              "&:hover": {
                backgroundColor: isSuccess ? "#2e7d32" : "#c62828",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AssignPatientToDoctor;
