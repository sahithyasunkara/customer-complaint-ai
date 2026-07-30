import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { BarChart, Bar, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import StatCard from "../components/common/StatCard";
import { getComplaints } from "../services/api";

const COLORS = ["#1565C0", "#2E7D32", "#EF6C00", "#C62828", "#6A1B9A"];

function DashboardPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getComplaints();
        setComplaints(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((item) => (item.status || "open").toLowerCase() === "open").length;
    const resolved = complaints.filter((item) => (item.status || "open").toLowerCase() === "resolved").length;
    const highPriority = complaints.filter((item) => ["high", "urgent", "critical"].includes((item.priority || "").toLowerCase())).length;
    return { total, open, resolved, highPriority };
  }, [complaints]);

  const riskDistribution = useMemo(() => {
    const map = complaints.reduce((acc, item) => {
      const key = (item.severity || "moderate").toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [complaints]);

  const categoryDistribution = useMemo(() => {
    const map = complaints.reduce((acc, item) => {
      const key = item.complaint_category || "General";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  const timelineData = useMemo(() => {
    return complaints.slice(0, 8).map((item, index) => ({
      name: `C${index + 1}`,
      complaints: index + 1,
    }));
  }, [complaints]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={1} mb={3}>
        <Typography variant="h4">Quality Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">
          Operational overview of complaint volume, risk distribution, and AI-assisted triage activity.
        </Typography>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Grid container spacing={2.5} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Complaints" value={stats.total} icon={<AssessmentOutlinedIcon color="primary" />} helperText="All recorded complaints" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Open Complaints" value={stats.open} icon={<FolderOpenOutlinedIcon color="warning" />} helperText="Awaiting triage" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Resolved Complaints" value={stats.resolved} icon={<BarChartOutlinedIcon color="success" />} helperText="Closed cases" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="High Priority Complaints" value={stats.highPriority} icon={<ReportProblemOutlinedIcon color="error" />} helperText="Urgent follow-up" />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Severity Distribution
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskDistribution} dataKey="value" nameKey="name" outerRadius={90}>
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Complaint Category Volume
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#1565C0" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Recent Complaint Activity
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Recent records are shown with quick navigation to complaint details.
          </Typography>
          <Box sx={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#2E7D32" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Divider sx={{ my: 3 }} />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Complaint ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.slice(0, 6).map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.complaint_id}</TableCell>
                    <TableCell>{item.customer_name}</TableCell>
                    <TableCell>{item.complaint_category || "—"}</TableCell>
                    <TableCell>{item.status || "open"}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="primary.main" sx={{ cursor: "pointer" }} onClick={() => navigate(`/complaints/${item.id}`)}>
                        View Details
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardPage;
