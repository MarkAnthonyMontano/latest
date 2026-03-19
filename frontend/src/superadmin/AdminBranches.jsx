import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../apiConfig";

// MUI
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert
} from "@mui/material";

// Icons
import BusinessIcon from "@mui/icons-material/Business";
import SaveIcon from "@mui/icons-material/Save";
import EventIcon from "@mui/icons-material/Event";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/branches`);
      setBranches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (branch) => {
    try {
      await axios.put(`${API_BASE_URL}/auth/branches/${branch.branch_id}`, {
        registration_open: branch.registration_open,
        start_date: branch.start_date,
        end_date: branch.end_date,
      });

      setSnack({ open: true, message: "Updated successfully!", severity: "success" });
      fetchBranches();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Update failed", severity: "error" });
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...branches];
    updated[index][field] = value;
    setBranches(updated);
  };

  return (
    <Box sx={{ p: 4 }}>
      
      {/* Title */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        <BusinessIcon sx={{ mr: 1 }} />
        Branch Registration Settings
      </Typography>

      <Grid container spacing={3}>
        {branches.map((b, index) => (
          <Grid item xs={12} md={6} key={b.branch_id}>
            <Card sx={{ borderRadius: "16px", boxShadow: 3 }}>
              <CardContent>

                {/* Branch Name */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  {b.branch_name}
                </Typography>

                {/* Toggle */}
                <Box display="flex" alignItems="center" mb={2}>
                  <ToggleOnIcon sx={{ mr: 1 }} />
                  <Typography sx={{ mr: 2 }}>Registration</Typography>
                  <Switch
                    checked={b.registration_open === 1}
                    onChange={(e) =>
                      handleChange(index, "registration_open", e.target.checked ? 1 : 0)
                    }
                  />
                  <Typography>
                    {b.registration_open === 1 ? "Open" : "Closed"}
                  </Typography>
                </Box>

                {/* Dates */}
                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <EventIcon sx={{ mr: 1, fontSize: 18 }} />
                    Start Date
                  </Typography>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={b.start_date || ""}
                    onChange={(e) =>
                      handleChange(index, "start_date", e.target.value)
                    }
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <EventIcon sx={{ mr: 1, fontSize: 18 }} />
                    End Date
                  </Typography>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={b.end_date || ""}
                    onChange={(e) =>
                      handleChange(index, "end_date", e.target.value)
                    }
                  />
                </Box>

                {/* Save Button */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SaveIcon />}
                  onClick={() => handleUpdate(b)}
                  sx={{ borderRadius: "10px", fontWeight: "bold" }}
                >
                  Save Changes
                </Button>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>

    </Box>
  );
};

export default AdminBranches;