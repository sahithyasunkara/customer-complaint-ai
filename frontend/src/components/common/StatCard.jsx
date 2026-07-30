import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function StatCard({ title, value, icon, helperText, color = "primary" }) {
  return (
    <Card sx={{ height: "100%", borderLeft: `4px solid`, borderColor: `${color}.main` }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {helperText ? (
              <Typography variant="body2" color="text.secondary" mt={1}>
                {helperText}
              </Typography>
            ) : null}
          </Box>
          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StatCard;
