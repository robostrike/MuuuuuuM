import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/MuuuuuuM/",
  server: {
    port: 4000,
    strictPort: true
  },
  preview: {
    port: 4000
  }
})
