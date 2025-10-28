import React, { useEffect, useState } from "react";
import {
  Box, Toolbar, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, TextField
} from "@mui/material";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import { GetRequest, PatchRequest, DeleteRequest } from "../../../apis/config";
import {
  ADMIN_GET_DOCTORS,
  ADMIN_UPDATE_DOCTOR,
  ADMIN_DELETE_DOCTOR,
} from "../../../apis/endpoints";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({ name: "", specialization: "", phone: "" });

  const fetchDoctors = async () => {
    try {
      const res = await GetRequest(ADMIN_GET_DOCTORS);
      setDoctors(res);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor.id);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (id) => {
    try {
      await PatchRequest(ADMIN_UPDATE_DOCTOR(id), formData);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (err) {
      console.error("Error updating doctor:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await DeleteRequest(ADMIN_DELETE_DOCTOR(id));
        fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err);
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Doctor List</Typography>

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
                  <TableCell><b>Specialization</b></TableCell>
                  <TableCell><b>Phone</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.length > 0 ? (
                  doctors.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.id}</TableCell>
                      <TableCell>
                        {editingDoctor === d.id ? (
                          <TextField name="name" value={formData.name} onChange={handleChange} size="small" />
                        ) : d.name}
                      </TableCell>
                      <TableCell>
                        {editingDoctor === d.id ? (
                          <TextField name="specialization" value={formData.specialization} onChange={handleChange} size="small" />
                        ) : d.specialization}
                      </TableCell>
                      <TableCell>
                        {editingDoctor === d.id ? (
                          <TextField name="phone" value={formData.phone} onChange={handleChange} size="small" />
                        ) : d.phone}
                      </TableCell>
                      <TableCell>
                        {editingDoctor === d.id ? (
                          <>
                            <Button color="success" size="small" onClick={() => handleSave(d.id)} sx={{ mr: 1 }}>Save</Button>
                            <Button color="secondary" size="small" onClick={() => setEditingDoctor(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="small" onClick={() => handleEdit(d)}>Edit</Button>
                            <Button color="error" size="small" onClick={() => handleDelete(d.id)}>Delete</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} align="center">No doctors found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button variant="contained" sx={{ mt: 3 }} onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorList;
