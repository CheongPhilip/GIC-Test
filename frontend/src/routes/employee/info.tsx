import { createFileRoute } from "@tanstack/react-router";
import { EmployeeInfo } from "../../pages/employee/EmployeeInfo";

export const Route = createFileRoute("/employee/info")({
  component: () => <EmployeeInfo />,
});
