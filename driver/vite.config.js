import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/drivers/',
  server: {
    port: 5173,
    proxy: {
      '/auth': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/orders': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/ai': { target: 'http://127.0.0.1:8003', changeOrigin: true, ws: true },
      '/drivers/me': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/profile': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/truck-types': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/announcements': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/offers': { target: 'http://127.0.0.1:8003', changeOrigin: true },
    },
  },
})
