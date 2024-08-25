import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClientProvider, queryClient } from "./providers";

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "viewport",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <QueryClientProvider>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}
