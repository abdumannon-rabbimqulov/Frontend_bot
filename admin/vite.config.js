import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: 5174,
    proxy: {
      '/auth': 'http://localhost:8000',
      '/admin/dashboard': 'http://localhost:8000',
      '/admin/users': 'http://localhost:8000',
      '/admin/orders': 'http://localhost:8000',
      '/admin/ai': 'http://localhost:8000',
      '/admin/drivers': 'http://localhost:8000',
      '/admin/tariffs': 'http://localhost:8000',
      '/orders': 'http://localhost:8000',
      '/drivers': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
