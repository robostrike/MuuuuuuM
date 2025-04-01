import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/MuuuuuuM/",
  server: {
    port: 4000,
    strictPort: true
  },
  preview: {
    port: 4000
  },
  define: {
    'process.env': {}, // Prevent "process is not defined" errors
  },
});
