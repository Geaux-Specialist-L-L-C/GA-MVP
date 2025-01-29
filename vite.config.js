import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [react(), vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_AZURE_ENDPOINT,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      }
    },
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173
    }
  },
  define: {
    'process.env.VITE_MODEL_NAME': JSON.stringify(process.env.VITE_MODEL_NAME),
    'process.env.VITE_AZURE_API_KEY': JSON.stringify(process.env.VITE_AZURE_API_KEY)
  }
});