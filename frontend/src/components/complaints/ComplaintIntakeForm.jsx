import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { resetComplaintForm, setComplaintError, setComplaintSaving, updateComplaintField } from "../../redux/slices/complaintSlice";
import { setAiAnalysis, setAiError, setAiProcessing, setAiProgress } from "../../redux/slices/aiSlice";
import { analyzeComplaint, createComplaint } from "../../services/api";

const severityOptions = ["low", "moderate", "high", "critical"];
const priorityOptions = ["low", "medium", "high", "urgent"];
const sourceOptions = ["Email", "Phone", "Web Form", "Other"];
const categoryOptions = ["Quality", "Packaging", "Labeling", "Complaint", "Product"];

function ComplaintIntakeForm() {
  const dispatch = useDispatch();
  const currentComplaint = useSelector((state) => state.complaint.currentComplaint);
  const saving = useSelector((state) => state.complaint.saving);
  const aiState = useSelector((state) => state.ai);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [pastedText, setPastedText] = useState("");

  const handleFieldChange = (field) => (event) => {
    dispatch(updateComplaintField({ field, value: event.target.value }));
  };

  const handleReset = () => {
    dispatch(resetComplaintForm());
    setUploadedFile(null);
    setUploadedFileName("");
    setPastedText("");
    setSnackbar({ open: true, message: "Form reset successfully.", severity: "info" });
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supported = ["application/pdf", "image/png", "image/jpeg", "text/plain"];
    if (!supported.includes(file.type) && !/\.(pdf|png|jpg|jpeg|txt)$/i.test(file.name)) {
      setSnackbar({ open: true, message: "Unsupported file type. Please choose PDF, PNG, JPG, JPEG, or TXT.", severity: "error" });
      return;
    }

    setUploadedFile(file);
    setUploadedFileName(file.name);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadedFileName("");
  };

  const handleAnalyze = async () => {
    const textInput = pastedText.trim();
    if (!uploadedFile && !textInput) {
      setSnackbar({ open: true, message: "Please add a file or paste text before analyzing.", severity: "error" });
      return;
    }

    dispatch(setAiProcessing(true));
    dispatch(setAiError(null));
    dispatch(setAiProgress({ progress: 10, message: "Preparing analysis request" }));

    try {
      const result = await analyzeComplaint({ file: uploadedFile, text: textInput });
      dispatch(
        setAiAnalysis({
          summary: result.summary,
          riskAssessment: result.risk_badge,
          extractedEntities: result.extracted_data,
          missingFields: result.missing_fields || [],
          confidenceScore: result.confidence,
          progress: result.progress || 100,
          progressMessage: "Analysis complete",
          chatMessages: [{ role: "assistant", message: result.summary || "Analysis complete" }],
        })
      );
      dispatch(setAiProgress({ progress: 100, message: "Analysis complete" }));

      const extracted = result.extracted_data || {};
      const formValues = {
        complaintId: extracted.complaint_id || currentComplaint.complaintId || "",
        complaintSource: extracted.complaint_source || currentComplaint.complaintSource || "",
        customerName: extracted.customer_name || currentComplaint.customerName || "",
        productName: extracted.product_name || currentComplaint.productName || "",
        productStrength: extracted.product_strength || currentComplaint.productStrength || "",
        batchNumber: extracted.batch_number || currentComplaint.batchNumber || "",
        manufacturingDate: extracted.manufacturing_date || currentComplaint.manufacturingDate || "",
        expiryDate: extracted.expiry_date || currentComplaint.expiryDate || "",
        quantity: extracted.quantity || currentComplaint.quantity || "",
        complaintCategory: extracted.complaint_category || currentComplaint.complaintCategory || "",
        complaintDescription: extracted.complaint_description || currentComplaint.complaintDescription || "",
        severity: extracted.severity || currentComplaint.severity || "",
        priority: extracted.priority || currentComplaint.priority || "",
      };

      Object.entries(formValues).forEach(([field, value]) => {
        dispatch(updateComplaintField({ field, value }));
      });

      setSnackbar({ open: true, message: "AI analysis completed. Review the suggested values.", severity: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to analyze complaint.";
      dispatch(setAiError(message));
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      dispatch(setAiProcessing(false));
    }
  };

  const handleSave = async () => {
    const requiredFields = [
      { field: "complaintId", label: "Complaint ID" },
      { field: "customerName", label: "Customer Name" },
      { field: "complaintDescription", label: "Complaint Description" },
    ];

    const missing = requiredFields.filter(({ field }) => !String(currentComplaint[field] || "").trim());

    if (missing.length) {
      const missingLabels = missing.map(({ label }) => label).join(", ");
      setSnackbar({ open: true, message: `Please complete the required fields: ${missingLabels}`, severity: "error" });
      return;
    }

    dispatch(setComplaintSaving(true));
    dispatch(setComplaintError(null));

    try {
      const payload = {
        complaint_id: currentComplaint.complaintId.trim(),
        customer_name: currentComplaint.customerName.trim(),
        complaint_source: currentComplaint.complaintSource || null,
        product_name: currentComplaint.productName || null,
        product_strength: currentComplaint.productStrength || null,
        batch_number: currentComplaint.batchNumber || null,
        manufacturing_date: currentComplaint.manufacturingDate || null,
        expiry_date: currentComplaint.expiryDate || null,
        quantity: currentComplaint.quantity ? Number(currentComplaint.quantity) : null,
        complaint_category: currentComplaint.complaintCategory || null,
        complaint_description: currentComplaint.complaintDescription.trim(),
        severity: currentComplaint.severity || null,
        priority: currentComplaint.priority || null,
        status: currentComplaint.status || "open",
      };

      await createComplaint(payload);
      dispatch(resetComplaintForm());
      setSnackbar({ open: true, message: "Complaint saved successfully.", severity: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save complaint.";
      dispatch(setComplaintError(message));
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      dispatch(setComplaintSaving(false));
    }
  };

  return (
    <Box>
      <Stack spacing={1} mb={3}>
        <Typography variant="h4">Customer Complaint Intake</Typography>
        <Typography variant="body1" color="text.secondary">
          Capture complaint details, validate the entry, and submit it to the backend complaint management service.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Complaint Intake Form
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete the complaint fields below before submitting.
                  </Typography>
                </Box>
                <Chip label="Backend Connected" color="primary" size="small" />
              </Stack>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Complaint Source"
                        value={currentComplaint.complaintSource || ""}
                        onChange={handleFieldChange("complaintSource")}
                      >
                        {sourceOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Customer Name"
                        value={currentComplaint.customerName || ""}
                        onChange={handleFieldChange("customerName")}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>
                    Product Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Product Name"
                        value={currentComplaint.productName || ""}
                        onChange={handleFieldChange("productName")}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Product Strength"
                        value={currentComplaint.productStrength || ""}
                        onChange={handleFieldChange("productStrength")}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Batch Number"
                        value={currentComplaint.batchNumber || ""}
                        onChange={handleFieldChange("batchNumber")}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Manufacturing Date"
                        InputLabelProps={{ shrink: true }}
                        value={currentComplaint.manufacturingDate || ""}
                        onChange={handleFieldChange("manufacturingDate")}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Expiry Date"
                        InputLabelProps={{ shrink: true }}
                        value={currentComplaint.expiryDate || ""}
                        onChange={handleFieldChange("expiryDate")}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Quantity Affected"
                        type="number"
                        value={currentComplaint.quantity || ""}
                        onChange={handleFieldChange("quantity")}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>
                    Complaint Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Complaint Category"
                        value={currentComplaint.complaintCategory || ""}
                        onChange={handleFieldChange("complaintCategory")}
                      >
                        {categoryOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Complaint ID"
                        value={currentComplaint.complaintId || ""}
                        onChange={handleFieldChange("complaintId")}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Severity"
                        value={currentComplaint.severity || ""}
                        onChange={handleFieldChange("severity")}
                      >
                        {severityOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Priority"
                        value={currentComplaint.priority || ""}
                        onChange={handleFieldChange("priority")}
                      >
                        {priorityOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        minRows={5}
                        label="Complaint Description"
                        value={currentComplaint.complaintDescription || ""}
                        onChange={handleFieldChange("complaintDescription")}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button variant="outlined" color="inherit" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {saving ? "Saving..." : "Save Complaint"}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AutoAwesomeOutlinedIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    AI Complaint Intake Assistant
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "#FAFBFC",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <CloudUploadOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Drag & Drop PDF or document
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Supports PDF, PNG, JPG, JPEG, and TXT files.
                  </Typography>
                  <input accept=".pdf,.png,.jpg,.jpeg,.txt" type="file" onChange={handleUpload} hidden id="complaint-upload" />
                  <label htmlFor="complaint-upload">
                    <Button component="span" variant="outlined" size="small">
                      Browse files
                    </Button>
                  </label>
                  {uploadedFileName && (
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" mt={2}>
                      <Chip label={uploadedFileName} color="primary" size="small" />
                      <Button size="small" startIcon={<DeleteOutlineOutlinedIcon />} onClick={handleRemoveFile}>
                        Remove
                      </Button>
                    </Stack>
                  )}
                </Box>

                <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Paste Complaint Text / Email
                  </Typography>
                  <TextField
                    multiline
                    minRows={4}
                    fullWidth
                    placeholder="Paste complaint email, transcript, or complaint text here"
                    value={pastedText}
                    onChange={(event) => setPastedText(event.target.value)}
                  />
                  <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={handleAnalyze} disabled={aiState.processing}>
                    {aiState.processing ? "Analyzing..." : "Analyze with AI"}
                  </Button>
                </Box>

                <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Extraction Progress
                  </Typography>
                  <LinearProgress variant="determinate" value={aiState.progress || 0} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {aiState.progressMessage || "Waiting for analysis"}
                  </Typography>
                </Box>

                <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    AI Suggested Values
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {aiState.extractedEntities ? JSON.stringify(aiState.extractedEntities, null, 2) : "No suggested values yet."}
                  </Typography>
                </Box>

                <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    AI Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                    {aiState.summary || "No summary produced yet."}
                  </Typography>
                  <Stack direction="row" spacing={1.5} mt={2}>
                    <Chip label={`Risk: ${aiState.riskAssessment || "Pending"}`} color="warning" size="small" />
                    <Chip label={`Confidence: ${aiState.confidenceScore ? `${Math.round(aiState.confidenceScore * 100)}%` : "N/A"}`} color="primary" size="small" />
                  </Stack>
                </Box>

                <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                    <DescriptionOutlinedIcon color="primary" />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Missing Fields
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {aiState.missingFields?.length ? aiState.missingFields.join(", ") : "No missing fields detected."}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ComplaintIntakeForm;
