import { styled, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface ErrorWrapperProps {
  children: ReactNode;
  error: boolean;
  errMsg: string;
}

const StyledContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const StyledErrorMsgContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "left",
  width: "100%",
});

export const ErrorWrapper: FC<ErrorWrapperProps> = ({ children, error, errMsg }) => {
  return (
    <StyledContainer>
      {children}
      {error && (
        <StyledErrorMsgContainer>
          <Typography variant="caption" color={"red"}>
            {errMsg}
          </Typography>
        </StyledErrorMsgContainer>
      )}
    </StyledContainer>
  );
};
