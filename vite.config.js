import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vue(), // Add Vue plugin
    injectFirebaseConfig()
  ],
  build: {
    target: 'esnext', // This enables top-level await
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
    https: true,
    cors: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
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
      protocol: 'ws',
      host: 'localhost',
      clientPort: 5173,
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
