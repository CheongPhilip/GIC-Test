import { Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div style={{ width: "100%" }}>
      <Typography textAlign={"center"} variant="h2">
        Welcome !!!
      </Typography>
      <Typography variant="h3">Please use the top right navigation link to access other pages</Typography>
    </div>
  ),
});
