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
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const res = await GetRequest("/admin/dashboard");
      setStats(res);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  const cards = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      color: "#42a5f5",
      path: "/admin/doctors",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      color: "#66bb6a",
      path: "/admin/patients",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      color: "#ffca28",
      path: "/admin/appointments",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
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
                    width:200,
                    display: "flex",
                    alignItems: "center", // ✅ Vertically center content
                    justifyContent: "center", // ✅ Horizontally center content
                    textAlign: "center", // ✅ Center text inside
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, letterSpacing: 0.5 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ mt: 1, fontWeight: "bold" }}
                    >
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

export default AdminDashboard;
