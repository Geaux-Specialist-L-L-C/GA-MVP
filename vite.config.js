import fs from 'fs';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Get SSL certificates for local development
const getHttpsConfig = () => {
  const certPath = path.join(process.cwd(), 'certificates');
  
  // Only use HTTPS in development
  if (process.env.NODE_ENV === 'development') {
    try {
      return {
        key: fs.readFileSync(path.join(certPath, 'localhost-key.pem')),
        cert: fs.readFileSync(path.join(certPath, 'localhost.pem'))
      };
    } catch (e) {
      console.warn('No SSL certificates found. Run `npm run generate-certs` to create them.');
      return false;
    }
  }
  return false;
};

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
      // Enable React Router v7 future flags
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }
    }),
    vue()
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'firebase-messaging-sw': resolve(__dirname, 'public/firebase-messaging-sw.js')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore']
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
        '**/node_modules/**',
        '**/dist/**',
        'src/test/setup.ts'
      ]
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    https: getHttpsConfig(),
    host: 'localhost',
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
      `.replace(/\s+/g, ' '),
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
      },
      '/__/auth/*': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 3000,
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
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  define: {
    __VITE_FIREBASE_API_KEY__: `"${process.env.VITE_FIREBASE_API_KEY}"`,
    __VITE_FIREBASE_AUTH_DOMAIN__: `"${process.env.VITE_FIREBASE_AUTH_DOMAIN}"`,
    __VITE_FIREBASE_PROJECT_ID__: `"${process.env.VITE_FIREBASE_PROJECT_ID}"`,
    __VITE_FIREBASE_STORAGE_BUCKET__: `"${process.env.VITE_FIREBASE_STORAGE_BUCKET}"`,
    __VITE_FIREBASE_MESSAGING_SENDER_ID__: `"${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}"`,
    __VITE_FIREBASE_APP_ID__: `"${process.env.VITE_FIREBASE_APP_ID}"`,
    __VITE_FIREBASE_MEASUREMENT_ID__: `"${process.env.VITE_FIREBASE_MEASUREMENT_ID}"`,
    __VITE_FIREBASE_DATABASE_URL__: `"${process.env.VITE_FIREBASE_DATABASE_URL}"`,
    // Enable React Router v7 future flags
    'process.env.ROUTER_FUTURE_FLAGS': JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true
    })
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth']
  }
});
