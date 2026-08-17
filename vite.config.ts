import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // react-secure-storage reads process.env when initializing its fingerprint.
  // Vite exposes import.meta.env, so provide the compatibility object expected
  // by the package at runtime.
  define: {
    "process.env": {},
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
