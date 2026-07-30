import { createSlice } from "@reduxjs/toolkit";

const emptyForm = {
  complaintId: "",
  complaintSource: "",
  customerName: "",
  productName: "",
  productStrength: "",
  batchNumber: "",
  manufacturingDate: "",
  expiryDate: "",
  quantity: "",
  complaintCategory: "",
  complaintDescription: "",
  severity: "",
  priority: "",
  status: "open",
};

const initialState = {
  currentComplaint: { ...emptyForm },
  selectedComplaintId: null,
  complaints: [],
  loading: false,
  saving: false,
  error: null,
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    updateComplaintField(state, action) {
      const { field, value } = action.payload;
      state.currentComplaint[field] = value;
    },
    setComplaintForm(state, action) {
      state.currentComplaint = {
        ...state.currentComplaint,
        ...action.payload,
      };
    },
    resetComplaintForm(state) {
      state.currentComplaint = { ...emptyForm };
      state.selectedComplaintId = null;
      state.error = null;
    },
    setComplaints(state, action) {
      state.complaints = action.payload;
    },
    setSelectedComplaintId(state, action) {
      state.selectedComplaintId = action.payload;
    },
    setComplaintLoading(state, action) {
      state.loading = action.payload;
    },
    setComplaintSaving(state, action) {
      state.saving = action.payload;
    },
    setComplaintError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  updateComplaintField,
  setComplaintForm,
  resetComplaintForm,
  setComplaints,
  setSelectedComplaintId,
  setComplaintLoading,
  setComplaintSaving,
  setComplaintError,
} = complaintSlice.actions;

export default complaintSlice.reducer;
