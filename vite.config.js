import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vue() // Add Vue plugin
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    proxy: {
      '/api': {
        target: process.env.VITE_AZURE_ENDPOINT,
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 5173
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  define: {
    __VITE_FIREBASE_CONFIG__: {
      apiKey: JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
      authDomain: JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN),
      projectId: JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID),
      storageBucket: JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET),
      messagingSenderId: JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      appId: JSON.stringify(process.env.VITE_FIREBASE_APP_ID),
      measurementId: JSON.stringify(process.env.VITE_FIREBASE_MEASUREMENT_ID)
    },
    'process.env': {}
  }
});