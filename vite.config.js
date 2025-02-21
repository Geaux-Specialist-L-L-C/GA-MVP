import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'firebase-app': ['firebase/app'],
            'firebase-auth': ['firebase/auth'],
            'firebase-firestore': ['firebase/firestore'],
            'firebase-storage': ['firebase/storage'],
            'firebase-messaging': ['firebase/messaging'],
            'firebase-analytics': ['firebase/analytics']
          }
        }
      }
    },
    server: {
      port: 3001,
      strictPort: true,
      https: {
        key: fs.readFileSync('.cert/key.pem'),
        cert: fs.readFileSync('.cert/cert.pem')
      },
      cors: true,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'credentialless',
        'Content-Security-Policy': `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com https://*.firebase.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com;
          connect-src 'self' https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com wss://firestore.googleapis.com;
          frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://accounts.google.com https://*.googleapis.com;
          img-src 'self' data: https: blob:;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.gstatic.com;
          worker-src 'self' blob: 'unsafe-inline';
        `.replace(/\s+/g, ' ')
      }
    },
    define: {
      __VITE_FIREBASE_API_KEY__: `"${env.VITE_FIREBASE_API_KEY}"`,
      __VITE_FIREBASE_AUTH_DOMAIN__: `"${env.VITE_FIREBASE_AUTH_DOMAIN}"`,
      __VITE_FIREBASE_PROJECT_ID__: `"${env.VITE_FIREBASE_PROJECT_ID}"`,
      __VITE_FIREBASE_STORAGE_BUCKET__: `"${env.VITE_FIREBASE_STORAGE_BUCKET}"`,
      __VITE_FIREBASE_MESSAGING_SENDER_ID__: `"${env.VITE_FIREBASE_MESSAGING_SENDER_ID}"`,
      __VITE_FIREBASE_APP_ID__: `"${env.VITE_FIREBASE_APP_ID}"`,
      __VITE_FIREBASE_MEASUREMENT_ID__: `"${env.VITE_FIREBASE_MEASUREMENT_ID}"`,
      __VITE_FIREBASE_DATABASE_URL__: `"${env.VITE_FIREBASE_DATABASE_URL}"`,
      'process.env.ROUTER_FUTURE_FLAGS': JSON.stringify({
        v7_startTransition: true,
        v7_relativeSplatPath: true
      })
    },
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/messaging', 'firebase/analytics']
    }
  };
});
