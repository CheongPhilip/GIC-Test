import { FC, useEffect, useState } from "react";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { styled } from "@mui/material";

interface LinkProps {
  to: string;
  children: string;
}

interface StyledLinkProps {
  isActive: boolean;
}

const StyledLink = styled(RouterLink, { shouldForwardProp: (props) => props !== "isActive" })<StyledLinkProps>(({ isActive }) => ({
  color: isActive ? "#ffffff" : "grey",
  textDecoration: isActive ? "underline" : "none",
  fontSize: isActive ? "1rem" : "0.9rem",
  margin: "0 1rem",
  transition: "font-size 0.3s",
}));

export const Link: FC<LinkProps> = ({ to, children }) => {
  const router = useRouterState();
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(router.location.pathname === to);
  }, [router.location.pathname, to]);

  return (
    <StyledLink to={to} isActive={isActive}>
      {children}
    </StyledLink>
  );
};
