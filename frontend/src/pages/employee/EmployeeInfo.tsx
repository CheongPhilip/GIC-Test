import { styled, Typography } from "@mui/material";
import { FC } from "react";
import EmployeeForm from "./EmployeeForm";

const StyledContainer = styled("div")({
  width: "100%",
  height: "100%",
});

export const EmployeeInfo: FC = () => {
  return (
    <StyledContainer>
      <Typography fontWeight={600} variant="h6" sx={{ flexGrow: 1 }}></Typography>
      <EmployeeForm />
    </StyledContainer>
  );
};
