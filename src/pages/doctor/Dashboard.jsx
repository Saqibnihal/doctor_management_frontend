import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { GetRequest } from "../../apis/config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth); // Logged-in doctor
  const [assignedPatientsCount, setAssignedPatientsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch assigned patients
  const fetchAssignedPatients = async () => {
    try {
      if (!user?.id) return;
      const res = await GetRequest(`/doctor/${user.id}/patients`);
      const patients = Array.isArray(res) ? res : [];
      setAssignedPatientsCount(patients.length);
    } catch (err) {
      console.error("Failed to load assigned patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedPatients();
  }, [user]);

  // ✅ Dashboard Cards
  const cards = [
    {
      title: "Assigned Patients",
      value: assignedPatientsCount,
      color: "#42a5f5",
      path: "/doctor/appointments",
    },
  ];

  // ✅ Handle card click
  const handleCardClick = (path) => navigate(path);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />

        <Typography variant="h4" gutterBottom fontWeight={600}>
          Doctor Dashboard
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  onClick={() => handleCardClick(card.path)}
                  sx={{
                    backgroundColor: card.color,
                    color: "white",
                    borderRadius: 3,
                    boxShadow: 3,
                    cursor: "pointer",
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" sx={{ mt: 1, fontWeight: "bold" }}>
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
