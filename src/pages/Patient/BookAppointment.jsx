import React, { useState, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { GetRequest, PostRequest } from "../../apis/config";
import {
  PATIENT_GET_DOCTORS,
  PATIENT_BOOK_APPOINTMENT,
} from "../../apis/endpoints";

const BookAppointment = () => {
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    notes: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  //Fetch doctors when component loads
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await GetRequest(PATIENT_GET_DOCTORS);
        console.log("🩺 Doctors API:", res);

        if (Array.isArray(res)) {
          setDoctors(res);
        } else if (Array.isArray(res?.data)) {
          setDoctors(res.data);
        } else if (Array.isArray(res?.doctors)) {
          setDoctors(res.doctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  //Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //Close modal
  const handleClose = () => setOpenModal(false);

  //Handle submit (main logic)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.doctorId || !form.date || !form.notes) {
      setIsError(true);
      setModalMessage("Please fill all required fields.");
      setOpenModal(true);
      return;
    }

    try {
      //Get logged-in patient data from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        setIsError(true);
        setModalMessage("Patient not found. Please log in again.");
        setOpenModal(true);
        return;
      }

      //Prepare payload for backend
      const payload = {
        patient_id: storedUser.id,
        doctor_id: form.doctorId,
        appointment_date: form.date,
        notes: form.notes,
      };

      console.log("📦 Payload sent to backend:", payload);

      const response = await PostRequest(PATIENT_BOOK_APPOINTMENT, payload);

      setIsError(false);
      setModalMessage(response?.message || "Appointment booked successfully!");

      //Reset form
      setForm({
        doctorId: "",
        date: "",
        notes: "",
      });

      setOpenModal(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      const backendMsg =
        error?.response?.data?.message || "Failed to book appointment.";
      setIsError(true);
      setModalMessage(backendMsg);
      setOpenModal(true);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h4" mb={2}>
          Book Appointment
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            backgroundColor: "#fff",
            p: 3,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <TextField
            select
            label="Select Doctor"
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            required
          >
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.name || doc.fullName || "Unknown Doctor"} —{" "}
                  {doc.specialization || "General Practitioner"}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No doctors available</MenuItem>
            )}
          </TextField>

          <TextField
            label="Appointment Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={handleChange}
            required
          />

          <TextField
            label="Symptoms / Notes"
            name="notes"
            multiline
            rows={3}
            value={form.notes}
            onChange={handleChange}
            required
          />

          <Button type="submit" variant="contained" size="large">
            Book Appointment
          </Button>
        </Box>
      </Box>

      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle
          sx={{
            color: isError ? "error.main" : "success.main",
            fontWeight: 600,
          }}
        >
          {isError ? "Error" : "Success"}
        </DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color={isError ? "error" : "success"}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookAppointment;
