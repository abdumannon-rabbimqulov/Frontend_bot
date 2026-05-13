import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: 5174,
    proxy: {
      '/auth': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/system': { target: 'http://127.0.0.1:8003', changeOrigin: true, ws: true },
      '/orders': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/ai': { target: 'http://127.0.0.1:8003', changeOrigin: true, ws: true },
      '/drivers/me': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/profile': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/truck-types': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/announcements': { target: 'http://127.0.0.1:8003', changeOrigin: true },
      '/drivers/offers': { target: 'http://127.0.0.1:8003', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
