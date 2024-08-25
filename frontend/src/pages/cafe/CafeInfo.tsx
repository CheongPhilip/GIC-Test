import { styled, Typography } from "@mui/material";
import { FC } from "react";
import CafeForm from "./CafeForm";

const StyledContainer = styled("div")({
  width: "100%",
  height: "100%",
});

export const CafeInfo: FC = () => {
  return (
    <StyledContainer>
      <Typography fontWeight={600} variant="h6" sx={{ flexGrow: 1 }}></Typography>
      <CafeForm />
    </StyledContainer>
  );
};
