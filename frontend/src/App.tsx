import { FC } from "react";
import { styled } from "@mui/material";
import { AppBar } from "./components/AppBar";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const StyledContainer = styled("div")({
  height: "100%",
  width: "100%",
  minHeight: "calc(100vh - 64px)",
  minWidth: "calc(100vw - 19px)",
  overflow: "auto",
});

const StyledContent = styled("div")({
  display: "flex",
  justifyContent: "center",
  padding: "2rem",
  overflow: "auto",
});

export const App: FC = () => {
  return (
    <StyledContainer>
      <AppBar />
      <StyledContent>
        <Outlet />
      </StyledContent>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </StyledContainer>
  );
};

export default App;
