import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // browser calls: /api/news  ->  proxied to your real endpoint
      "/api/news": {
        target: "https://www.aninews.in",
        changeOrigin: true,
        secure: true,
        // if your actual JSON endpoint is /api/whatever, rewrite here:
        // e.g. /api/news -> /api/news/business
        rewrite: (path) => path.replace(/^\/api\/news/, "/news/business"),
      },
    },
  },
});
