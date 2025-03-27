import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
// import NodePolyfills from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "window", // 👈 Fix the "global is not defined" error
  },
});
