import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getComplaint } from "../services/api";

function ComplaintDetailsPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaint = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getComplaint(Number(complaintId));
        setComplaint(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load complaint.");
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) {
      loadComplaint();
    }
  }, [complaintId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !complaint) {
    return (
      <Box>
        <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="error">{error || "Complaint was not found."}</Alert>
      </Box>
    );
  }

  const resolutionHint =
    complaint.priority === "urgent" || complaint.severity === "critical"
      ? "Escalate to the quality leadership team and prepare a corrective action plan within 24 hours."
      : complaint.priority === "high"
        ? "Route to operations support and review potential process controls immediately."
        : "Monitor the complaint lifecycle closely and confirm the response plan with the quality team.";

  return (
    <Box>
      <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back to complaints
      </Button>

      <Stack spacing={3}>
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Complaint #{complaint.id}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {complaint.customer_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  {complaint.complaint_description}
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Chip label={complaint.status || "open"} color="primary" />
                <Chip label={complaint.priority || "medium"} color="warning" />
                <Chip label={complaint.severity || "moderate"} color="secondary" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PersonOutlineOutlinedIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Customer</Typography>
                          <Typography fontWeight={600}>{complaint.customer_name}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <DescriptionOutlinedIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Complaint ID</Typography>
                          <Typography fontWeight={600}>{complaint.complaint_id}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Complaint Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">Product</Typography>
                      <Typography fontWeight={600}>{complaint.product_name || "—"}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">Batch</Typography>
                      <Typography fontWeight={600}>{complaint.batch_number || "—"}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">Category</Typography>
                      <Typography fontWeight={600}>{complaint.complaint_category || "—"}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">Quantity</Typography>
                      <Typography fontWeight={600}>{complaint.quantity ?? "—"}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    AI Analysis
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    AI analysis is available for this complaint and can help support next-step triage.
                  </Alert>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Suggested Resolution</Typography>
                      <Typography fontWeight={600}>{resolutionHint}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Summary</Typography>
                      <Typography fontWeight={600}>{complaint.complaint_description}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Timeline
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <CalendarTodayOutlinedIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Created</Typography>
                          <Typography fontWeight={600}>{new Date(complaint.created_at).toLocaleString()}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Divider />
                    <Box>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <WarningAmberOutlinedIcon color="warning" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Updated</Typography>
                          <Typography fontWeight={600}>{new Date(complaint.updated_at).toLocaleString()}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Attachments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No attachments are currently linked to this complaint. Uploaded documents can be surfaced here in a future integration.
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

export default ComplaintDetailsPage;
