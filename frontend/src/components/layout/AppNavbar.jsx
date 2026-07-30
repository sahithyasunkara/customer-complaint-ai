import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import { APP_NAME } from "../../utils/constants";

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.82)",
  backgroundColor: isActive ? "rgba(255,255,255,0.14)" : "transparent",
  fontWeight: isActive ? 700 : 500,
  borderRadius: 999,
  px: 1.5,
  py: 0.75,
  minHeight: 40,
});

function AppNavbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 2, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.16)" }}>
              <ScienceOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {APP_NAME}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, display: { xs: "none", sm: "block" } }}>
                AI-assisted complaint operations and quality assurance
              </Typography>
            </Box>
          </Stack>

          <Chip
            label="Enterprise QMS"
            size="small"
            sx={{
              display: { xs: "none", sm: "flex" },
              bgcolor: "rgba(255,255,255,0.14)",
              color: "white",
              fontWeight: 600,
            }}
          />

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button component={NavLink} to="/" startIcon={<AssignmentLateOutlinedIcon />} sx={navLinkStyle}>
              Complaint Intake
            </Button>
            <Button component={NavLink} to="/dashboard" startIcon={<DashboardOutlinedIcon />} sx={navLinkStyle}>
              Dashboard
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppNavbar;
