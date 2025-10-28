import React, { useEffect } from "react";
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
  Button,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientHistory } from "../../features/patient/patientThunks";

const History = () => {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPatientHistory(user.id));
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Appointment History
        </Typography>

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 3 }}>
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell><b>#</b></TableCell>
                  <TableCell><b>Doctor Name</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Notes</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {history && history.length > 0 ? (
                  history.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.doctor?.name || "Not Available"}</TableCell>
                      <TableCell>
                        {new Date(item.appointment_date).toLocaleDateString() ||
                          "N/A"}
                      </TableCell>
                      <TableCell>{item.notes || "-"}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            item.status === "Completed"
                              ? "green"
                              : item.status === "Cancelled"
                              ? "red"
                              : "#1976d2",
                          fontWeight: 600,
                        }}
                      >
                        {item.status || "Scheduled"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No appointment history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default History;
