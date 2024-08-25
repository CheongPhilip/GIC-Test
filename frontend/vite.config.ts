import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPath from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [TanStackRouterVite(), viteReact(), tsconfigPath()],
  server: {
    host: "0.0.0.0",
    port: 4173,
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
});
