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
  Button,
  TextField,
} from "@mui/material";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import {
  GetRequest,
  PatchRequest,
  DeleteRequest,
} from "../../../apis/config";
import {
  ADMIN_GET_PATIENTS,
  ADMIN_UPDATE_PATIENT,
  ADMIN_DELETE_PATIENT,
} from "../../../apis/endpoints";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  //Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await GetRequest(ADMIN_GET_PATIENTS);
      setPatients(res);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  //Start editing a patient
  const handleEdit = (patient) => {
    setEditingPatient(patient.id);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    });
  };

  //Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Save updated data (PATCH)
  const handleSave = async (id) => {
    try {
      await PatchRequest(ADMIN_UPDATE_PATIENT(id), formData);
      setEditingPatient(null);
      fetchPatients();
    } catch (err) {
      console.error("Error updating patient:", err);
    }
  };

  //Delete patient (DELETE)
  const handleDelete = async (id) => {
    try {
      await DeleteRequest(ADMIN_DELETE_PATIENT(id));
      fetchPatients();
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Patient List
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
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Phone</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.length > 0 ? (
                  patients.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>
                        {editingPatient === p.id ? (
                          <TextField
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            size="small"
                          />
                        ) : (
                          p.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPatient === p.id ? (
                          <TextField
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            size="small"
                          />
                        ) : (
                          p.email
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPatient === p.id ? (
                          <TextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            size="small"
                          />
                        ) : (
                          p.phone
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPatient === p.id ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => handleSave(p.id)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => setEditingPatient(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => handleEdit(p)}
                            >
                              Edit
                            </Button>
                            <Button
                              color="error"
                              size="small"
                              onClick={() => handleDelete(p.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No patients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default PatientList;
