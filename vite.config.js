// File: /vite.config.js
// Description: Vite configuration for Geaux Academy project
// Author: GitHub Copilot
// Created: 2023-10-10

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Custom plugin to inject Firebase config into service worker
const injectFirebaseConfig = () => ({
  name: 'inject-firebase-config',
  buildEnd: async () => {
    const configContent = fs.readFileSync('./public/firebase-config.js', 'utf-8');
    const injectedContent = configContent
      .replace('__FIREBASE_API_KEY__', process.env.FIREBASE_API_KEY)
      .replace('__FIREBASE_AUTH_DOMAIN__', process.env.FIREBASE_AUTH_DOMAIN)
      .replace('__FIREBASE_PROJECT_ID__', process.env.FIREBASE_PROJECT_ID)
      .replace('__FIREBASE_MESSAGING_SENDER_ID__', process.env.FIREBASE_MESSAGING_SENDER_ID)
      .replace('__FIREBASE_APP_ID__', process.env.FIREBASE_APP_ID);
    
    fs.writeFileSync('./dist/firebase-config.js', injectedContent);
  }
});

// Helper to check for SSL certificates
const getHttpsConfig = () => {
  const certPath = path.resolve(__dirname, '.cert');
  const keyPath = path.join(certPath, 'key.pem');
  const certFilePath = path.join(certPath, 'cert.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certFilePath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certFilePath)
    };
  }
  
  console.warn('SSL certificates not found. HTTPS will not be enabled.');
  return false;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vue(),
    injectFirebaseConfig()
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage'],
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/setup.ts',
      ],
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    https: getHttpsConfig(),
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    proxy: {
      '/api': {
        target: process.env.VITE_AZURE_ENDPOINT,
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/auth': {
        target: process.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying request:', req.method, req.url);
            proxyReq.setHeader('Cookie', 'Global=Auth');
          });
        }
      },
      '/message': {
        target: process.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/message/, '/message'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Cookie', 'Global=Auth');
          });
        }
      }
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      clientPort: 3000,
      timeout: 120000
    },
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
      FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      FIREBASE_APP_ID: JSON.stringify(process.env.FIREBASE_APP_ID),
      FIREBASE_MEASUREMENT_ID: JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID)
    }
  }
});
