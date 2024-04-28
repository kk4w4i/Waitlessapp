import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, ConfigEnv } from "vite";

export default defineConfig(({ mode }: ConfigEnv) => {
  const isProduction = mode === "production";

  return {
    base: isProduction ? "/static/" : "/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

