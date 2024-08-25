import { AppBar as MuiAppBar, Box, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { Link } from "./Link";

export const AppBar: FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position="static" style={{ backgroundColor: "#061c49" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Starducks
          </Typography>
          <Link to="/cafe">Cafe</Link>
          <Link to="/employee">Employee</Link>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};
