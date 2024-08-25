import { createFileRoute } from "@tanstack/react-router";
import { Employee } from "../../pages/employee/Employee";
import { employeesQueryOptions } from "../../providers/queries/employee";

export const Route = createFileRoute("/employee/")({
  component: () => <Employee />,
  loader: ({ context, location }) => context.queryClient.ensureQueryData(employeesQueryOptions(location.searchStr)),
});
