import { createRootRouteWithContext } from "@tanstack/react-router";
import App from "../App";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => <App />,
  notFoundComponent: () => <div>Not Found Haha</div>,
});
