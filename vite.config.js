import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/plant-diseases-detection/",   // 👈 GitHub repo name
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://plant-leaf-ml-api.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
