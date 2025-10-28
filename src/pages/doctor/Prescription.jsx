import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  CircularProgress,
  Modal,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { GetRequest, PatchRequest } from "../../apis/config";
import {
  DOCTOR_GET_PATIENTS,
  DOCTOR_UPDATE_PATIENT,
} from "../../apis/endpoints";

//Reusable Modal Component
const InfoModal = ({ open, onClose, title, message }) => (
  <Modal
    open={open}
    onClose={onClose}
    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <Paper
      sx={{
        p: 4,
        textAlign: "center",
        maxWidth: 400,
        borderRadius: 3,
        boxShadow: 6,
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
        {title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {message}
      </Typography>
      <Button variant="contained" color="primary" onClick={onClose}>
        OK
      </Button>
    </Paper>
  </Modal>
);

const Prescription = () => {
  const { user } = useSelector((state) => state.auth);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [form, setForm] = useState({ status: "", notes: "" });
  const [successOpen, setSuccessOpen] = useState(false);
  const [noPatientOpen, setNoPatientOpen] = useState(false);

  //Fetch assigned patients for logged-in doctor
  useEffect(() => {
    const fetchAssignedPatients = async () => {
      try {
        if (!user?.id) return;

        const res = await GetRequest(DOCTOR_GET_PATIENTS(user.id));
        console.log("Fetched patients:", res);

        //Handle API response safely
        const allPatients = Array.isArray(res) ? res : [];

        // Include patients who are assigned to doctor
        // and either have no notes/status OR are pending
        const unupdatedPatients = allPatients.filter(
          (p) =>
            !p.status ||
            p.status.toLowerCase() === "pending" ||
            p.status.trim() === "" ||
            !p.notes ||
            p.notes.trim() === ""
        );

        setPatients(unupdatedPatients);

        //If there are no patients left to prescribe, show modal
        if (unupdatedPatients.length === 0) {
          setNoPatientOpen(true);
        }
      } catch (error) {
        console.error("Error fetching assigned patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedPatients();
  }, [user]);

  //Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Handle form submit
  const handleSubmit = async () => {
    if (!selectedPatient || !form.status || !form.notes) {
      alert("Please fill all fields");
      return;
    }

    try {
      await PatchRequest(DOCTOR_UPDATE_PATIENT(selectedPatient), {
        status: form.status,
        notes: form.notes,
      });

      //Remove updated patient from dropdown
      setPatients((prev) => prev.filter((p) => p.id !== selectedPatient));

      //Show success modal
      setSuccessOpen(true);
      setForm({ status: "", notes: "" });
      setSelectedPatient("");

      //If that was the last patient, show "no patients left" modal
      if (patients.length === 1) {
        setNoPatientOpen(true);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update patient");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Patient Status & Notes
        </Typography>

        <Paper sx={{ p: 3, maxWidth: 600 }}>
          <TextField
            select
            fullWidth
            label="Select Assigned Patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            margin="normal"
            disabled={patients.length === 0}
          >
            {patients.length > 0 ? (
              patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name || p.patient_name || "Unnamed Patient"}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No patients available</MenuItem>
            )}
          </TextField>

          <TextField
            select
            fullWidth
            name="status"
            label="Status"
            value={form.status}
            onChange={handleChange}
            margin="normal"
            disabled={patients.length === 0}
          >
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            margin="normal"
            disabled={patients.length === 0}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
            disabled={patients.length === 0}
          >
            Update Patient
          </Button>
        </Paper>
      </Box>

      <InfoModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Success"
        message="Patient updated successfully!"
      />

      <InfoModal
        open={noPatientOpen}
        onClose={() => setNoPatientOpen(false)}
        title="No Patients"
        message="There are no patients left to prescribe."
      />
    </Box>
  );
};

export default Prescription;
