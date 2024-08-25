import { createFileRoute } from "@tanstack/react-router";
import { CafeInfo } from "../../pages/cafe/CafeInfo";

export const Route = createFileRoute("/cafe/info")({
  component: () => <CafeInfo />,
});
