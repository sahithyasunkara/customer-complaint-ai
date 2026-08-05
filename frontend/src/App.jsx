import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import ComplaintDetailsPage from "./pages/ComplaintDetailsPage";
import ComplaintIntakePage from "./pages/ComplaintIntakePage";
import DashboardPage from "./pages/DashboardPage";
import RootLayout from "./layouts/RootLayout";
import { healthCheck } from "./services/api";
import { setBackendStatus } from "./redux/slices/uiSlice";

function AppRoutes() {
  const dispatch = useDispatch();
  const backendStatus = useSelector((state) => state.ui.backendStatus);

  useEffect(() => {
    const verifyBackend = async () => {
      try {
        await healthCheck();
        dispatch(setBackendStatus("online"));
      } catch {
        dispatch(setBackendStatus("offline"));
      }
    };

    verifyBackend();
  }, [dispatch]);

  return (
    <>
      {backendStatus === "offline" && (
        <Box sx={{ px: 2, pt: 2 }}>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
  Unable to connect to Backend API.
</Alert>
        </Box>
      )}

      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<ComplaintIntakePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="complaints/:complaintId" element={<ComplaintDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
