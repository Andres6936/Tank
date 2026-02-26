import { defineConfig } from "vite";
import masterCSS from "@master/css.vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), masterCSS()],
});
