import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'https://0.0.0.0:8080',
      },
    },
  },
});