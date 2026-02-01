
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  json: {
    stringify: true,
  },
  // Configuración para desarrollo en Docker
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // Necesario para que Docker exponga el servicio correctamente
    strictPort: true,
  },
});

