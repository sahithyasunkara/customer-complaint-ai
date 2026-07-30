import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    totalComplaints: 0,
    openComplaints: 0,
    closedComplaints: 0,
    highRiskCases: 0,
  },
  recentComplaints: [],
  riskDistribution: [],
  categoryDistribution: [],
  aiProcessingStats: {
    totalAnalyzed: 0,
    averageConfidence: 0,
    averageProcessingTimeMs: 0,
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData(state, action) {
      Object.assign(state, action.payload);
    },
    setDashboardLoading(state, action) {
      state.loading = action.payload;
    },
    setDashboardError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setDashboardData, setDashboardLoading, setDashboardError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
