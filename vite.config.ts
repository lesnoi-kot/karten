import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tsconfigPaths(), svgr()],
    base: env.VITE_PUBLIC_URL || "/",
    server: {
      port: 3000,
      host: env.VITE_HOST || "127.0.0.1",
    },
    test: {
      globals: true,
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
