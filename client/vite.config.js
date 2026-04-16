import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/StudentRides_Project_Web2/",
  server: {
    port: 5173
  }
});

