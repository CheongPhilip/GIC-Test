import { Button as MuiButton, ButtonProps, styled } from "@mui/material";
import { FC } from "react";

const StyledButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

const StyledButton = styled(MuiButton)({
  backgroundColor: "#061c49",
  borderRadius: "20px",
  height: "40px",
  "&:hover": {
    backgroundColor: "#1a4191",
  },
});

export const Button: FC<ButtonProps> = (props) => {
  return (
    <StyledButtonContainer>
      <StyledButton {...props} />
    </StyledButtonContainer>
  );
};
