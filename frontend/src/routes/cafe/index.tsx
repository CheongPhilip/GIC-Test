import { createFileRoute } from "@tanstack/react-router";
import { cafesQueryOptions } from "../../providers/queries/cafe";
import { Cafe } from "../../pages/cafe/Cafe";

export const Route = createFileRoute("/cafe/")({
  component: () => <Cafe />,
  loader: ({ context, location }) => context.queryClient.ensureQueryData(cafesQueryOptions(location.searchStr)),
});
