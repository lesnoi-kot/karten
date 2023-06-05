import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      checker({ typescript: true }),
      visualizer(),
    ],
    base: env.VITE_BASE_PATH || "/",
    build: {
      target: "modules",
      modulePreload: false,
    },
    server: {
      port: 3000,
      host: env.VITE_HOST || "127.0.0.1",
    },
    preview: {
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
