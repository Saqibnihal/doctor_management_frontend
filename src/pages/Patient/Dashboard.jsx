import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientHistory } from "../../features/patient/patientThunks";
import { GetRequest } from "../../apis/config";
import { PATIENT_GET_DOCTORS } from "../../apis/endpoints";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { history, loading: historyLoading } = useSelector(
    (state) => state.patient
  );

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch available doctors for the patient
  const fetchDoctors = async () => {
    try {
      const res = await GetRequest(
        `${PATIENT_GET_DOCTORS}?patient_id=${user?.id}`
      );
      setDoctors(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch patient history using logged-in user ID
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPatientHistory(user.id));
      fetchDoctors();
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f9fafc", minHeight: "100vh" }}>
      <Navbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Patient Dashboard
        </Typography>

        {/* 🧾 Patient Stats Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                p: 2,
                bgcolor: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  Past Appointments
                </Typography>
                {historyLoading ? (
                  <CircularProgress size={30} sx={{ mt: 2 }} />
                ) : (
                  <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                    {history?.length || 0}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 👨‍⚕️ Available Doctors Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4"  gutterBottom>
            Available Doctors
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : doctors.length > 0 ? (
            <Grid container spacing={3}>
              {doctors.map((doc) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: 6,
                      minHeight: 220,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      backgroundColor: "#f9fafb",
                      "&:hover": {
                        boxShadow: 10,
                        transform: "scale(1.05)",
                        backgroundColor: "#f1faff",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <CardContent sx={{ width: "100%" }}>
                      <Typography
                        variant="h5"
                        color="primary"
                        fontWeight={700}
                        gutterBottom
                      >
                        {doc.name || "Unknown Doctor"}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        🩺 {doc.specialization || "General Practitioner"}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        📧 {doc.email || "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        📞 {doc.phone || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                mt: 3,
                textAlign: "center",
                color: "gray",
                fontSize: 18,
              }}
            >
              No doctors available at the moment.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDashboard;
