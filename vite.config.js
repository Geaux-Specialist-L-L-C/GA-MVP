// File: /vite.config.js
// Description: Vite configuration for the project
// Author: GitHub Copilot
// Created: 2024-02-12

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      // Add this configuration to fix Fast Refresh
      fastRefresh: true,
      // Exclude node_modules
      exclude: /node_modules/,
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage'],
          'firebase-messaging': ['firebase/messaging'],
        },
      },
    },
  },
  server: {
    https: process.env.NODE_ENV === 'development' ? {
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    } : false,
    port: 3000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Service-Worker-Allowed': '/',
      'Permissions-Policy': 'fullscreen=*, popup=*, cross-origin-isolated=*',
    },
    proxy: {
      '/__/auth/*': {
        target: 'http://localhost:9099',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  optimizeDeps: {
    exclude: ['firebase', '@firebase/app', '@firebase/auth', '@firebase/firestore'],
  },
});
