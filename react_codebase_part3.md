# React Application Structure and Content - Part 3

Generated on: 2025-02-17 09:09:44

## /remoteconfig.template.json

```json
{}
```

---

## /repository_content.md

```markdown
qwq
```

---

## /theme.js

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
    },
  },
});

export default theme;
```

---

## /tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "node",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "declaration": false,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnreachableCode": false,
    "allowJs": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["node", "jest"],
    "outDir": "./dist"
  },
  "include": [
    "src",
    "public/JSX",
    "backend",
    "functions",
    "scripts",
    "test",
    "types",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["dist", "node_modules"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## /tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "allowJs": true,
    "types": ["node", "vite/client"],
    "target": "es2017",
    "outDir": "dist",
    "strict": true
  },
  "include": [
    "src",
    "scripts",
    "vite.config.ts",
    "vite.config.js"
  ],
  "exclude": [
    "vite.config.js",
    "dist/**/*",
    "public",
    "src/**/*.js",
    "*.js",
    "functions/**/*.js",
    "dataconnect-generated/**/*.js",
    "node_modules"
  ]
}
```

---

## /vite.config.js

```javascript
import fs from 'fs';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';


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
          'firebase-firestore': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage']
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
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com https://*.firebase.com https://*.googleapis.com https://*.gstatic.com;
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
```

---

## /public/firebase-config.js

```javascript
// This script injects Firebase configuration into the service worker
self.FIREBASE_CONFIG = {
  "apiKey": "AIzaSyB0V4iL1aQ_xtWeO_iWL1fuhu4_SLfqZeo",
  "authDomain": "geaux-academy.firebaseapp.com",
  "projectId": "geaux-academy",
  "messagingSenderId": "145629211979",
  "appId": "1:145629211979:web:1f9c854ecb392916adccce"
};
self.SSL_CONFIG = {
  "key": "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpAIBAAKCAQEApWa5H1wMifKEaAgvdLRM6PIxxS2tBVOwwvB4rG72cpdcsZsC\r\ntTkz5tlWhvz2drfep4FT21xjRlhIvzonaEy57F/ja0w6j3f1AnbBHeNEpRPEbN9G\r\nDcAvtlmYepcrmvIN0OTN/ICTtdggmfMn3kyoIgLEyLnaOAc5QmSRhpsUSBTnN5Mg\r\nl1FmM9bI+sbB61+ndFPKtRqi6YKlMVBcBPB3taO0BX2Gfx9ZKPypBdWuJgkLsWNK\r\n98mfXBwfRWXV9l2hXZwxL7VW/lKP/aa88hd+mkkMRXU+Z3VmqUXFZ+mV740IykoP\r\nYyH+suyrcT4Xy8Uth2m9JM3iYvQG0XAbemrgqwIDAQABAoIBADOi+jBcIF4ApG2G\r\nAKrCjzA6TGdudxGuqwRw5nuOuMnVj06zQgkprpZnS6gg2SD/DjflHDTjhuqzLSLm\r\nGN9q9LBizzD0P2QC4y69vFSEWy3eGfiTS9+HHF4lYoEDKM3au413oQcvbO3cZ3Eo\r\nhE3WSLc1fhHcU9AiETI1C2mmiJJn07fTLlEbCGlMqydefrTkRBMcf97pfeun9fta\r\n0w5FUFcLECkmzAQu1WIxEFxz32ipmZ/bVdqIyn2KucLTtT27VFldaiFEL/RmVn5B\r\nunoJMk3ZF/NLf8PypZFCu1LhK6jbE+hTIw51Zk27C9rvBp0Nss9HGZYPsgFjWUgK\r\nobWm9CECgYEA0Qbp5kTqP8gODufuAwj3CtAlFxMIfm7fnvf6J2xp/ct4b0wTbGw6\r\nrvdkf4TRSuKbc5J3OjVBib9A1dZaJBTMJZrKhr4gIlUoTfG0eJ++vLYmbimM1E6h\r\nHiuhK8t0a3x/+keWZFzCeQUJluoz0amdrwBEqkRH4ZE6gTaRJqIMLPUCgYEAypIR\r\n5zy3AlTl8yD9Z86aJe7l8YA4hQJLt/TCeyao0798G3s3fOIPVj+6Q3XactJntbtD\r\nR31uWLL2haxWUR5e26VeQmiYV/AbDpbHd0Y9LRuYz4Cc89aiamAConMccotj+2Y8\r\naMpPC+vUpXG7uliNsh23zmVJfkc49oXZ+swmUx8CgYBkZPKwo4bzDW4bILBDiunE\r\nqsY1t/GLcEs9ehMPHlYmDLUSl7J4j977rFz7llpDomVRdBaJwYxx0Ycdba+rxsVq\r\nhlchsm2Sr94E2cN5cBhXYRFCNfiq+/0MlZ36f+Sxv4FkPz/vglHxeEbr0h8DY3kV\r\n1YYlVVhE8dDswL2klY5NhQKBgQCu23W+0Cb9SUGRJCn5gFqJYfV1CIRBNCEeMpXp\r\n7g4Pchv0MOFN2Gj6v1nOP54IPV0ufu3tePVWdWzdKEz+CqRBHzcFRfoy9ly0tCyL\r\n5cKK/GZkv5U72ksqXaQIjCrDKVVtvetpXTDsjm5pPYqZqTTuyj5OWBofeeVOz23A\r\n0pZGawKBgQCluQuZa4mjpj+5ClxkOI0GH6i+rKtfB3W6TtLKUQJGtuMW+OJl9rIK\r\n/elabIvupBUzM0fLR/t7IQ6kaPBzUC/GzZSLu8kl41c9RlbTfV4u/2+xqeNOaGKK\r\nGAvbhPrZz398vZiYCEMMdVD2UTADgWpj7tmp98Mg9DhAkjwOMQx75Q==\r\n-----END RSA PRIVATE KEY-----\r\n",
  "cert": "-----BEGIN CERTIFICATE-----\r\nMIIDXzCCAkegAwIBAgIJFleoqQKXUF0fMA0GCSqGSIb3DQEBCwUAMEUxEjAQBgNV\r\nBAMTCWxvY2FsaG9zdDELMAkGA1UEBhMCVVMxIjAgBgNVBAoTGUdlYXV4IEFjYWRl\r\nbXkgRGV2ZWxvcG1lbnQwHhcNMjUwMjE1MDU1MzEzWhcNMjYwMjE1MDU1MzEzWjBF\r\nMRIwEAYDVQQDEwlsb2NhbGhvc3QxCzAJBgNVBAYTAlVTMSIwIAYDVQQKExlHZWF1\r\neCBBY2FkZW15IERldmVsb3BtZW50MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\r\nCgKCAQEApWa5H1wMifKEaAgvdLRM6PIxxS2tBVOwwvB4rG72cpdcsZsCtTkz5tlW\r\nhvz2drfep4FT21xjRlhIvzonaEy57F/ja0w6j3f1AnbBHeNEpRPEbN9GDcAvtlmY\r\nepcrmvIN0OTN/ICTtdggmfMn3kyoIgLEyLnaOAc5QmSRhpsUSBTnN5Mgl1FmM9bI\r\n+sbB61+ndFPKtRqi6YKlMVBcBPB3taO0BX2Gfx9ZKPypBdWuJgkLsWNK98mfXBwf\r\nRWXV9l2hXZwxL7VW/lKP/aa88hd+mkkMRXU+Z3VmqUXFZ+mV740IykoPYyH+suyr\r\ncT4Xy8Uth2m9JM3iYvQG0XAbemrgqwIDAQABo1IwUDAMBgNVHRMEBTADAQH/MAsG\r\nA1UdDwQEAwIC9DAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwFAYDVR0R\r\nBA0wC4IJbG9jYWxob3N0MA0GCSqGSIb3DQEBCwUAA4IBAQAthOlIn9WyjfYnBvpO\r\nKfxhc2uD0GgFG9mwx7ICEdgudWwAcARA9GFtB0ZjlQqEVTwvl9iP7Hdm6Sl3x5Gh\r\nBnYiECUz+bNclj9qcfA9BT7wKmDUT9HxCuQc+xnoJWvDUjBEG999hg1VpJ+/iaCq\r\noE9LMRPw9AkzfYR0D0CC77yV0LxjdaNiCffLBABLVHThoomRvIrtaOqmlYxz8nPu\r\nUwrerNwo1Bk8ARbUO8WE6Vnml73XI1M8xJ9s81mF4HL0xSbQ9TawInQbps7+I3LT\r\nfEhDseeKLGDBQYTxv1Wqp9tE9uYcbFlcE4/TsyI8BgewiKVwIm7TTXx2hlauYPY9\r\niQw4\r\n-----END CERTIFICATE-----\r\n"
};
```

---

## /public/firebase-messaging-sw.js

```javascript
/* eslint-env serviceworker */
/* global clients, firebase, importScripts */

// Load Firebase essentials first
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Load Firebase configuration
importScripts('./firebase-config.js');

// Initialize Firebase
const FIREBASE_CONFIG = self.FIREBASE_CONFIG || {};
firebase.initializeApp(FIREBASE_CONFIG);

const CACHE_NAME = 'geaux-academy-cache-v1';
const OFFLINE_URL = '/offline.html';
const SECURE_ORIGIN = self.location.protocol === 'https:';

// Define allowed domains for different purposes
const ANALYTICS_DOMAINS = [
  'www.googletagmanager.com',
  'www.google-analytics.com',
  'analytics.google.com',
  'tagmanager.google.com'
];

const FIREBASE_DOMAINS = [
  'firebaseinstallations.googleapis.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firebaseio.com',
  'firebase.googleapis.com'
];

const FONT_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  '*.public.atl-paas.net'
];

const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/vite.svg',
  '/google-icon.svg',
  '/images/logo.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_ASSETS);
        console.info('Service worker installed successfully');
      } catch (error) {
        console.error('Failed to install service worker:', error);
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
      notifyWindowsAboutReadyState();
    } catch (error) {
      console.error('Activation error:', error);
    }
  })());
});

async function notifyWindowsAboutReadyState() {
  const allClients = await clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  });
  
  allClients.forEach(client => {
    client.postMessage({
      type: 'FIREBASE_SERVICE_WORKER_READY',
      secure: SECURE_ORIGIN
    });
  });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Allow Google Analytics/Tag Manager requests
  if (ANALYTICS_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      fetch(event.request, {
        mode: 'cors',
        credentials: 'omit'
      })
    );
    return;
  }

  // Handle Firebase/Google API requests
  if (FIREBASE_DOMAINS.some(domain => url.hostname.includes(domain)) || 
      event.request.url.includes('/__/auth/')) {
    event.respondWith(
      fetch(event.request, {
        credentials: 'include',
        mode: 'cors',
      })
    );
    return;
  }

  // Handle font requests
  if (FONT_DOMAINS.some(domain => {
    if (domain.startsWith('*.')) {
      return url.hostname.endsWith(domain.slice(2));
    }
    return url.hostname === domain;
  })) {
    event.respondWith(
      fetch(event.request, {
        mode: 'cors',
        credentials: 'omit'
      })
    );
    return;
  }

  // Handle auth popup requests
  if (event.request.url.includes('/__/auth/handler')) {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: 'AUTH_RESPONSE',
            status: response.status,
            ok: response.ok
          });
        });
        return response;
      } catch (error) {
        console.error('Auth handler error:', error);
        return new Response(null, { status: 500 });
      }
    })());
    return;
  }

  // Handle all other requests
  event.respondWith((async () => {
    try {
      // Try network first
      const response = await fetch(event.request);
      if (!response || response.status === 404) {
        throw new Error('Resource not found');
      }
      
      // Cache successful responses
      if (response.ok && event.request.method === 'GET') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      
      return response;
    } catch (error) {
      // Fall back to cache
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      return cachedResponse || await cache.match(OFFLINE_URL);
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(handleFirebaseAuthPopup());
  }
});

// Handle auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Notify all clients about the auth state change
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'AUTH_STATE_CHANGED',
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          }
        });
      });
    });
  }
});

async function handleFirebaseAuthPopup() {
  const isReady = 'serviceWorker' in navigator && self.registration.active;
  let retryCount = 0;
  const maxRetries = 3;

  const findAuthPopup = async () => {
    const allClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    
    return allClients.find(client => 
      client.url.includes('/__/auth/handler') &&
      new URL(client.url).origin === self.location.origin
    );
  };

  const notifyMainWindow = async (type, message) => {
    const windows = await clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    });
    
    const mainClient = windows.find(c => 
      !c.url.includes('/__/auth/') && 
      new URL(c.url).origin === self.location.origin
    );
    
    if (mainClient) {
      mainClient.postMessage({ type, message });
    }
  };

  const retryDelay = (count) => new Promise(resolve => 
    setTimeout(resolve, Math.min(1000 * Math.pow(2, count), 10000))
  );

  try {
    await notifyMainWindow('FIREBASE_SERVICE_WORKER_READY', { 
      ready: isReady,
      https: true
    });
    
    if (!isReady) {
      throw new Error('Service worker not ready');
    }

    let authClient;
    while (!authClient && retryCount < maxRetries) {
      authClient = await findAuthPopup();
      if (!authClient) {
        retryCount++;
        await retryDelay(retryCount);
      }
    }

    if (authClient) {
      await authClient.focus();
      await notifyMainWindow('FIREBASE_AUTH_POPUP_READY', { 
        status: 'ready',
        secure: true
      });
    } else {
      throw new Error('Could not find auth popup after retries');
    }
  } catch (error) {
    console.error('Firebase auth popup handling error:', error);
    await notifyMainWindow('FIREBASE_AUTH_POPUP_ERROR', { 
      error: error.message,
      fallbackToRedirect: true,
      https: true
    });
  }
}
```

---

## /public/google-icon.svg

```plaintext
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
</svg>
```

---

## /public/index.html

```html
<!-- File: /public/index.html
Description: Main HTML file with updated CSP to allow external scripts from googleapis.com -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self' https://*.google.com https://*.googleapis.com https://*.gstatic.com;
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               img-src 'self' data: https: blob:;
               font-src 'self' https://fonts.gstatic.com;
               frame-src 'self' https://*.google.com https://*.firebaseapp.com;
               connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com;"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Geaux Academy</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

## /public/offline.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Geaux Academy</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f7fafc;
            text-align: center;
        }
        
        .offline-container {
            max-width: 400px;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #2d3748;
            margin-bottom: 1rem;
        }
        
        p {
            color: #4a5568;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .retry-button {
            background: #4299e1;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.2s;
        }
        
        .retry-button:hover {
            background: #3182ce;
        }

        .offline-icon {
            font-size: 48px;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1>You're Offline</h1>
        <p>It looks like you've lost your internet connection. Some features may be limited until you're back online.</p>
        <p>Any changes you make will sync automatically when you reconnect.</p>
        <button 
            class="retry-button" 
            onclick="window.location.reload()"
        >
            Try Again
        </button>
    </div>
</body>
</html>
```

---

## /public/vite.svg

```plaintext
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
```

---

## /public/images/bak0hero-learning.svg

```plaintext
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <text x="50%" y="50%" text-anchor="middle" fill="#666">
    Hero Image Placeholder
  </text>
</svg>
```

---

## /public/images/hero_img.svg

```plaintext
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1024.000000pt" height="1024.000000pt" viewBox="0 0 1024.000000 1024.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M58 10153 c-3 -49 -5 -295 -6 -548 -1 -253 -5 -542 -9 -643 -5 -142
-3 -188 7 -207 l13 -25 19 31 c16 26 17 33 4 50 -11 17 -13 133 -10 724 2 401
-1 705 -6 705 -5 0 -10 -39 -12 -87z"/>
<path d="M280 9993 c0 -494 -11 -987 -23 -1011 -12 -25 2 -59 22 -55 6 2 11
-2 11 -7 0 -18 25 -11 38 11 11 18 11 24 -4 40 -10 11 -19 30 -20 42 -2 12 -3
293 -3 625 0 406 -4 602 -11 602 -6 0 -10 -84 -10 -247z"/>
<path d="M493 9773 c1 -258 1 -529 -1 -603 -2 -74 0 -144 3 -155 4 -15 0 -23
-17 -30 -14 -6 -24 -20 -26 -37 -3 -22 2 -29 22 -34 14 -3 38 -3 52 0 20 5 24
11 19 29 -4 12 -13 27 -19 32 -10 8 -12 149 -8 638 4 566 3 627 -11 627 -14 0
-16 -48 -14 -467z"/>
<path d="M921 10063 c1 -98 5 -198 9 -223 5 -28 8 40 9 178 1 144 -3 222 -9
222 -7 0 -10 -63 -9 -177z"/>
<path d="M3030 10232 c0 -15 369 -745 532 -1049 18 -35 37 -63 41 -63 8 0 -72
160 -365 730 -161 313 -207 398 -208 382z"/>
<path d="M4296 10155 c4 -86 21 -203 64 -455 37 -214 73 -445 78 -499 2 -35 7
-49 13 -40 11 18 3 73 -116 829 -42 266 -46 284 -39 165z"/>
<path d="M5457 10148 c-11 -51 -34 -178 -52 -283 -18 -104 -45 -255 -59 -335
-24 -139 -31 -184 -41 -275 -4 -35 -3 -37 5 -15 20 50 173 940 168 978 -2 13
-11 -18 -21 -70z"/>
<path d="M5755 10229 c-2 -8 -13 -50 -24 -94 -32 -135 -110 -443 -147 -578
-19 -70 -32 -132 -28 -139 4 -6 3 -9 -2 -5 -8 4 -45 -144 -142 -568 -3 -11 -2
-17 1 -14 20 17 365 1394 353 1406 -3 3 -8 0 -11 -8z"/>
<path d="M6759 10208 c-9 -18 -35 -69 -58 -113 -24 -44 -34 -69 -22 -55 28 35
114 200 104 200 -5 0 -16 -15 -24 -32z"/>
<path d="M7106 10181 c-33 -54 -54 -83 -131 -176 -13 -16 -32 -46 -42 -65 -10
-19 -23 -40 -29 -46 -6 -7 -44 -65 -84 -130 -131 -211 -242 -387 -292 -461
-26 -40 -48 -75 -48 -78 0 -4 -26 -46 -58 -93 -32 -48 -89 -139 -126 -202
-109 -183 -154 -242 -178 -234 -31 9 -13 -13 25 -31 45 -22 119 -116 105 -132
-7 -9 -7 -13 1 -13 6 0 11 5 11 11 0 5 5 7 10 4 16 -10 12 -22 -9 -28 -14 -3
-36 15 -85 69 -48 53 -84 81 -129 104 -242 119 -534 60 -757 -152 -44 -43 -85
-78 -90 -78 -13 0 -13 33 0 46 14 14 50 123 50 151 0 14 4 21 10 18 6 -4 10
16 11 52 1 44 3 51 8 28 6 -26 8 -20 20 41 27 141 0 370 -58 489 -6 11 -21 47
-34 80 -13 33 -36 77 -50 99 -34 49 -41 89 -27 150 14 65 6 71 -11 7 -7 -28
-16 -51 -20 -51 -4 0 -12 13 -17 29 -6 16 -37 71 -70 122 -32 52 -73 122 -91
157 -17 34 -34 62 -37 62 -4 0 -4 -25 -2 -55 3 -31 1 -50 -3 -43 -4 7 -11 9
-15 6 -8 -8 -7 -632 2 -1043 3 -156 1 -293 -4 -310 -5 -19 -11 191 -16 575 -3
333 -9 631 -13 664 l-6 58 -41 -78 c-23 -44 -71 -124 -106 -179 -56 -88 -76
-128 -134 -260 -24 -53 -45 -128 -56 -195 -22 -140 -9 -245 54 -435 34 -100
76 -283 76 -325 0 -43 -33 -17 -52 42 -49 146 -299 339 -491 378 -265 54 -547
-70 -652 -285 -32 -66 -77 -218 -83 -278 -2 -30 1 -53 9 -63 10 -13 10 -17 0
-24 -9 -5 -10 -9 -2 -11 6 -2 16 -31 22 -64 12 -64 35 -116 69 -155 19 -22 20
-25 5 -28 -9 -2 -27 6 -39 17 -21 20 -53 30 -42 13 2 -4 7 -37 11 -74 6 -57 4
-73 -13 -105 -43 -79 -45 -119 -49 -792 -1 -354 -5 -647 -8 -649 -3 -3 -128
25 -278 61 -149 37 -324 79 -387 93 -63 13 -182 40 -265 59 -82 18 -238 52
-345 75 -357 77 -593 130 -810 184 -229 56 -229 56 -294 12 l-29 -19 6 -156
c5 -132 -7 -880 -14 -918 -1 -7 -7 -13 -12 -13 -5 0 -7 -9 -4 -20 3 -11 1 -18
-4 -15 -8 6 -51 -33 -80 -72 -8 -10 -23 -25 -34 -33 -17 -13 -16 -11 3 17 13
18 27 35 32 38 6 4 10 11 10 16 0 5 -10 3 -22 -5 -13 -8 -27 -15 -33 -14 -5 0
-15 -9 -21 -21 -6 -11 -14 -18 -19 -13 -4 4 -6 0 -2 -10 3 -10 -3 -23 -16 -35
-21 -18 -21 -18 -7 2 14 19 14 19 -3 6 -10 -8 -16 -20 -13 -28 3 -7 2 -13 -2
-13 -22 0 -98 -91 -135 -163 -42 -81 -42 -83 -42 -189 0 -58 -4 -104 -8 -101
-5 3 -4 -4 2 -16 13 -24 23 -29 15 -7 -3 8 -1 17 4 20 5 3 8 -10 6 -29 -1 -20
2 -33 8 -32 6 1 13 -4 16 -12 2 -8 0 -11 -6 -7 -6 4 -8 -2 -5 -14 3 -11 13
-20 22 -20 11 0 12 -3 4 -8 -7 -5 -9 -13 -4 -21 7 -11 12 -8 21 10 12 22 50
71 99 126 20 23 67 40 78 29 3 -3 -19 -33 -50 -65 -32 -33 -57 -58 -57 -55 0
8 -39 -35 -49 -55 -14 -25 -14 -68 -1 -76 13 -8 219 205 243 251 l17 34 -26 6
c-15 4 -49 1 -76 -6 -27 -6 -60 -9 -73 -6 -20 5 -23 3 -18 -11 4 -10 2 -14 -5
-9 -10 6 -29 -29 -24 -46 1 -5 -3 -8 -9 -8 -6 0 -8 -9 -4 -22 5 -17 4 -19 -3
-9 -8 11 -13 7 -26 -18 -9 -17 -19 -31 -21 -31 -9 0 9 66 31 118 13 29 19 50
14 47 -24 -15 5 61 37 97 8 9 16 23 17 32 1 9 18 33 37 53 20 22 27 34 16 30
-15 -6 -16 -4 -7 13 6 11 15 20 20 20 6 0 10 6 10 13 0 8 10 22 22 33 12 10
18 13 13 5 -5 -10 -4 -12 3 -7 7 4 12 14 12 22 0 8 4 14 10 14 16 0 69 80 80
122 6 21 15 38 20 38 7 0 9 -216 8 -596 l-3 -596 -54 -18 c-29 -11 -83 -38
-118 -60 -35 -22 -68 -40 -74 -40 -12 0 -12 17 1 25 7 4 7 12 0 25 -7 13 -6
21 5 30 8 7 15 20 15 29 0 9 5 22 11 28 9 9 7 10 -10 6 -19 -5 -27 -26 -22
-56 1 -5 -3 -6 -8 -3 -19 12 -94 -7 -120 -31 -14 -14 -43 -32 -64 -40 -43 -17
-38 15 -43 -288 -1 -104 0 -207 3 -228 l5 -37 73 102 c71 100 260 308 280 308
5 0 -30 -39 -77 -88 -85 -85 -156 -168 -191 -225 l-18 -28 28 7 c15 4 44 14
63 22 19 8 35 13 35 11 0 -1 30 8 68 22 37 13 65 29 63 35 -4 10 95 74 114 74
4 0 13 7 20 15 26 32 31 13 30 -113 -1 -70 -1 -203 -1 -295 l1 -169 29 -29
c61 -60 59 -71 63 388 l3 418 34 71 c22 49 31 79 26 94 l-7 22 -26 -25 c-15
-13 -52 -40 -82 -60 -30 -20 -82 -59 -115 -88 l-60 -53 45 48 c25 27 79 72
121 102 91 64 110 84 83 84 -18 0 -19 15 -20 353 -2 303 0 330 7 193 7 -127
12 -163 25 -175 12 -12 18 -13 21 -3 3 6 11 12 19 12 10 0 14 13 14 48 0 65
15 86 23 31 3 -23 11 -45 17 -49 9 -6 9 -9 0 -12 -10 -3 -11 -9 -2 -24 6 -10
12 -13 12 -6 0 10 5 10 20 2 19 -10 20 -8 20 75 l0 85 -35 0 c-19 0 -35 5 -35
10 0 6 16 10 35 10 l35 0 0 115 0 115 -32 0 c-37 0 -33 9 8 16 16 3 29 6 30 7
0 1 -1 50 -4 108 -4 105 -4 106 -28 101 -14 -2 -24 0 -24 7 0 6 14 11 30 11
l30 0 0 94 c0 102 -2 105 -68 106 -14 0 -21 4 -16 11 4 7 21 9 45 5 l39 -6 0
84 0 85 -42 10 -43 11 42 -5 43 -5 0 79 c0 66 -3 82 -18 90 -16 10 -16 10 1
11 15 0 17 11 17 85 l0 85 -31 0 c-17 0 -28 4 -24 10 3 6 17 10 31 10 l24 0 0
118 c0 64 3 154 7 200 l6 82 41 0 c23 0 59 -5 81 -10 26 -6 42 -5 46 1 4 7 8
5 12 -4 4 -12 48 -23 167 -41 8 -1 31 -7 50 -14 34 -11 315 -63 328 -60 4 1
14 -1 22 -5 17 -6 97 -21 208 -39 62 -9 75 -9 83 3 7 12 9 11 9 -2 0 -14 42
-27 145 -43 51 -8 160 -29 270 -51 66 -13 143 -27 170 -31 28 -4 55 -10 60
-14 6 -4 35 -15 65 -24 59 -17 145 -64 136 -74 -4 -3 -12 0 -18 6 -21 21 -37
13 -41 -20 l-4 -33 -1 37 c-3 59 -35 69 -497 157 -132 25 -123 26 -130 -16
-11 -68 -13 -69 -14 -12 l-1 56 -52 11 c-98 22 -91 25 -91 -48 l1 -65 -8 64
c-5 35 -11 65 -12 67 -4 4 -220 42 -263 47 -17 2 -35 6 -41 9 -5 4 -47 12 -94
18 -68 10 -280 52 -428 85 -23 6 -23 5 -20 -97 l3 -103 95 -16 c53 -9 133 -19
177 -22 79 -6 82 -5 86 16 4 19 4 18 6 -5 0 -16 8 -28 18 -31 17 -4 17 -5 1
-6 -10 0 -18 -7 -18 -13 0 -10 -2 -10 -8 -2 -4 7 -68 20 -142 29 -74 9 -154
19 -177 22 l-42 6 -4 -79 -3 -79 -2 81 -2 81 -63 7 c-34 4 -73 10 -86 13 l-24
6 6 -84 c4 -46 7 -85 7 -86 0 -2 12 -3 28 -4 15 0 36 -4 47 -9 14 -6 6 -8 -30
-7 l-50 2 -3 -87 -3 -88 68 -1 c85 -2 111 -5 193 -18 106 -18 100 -22 102 72
l2 82 5 -85 6 -85 70 -11 c39 -7 71 -11 72 -10 2 1 6 40 9 87 l7 85 -159 18
c-217 24 -287 36 -174 30 47 -3 132 -10 190 -16 58 -6 115 -12 128 -12 24 -1
24 0 22 -106 -1 -41 1 -73 3 -70 6 6 70 159 103 246 17 46 20 64 11 73 -8 8
-2 11 25 11 37 0 37 0 41 48 l3 47 2 -47 c2 -45 4 -48 30 -48 47 0 72 -11 72
-31 0 -11 19 -61 42 -111 39 -86 60 -143 140 -369 21 -57 28 -93 23 -105 -11
-25 -6 -55 11 -75 13 -14 13 -17 0 -22 -9 -4 -16 -23 -19 -54 l-3 -48 -2 58
c-1 38 -6 57 -14 57 -10 0 -9 3 1 9 9 6 11 18 6 39 -5 26 -12 32 -43 38 -20 4
-45 11 -54 16 -16 8 -18 3 -18 -36 0 -32 5 -48 17 -55 17 -10 17 -10 1 -11
-14 0 -18 -9 -19 -42 -3 -74 0 -92 16 -100 23 -13 45 -63 45 -102 0 -62 -67
-103 -115 -72 -14 9 -25 13 -26 9 -1 -5 -9 17 -18 47 -10 30 -15 57 -11 60 3
3 13 17 23 33 11 17 26 27 42 27 24 0 25 2 25 69 0 46 -4 71 -12 74 -8 3 -6 6
5 6 14 1 17 11 17 72 0 40 -5 89 -12 110 -11 39 -11 39 -63 39 -29 0 -79 3
-111 6 l-59 6 -34 -67 c-19 -37 -40 -69 -48 -72 -7 -3 -13 -18 -13 -33 0 -33
17 -40 111 -40 l66 0 -3 73 c-2 51 -1 63 5 42 5 -16 9 -53 10 -82 l1 -52 -90
6 c-62 4 -94 2 -104 -6 -9 -7 -15 -8 -18 -2 -2 6 -77 13 -175 17 l-173 7 0
-77 0 -76 53 0 c74 0 89 -14 85 -75 -3 -47 -5 -49 -38 -58 -45 -11 -60 -24
-60 -52 0 -13 6 -25 13 -28 6 -2 -4 -3 -23 -2 l-35 2 4 82 c1 44 -1 81 -5 81
-5 0 -8 44 -6 99 l3 98 -32 7 c-17 3 -55 6 -83 6 l-51 0 -3 -94 -2 -94 47 -10
48 -10 -47 -1 -48 -1 0 -105 0 -105 84 0 c58 0 86 4 89 13 4 10 6 10 6 0 1 -9
24 -13 80 -13 l80 0 5 -42 c4 -24 7 -65 9 -93 2 -54 -3 -50 70 -54 12 -1 17
-9 17 -31 l0 -30 -72 0 c-102 0 -81 -6 45 -13 70 -4 105 -2 101 4 -3 5 -15 9
-27 7 -21 -3 -22 0 -25 125 l-3 127 66 0 c57 0 65 -2 65 -19 0 -21 -19 -31
-61 -31 -25 0 -29 -4 -29 -26 0 -24 2 -26 34 -20 41 8 49 -2 40 -48 -4 -25
-12 -36 -28 -39 -11 -2 -1 -5 23 -6 36 -1 42 2 37 15 -4 12 -2 15 9 10 8 -3
14 -2 13 2 -4 13 21 72 30 72 6 0 13 12 17 27 18 73 49 70 71 -7 9 -33 20 -62
23 -64 3 -2 17 0 30 5 21 8 23 14 19 53 -7 60 0 68 57 64 39 -2 52 -8 69 -31
21 -28 21 -28 -9 -99 -5 -14 -2 -18 13 -18 23 0 32 32 33 124 0 47 2 56 9 39
5 -13 14 -23 19 -23 6 0 28 -22 49 -49 l39 -49 0 37 c-1 117 13 120 42 9 l21
-83 -5 61 c-5 57 -4 61 20 74 38 20 45 3 45 -117 l0 -103 -26 0 c-14 0 -23 4
-19 10 3 6 -1 17 -9 26 -15 14 -16 14 -16 -5 0 -22 -24 -29 -35 -11 -4 6 -10
8 -14 5 -5 -2 -13 7 -19 20 -7 15 -20 25 -32 25 -18 0 -20 -5 -18 -40 2 -48 9
-51 118 -46 154 6 156 6 140 16 -8 5 -22 7 -31 5 -14 -5 -16 10 -18 110 -2
110 -1 115 18 115 13 0 35 -20 61 -55 22 -30 43 -55 46 -55 3 0 4 26 2 58 -3
52 -1 57 19 60 21 3 22 2 16 -106 l-6 -109 66 -13 c49 -10 68 -19 73 -32 3
-10 9 -16 14 -13 5 3 7 11 4 18 -3 9 8 11 38 9 28 -2 50 2 63 12 19 15 18 15
-25 17 -61 3 -61 3 -98 -5 -29 -7 -37 -4 -72 32 -31 31 -40 47 -40 74 0 36 32
93 62 112 25 15 92 -4 96 -28 3 -16 -1 -18 -30 -13 -42 6 -64 -5 -72 -38 -6
-25 14 -87 32 -99 6 -3 18 1 27 10 19 19 12 32 -8 16 -19 -16 -26 -6 -18 26 8
29 53 57 76 48 11 -4 14 -20 12 -62 -2 -32 -2 -53 1 -46 2 7 10 12 18 12 16 0
57 43 60 63 1 6 5 33 9 60 l7 47 -48 0 c-27 0 -56 5 -64 10 -11 7 3 10 48 10
47 0 62 3 62 14 0 8 5 18 10 21 6 4 10 3 9 -2 -7 -38 1 -43 66 -43 l65 0 0 90
0 90 -65 0 c-37 0 -65 4 -65 10 0 11 3 12 75 14 l50 1 0 70 0 70 -74 5 -73 5
7 -90 c12 -151 10 -167 -20 -193 -26 -22 -33 -23 -189 -21 -173 1 -200 6 -179
36 35 50 63 113 50 113 -19 0 -68 -78 -74 -117 -4 -24 -11 -33 -25 -33 -11 0
-22 9 -25 20 -6 24 -4 24 -58 -1 -30 -14 -51 -18 -67 -13 -13 4 -27 7 -31 6
-5 -1 -6 1 -3 6 3 5 -9 29 -27 53 l-32 44 -3 -63 c-2 -46 -7 -62 -17 -62 -12
0 -15 16 -15 78 0 42 -3 87 -6 100 -11 40 30 26 75 -25 l40 -48 1 48 c0 26 5
47 10 47 6 0 13 0 17 0 4 0 6 -31 4 -69 -1 -42 2 -71 8 -75 7 -5 11 3 11 20 0
15 9 42 21 60 17 28 20 47 17 116 -3 78 -4 82 -28 89 -24 7 -24 7 -2 8 16 1
22 7 23 24 0 22 0 22 9 1 9 -24 65 -31 243 -34 l97 -1 2 63 2 63 3 -58 c3 -34
9 -60 16 -62 7 -2 40 -6 75 -9 56 -5 62 -4 62 13 0 12 -11 23 -32 30 -34 12
-68 38 -68 53 0 5 20 7 45 5 28 -3 46 -1 49 7 2 6 5 1 6 -11 2 -13 4 -27 5
-33 1 -5 3 -22 4 -37 l1 -28 72 2 73 2 2 71 3 72 -158 -2 c-255 -5 -332 -2
-332 13 0 10 15 11 73 5 74 -8 392 -2 408 8 5 3 9 36 9 75 l0 69 -62 2 -63 1
60 6 60 6 2 109 c1 59 4 111 7 114 3 3 6 -9 6 -26 0 -24 5 -32 23 -35 l22 -4
-22 -2 c-22 -1 -23 -5 -23 -76 l0 -75 38 -1 37 -2 -35 -6 -35 -6 -3 -77 -3
-78 45 0 45 0 4 93 c2 76 3 70 4 -33 0 -69 -2 -115 -4 -102 -4 19 -11 22 -49
22 l-44 0 0 -74 0 -74 40 1 c36 2 42 5 49 32 9 29 9 28 10 -12 l1 -43 -50 0
-50 0 0 -75 0 -75 40 0 40 0 1 43 c3 106 18 -77 20 -256 l3 -189 23 5 c12 2
21 1 19 -2 -2 -3 3 -19 10 -36 12 -26 13 -27 14 -7 0 22 20 32 20 10 0 -9 3
-9 12 0 14 14 7 23 -20 25 -11 0 -19 5 -16 9 3 4 11 5 19 1 8 -3 15 -1 16 3 0
5 2 20 5 34 5 34 12 215 24 594 9 320 19 419 21 225 1 -66 4 -91 8 -69 9 47
20 -107 18 -242 -2 -76 1 -99 12 -103 11 -4 12 -8 3 -17 -15 -15 -16 -130 0
-146 8 -8 17 -8 31 -1 10 6 34 8 52 5 22 -4 35 -2 37 6 3 9 15 7 46 -5 l42
-17 0 55 c0 58 20 79 21 23 0 -31 1 -31 10 -10 5 13 7 28 3 33 -3 5 0 9 5 9 6
0 11 9 11 20 0 11 -5 20 -11 20 -6 0 -9 -6 -6 -13 4 -10 -8 -14 -43 -16 -42
-2 -50 2 -71 28 -13 16 -27 27 -31 25 -4 -3 -8 14 -8 38 l1 43 17 -33 c16 -30
19 -31 32 -15 8 10 14 28 12 41 -3 20 0 22 31 19 26 -3 34 -1 30 9 -7 18 38 5
55 -15 11 -13 12 -13 6 -1 -7 13 -6 13 9 1 10 -8 20 -11 24 -8 9 9 34 -13 27
-24 -3 -5 1 -9 10 -9 8 0 17 -6 19 -12 4 -10 6 -10 6 0 1 7 6 10 11 7 6 -3 10
1 10 10 0 9 5 13 11 10 5 -4 8 -14 6 -23 -5 -26 28 -85 68 -120 20 -18 31 -32
24 -32 -6 0 -29 17 -50 38 -39 40 -73 51 -66 23 2 -9 8 -15 14 -14 14 3 38
-25 29 -34 -4 -4 -10 -2 -14 5 -5 6 -19 13 -32 14 -22 3 -25 -1 -25 -32 0 -32
3 -35 29 -35 16 -1 31 -6 34 -13 4 -14 158 -17 167 -3 3 5 -5 11 -17 13 -12 2
-23 9 -26 17 -3 10 2 13 20 9 24 -4 24 -3 25 54 1 53 -1 58 -18 53 -20 -7 -87
11 -104 27 -6 6 16 6 58 2 66 -7 67 -6 69 17 6 94 5 105 -9 121 -10 11 -13 24
-7 35 4 10 9 29 10 43 2 14 8 26 14 28 15 5 13 72 -2 72 -9 0 -8 3 2 9 9 6 14
27 15 55 0 25 3 46 6 46 11 0 18 -61 20 -178 2 -84 -1 -116 -10 -122 -10 -5
-11 -22 -6 -59 7 -49 8 -51 38 -51 18 0 39 -5 47 -10 11 -7 2 -10 -32 -10
l-46 0 -7 -72 c-7 -73 -1 -185 9 -196 3 -3 6 0 6 6 0 7 8 12 18 12 9 0 28 10
42 21 16 13 18 17 6 11 -13 -7 -28 -6 -43 1 l-23 10 26 14 c15 7 38 13 53 13
33 0 43 8 58 43 7 15 17 27 23 27 5 0 10 21 10 46 0 31 4 43 11 38 7 -4 9 -23
5 -50 -5 -39 -3 -44 14 -44 22 0 27 -16 8 -23 -8 -3 -6 -6 5 -6 9 -1 17 4 17
10 0 5 5 7 11 3 9 -5 10 21 4 99 -7 112 -1 171 18 164 7 -2 14 -17 15 -33 2
-16 9 -32 15 -36 19 -12 55 -9 60 5 3 6 6 -10 6 -36 1 -27 -3 -46 -8 -43 -4 3
-22 0 -38 -6 -24 -9 -30 -17 -29 -40 1 -15 3 -28 6 -28 3 0 4 -19 3 -42 -2
-33 -1 -37 5 -18 8 25 8 25 14 3 6 -24 41 -32 54 -12 3 6 17 8 30 5 14 -4 24
-2 24 4 0 5 7 10 15 10 9 0 15 -9 15 -25 0 -14 4 -25 10 -25 5 0 7 -6 4 -14
-3 -7 2 -16 12 -20 13 -5 15 -2 9 21 -3 15 -9 61 -12 102 -3 42 -6 77 -7 79
-2 1 -24 3 -49 4 -63 3 -65 28 -3 28 36 0 47 5 60 25 10 15 12 25 6 25 -7 0
-4 7 4 16 9 8 13 20 10 25 -3 6 2 20 13 31 10 12 13 19 7 15 -7 -4 -8 16 -2
66 12 110 17 121 12 27 -3 -46 -3 -82 0 -79 3 3 18 24 33 46 42 61 126 149
130 136 4 -12 58 1 77 18 6 5 18 9 28 9 10 0 18 4 18 10 0 5 7 7 15 4 8 -4 17
1 21 10 3 9 10 13 15 10 5 -3 9 2 9 10 0 13 -14 16 -67 17 l-68 1 60 9 c33 5
66 7 74 4 11 -5 13 7 7 67 -4 40 -11 75 -17 79 -8 5 -8 8 -1 10 18 6 18 149 1
160 -8 5 -51 9 -95 9 -72 0 -83 2 -96 22 -14 20 -20 21 -176 19 -93 -1 -162 2
-162 7 0 11 220 35 281 30 l44 -3 7 119 c4 65 9 121 12 124 4 3 6 -46 7 -109
0 -63 5 -130 12 -149 11 -32 16 -35 57 -38 25 -2 62 2 83 8 l38 11 -1 87 c0
48 2 107 6 132 l6 46 -69 27 c-90 35 -134 73 -168 144 -24 51 -27 67 -23 134
7 120 53 179 197 254 40 20 92 15 154 -16 113 -57 169 -137 170 -244 1 -111
-61 -198 -179 -256 -34 -16 -64 -35 -66 -42 -2 -6 -3 -73 -3 -147 l0 -135 65
-3 c36 -2 83 3 105 10 34 11 41 18 46 48 5 28 7 30 8 9 1 -22 5 -26 26 -21 31
6 55 -13 48 -38 -3 -13 -16 -20 -36 -22 -26 -2 -33 -8 -38 -33 l-7 -30 -1 28
-1 27 -95 0 c-87 0 -95 -2 -106 -22 -15 -29 -15 -313 1 -312 5 1 52 2 104 3
81 1 95 4 99 19 4 16 5 16 6 0 1 -15 11 -18 53 -18 28 0 49 -2 47 -4 -4 -5
-184 -14 -278 -15 -47 -1 -52 -3 -41 -17 23 -27 53 -37 128 -44 l72 -6 0 28
c0 47 15 31 16 -17 2 -45 -3 -53 -22 -37 -5 5 -20 5 -34 1 -25 -9 -25 -9 3 -5
15 2 27 0 27 -5 0 -4 9 -10 20 -14 23 -7 79 -82 115 -153 14 -28 30 -54 35
-57 4 -3 11 -19 15 -36 12 -53 19 -22 18 84 l0 102 7 -90 c4 -49 10 -99 14
-110 7 -17 6 -17 -4 -5 -9 12 -10 5 -5 -30 6 -46 7 -85 1 -156 -3 -25 0 -41 8
-42 6 -1 43 -4 83 -6 80 -5 82 -4 77 79 -1 22 -2 55 -3 73 -1 31 -2 32 -46 32
-26 0 -45 5 -45 11 0 7 17 10 45 7 51 -4 51 -3 39 86 -6 42 -9 46 -34 46 -29
0 -40 15 -40 55 0 27 12 33 51 27 27 -4 28 -6 34 -81 3 -42 10 -95 15 -118 6
-23 10 -83 10 -132 0 -90 0 -91 25 -91 14 0 25 -5 25 -11 0 -7 -10 -9 -25 -7
-25 5 -25 5 -25 -74 0 -69 2 -79 16 -74 9 3 23 6 32 6 10 0 23 9 30 20 11 17
10 20 -8 20 -14 0 -18 -5 -14 -17 5 -17 5 -17 -6 0 -12 19 -4 57 14 69 7 5 4
8 -6 8 -10 0 -18 -7 -18 -16 0 -8 -5 -12 -10 -9 -17 11 7 44 28 38 17 -4 19 2
15 74 -2 43 -5 96 -8 118 -2 22 -7 94 -10 160 -3 65 -7 121 -9 122 -1 2 -42 4
-89 6 -93 2 -100 9 -22 25 43 9 57 8 104 -11 l54 -22 2 -95 c6 -334 4 -308 21
-277 12 22 21 28 42 25 31 -3 41 -31 19 -52 -9 -9 -13 -30 -11 -55 1 -23 -2
-41 -7 -41 -5 0 -9 8 -9 18 0 18 -31 62 -44 62 -3 0 -6 -36 -6 -80 0 -81 12
-103 29 -56 8 19 29 36 47 36 2 0 3 -16 1 -35 l-4 -34 41 25 c23 14 53 30 69
36 26 9 27 13 27 74 0 55 -3 64 -16 62 -10 -2 -19 3 -21 10 -3 8 7 12 31 12
38 0 39 -1 38 -70 0 -21 0 -22 4 -4 5 19 15 23 80 29 91 8 112 -1 25 -11 -34
-3 -61 -11 -61 -16 0 -6 -6 -8 -14 -5 -7 3 -13 0 -13 -6 0 -7 -1 -23 -2 -37
l-3 -25 -8 25 -8 25 -1 -27 c-1 -27 12 -37 23 -19 8 12 57 11 81 -2 27 -15 55
-16 55 -3 0 6 4 4 9 -3 13 -20 20 13 24 109 l3 75 2 -87 c2 -94 22 -153 53
-163 10 -4 34 -3 53 0 28 6 36 13 39 34 4 22 2 86 -3 86 -1 0 -3 17 -4 38 -1
26 3 41 13 47 14 8 14 9 -1 15 -14 6 -15 11 -7 27 7 14 7 23 -1 33 -8 10 -7
17 5 29 15 15 15 16 0 16 -10 0 -15 6 -13 18 2 10 11 16 21 14 9 -2 17 2 17 8
0 7 -14 9 -37 6 -21 -3 -30 -3 -20 0 9 3 17 12 17 21 0 11 7 13 29 8 17 -3 32
-2 36 4 4 7 -5 11 -24 11 -20 0 -31 5 -31 14 0 21 19 30 35 16 12 -10 16 -9
21 3 8 23 -4 37 -32 37 -17 0 -24 5 -24 20 0 22 20 26 38 8 9 -9 12 -8 12 5 0
10 -8 17 -20 17 -13 0 -20 7 -20 20 0 22 10 26 27 9 7 -7 13 -7 17 -1 3 6 -5
19 -19 30 -30 24 -33 52 -5 52 13 0 20 7 20 20 0 11 -3 19 -7 19 -27 -4 -33 4
-33 50 0 28 5 53 10 56 13 8 10 85 -3 103 -7 8 -6 21 3 37 13 25 13 25 28 4 8
-11 11 -27 7 -37 -9 -20 -6 -105 3 -112 4 -3 7 -23 8 -45 4 -221 4 -225 19
-225 8 0 15 -4 15 -10 0 -5 -6 -9 -12 -7 -10 1 -13 -40 -14 -176 -2 -154 0
-178 13 -173 9 4 13 1 10 -6 -2 -7 -9 -12 -14 -11 -6 1 -10 -8 -9 -20 1 -12
-4 -31 -11 -43 -15 -24 -9 -35 15 -27 10 3 13 1 7 -4 -15 -12 -14 -53 2 -53
17 0 18 61 1 78 -8 8 -8 12 -1 12 6 0 14 7 17 16 4 12 2 15 -9 10 -20 -7 -19
3 2 26 14 16 16 57 18 345 2 181 4 333 5 338 1 6 5 1 10 -10 4 -11 6 -155 3
-320 -4 -215 -2 -331 7 -405 15 -119 18 -148 19 -172 1 -9 12 -28 25 -41 18
-18 25 -41 33 -103 10 -79 10 -79 12 69 0 90 5 147 11 147 6 0 10 -54 10 -142
0 -155 5 -188 26 -188 8 0 14 -5 14 -10 0 -14 48 -2 77 19 27 19 29 46 6 60
-21 11 -11 26 12 18 10 -5 15 -20 15 -52 0 -25 5 -45 10 -45 12 0 10 -113 16
720 7 766 5 740 57 774 25 17 94 32 502 111 287 56 681 136 989 200 195 41
271 51 280 36 4 -6 1 -9 -7 -5 -21 8 -175 -20 -452 -81 -132 -29 -337 -72
-455 -94 -933 -180 -869 -164 -889 -222 -14 -40 -16 -1595 -2 -1603 5 -3 14 8
20 24 7 21 17 30 31 30 16 0 21 5 18 22 -2 16 3 23 20 28 13 3 30 16 37 30
l14 25 1 -25 c0 -22 4 -25 38 -25 20 -1 43 -3 51 -5 7 -3 15 0 18 6 2 7 -12
15 -32 18 -19 4 -33 11 -30 15 2 5 -9 14 -25 21 -45 18 -40 51 11 79 39 22 44
23 232 16 106 -4 214 -11 241 -16 27 -5 99 -9 160 -9 61 0 174 -5 251 -11 77
-6 251 -10 388 -11 272 0 268 1 261 -62 -4 -42 -20 -48 -104 -41 -93 8 -472
24 -720 32 -181 5 -185 5 -164 -13 37 -32 44 -77 44 -282 0 -168 2 -193 15
-188 11 4 15 -2 16 -22 l1 -27 8 25 c4 14 8 118 9 232 1 113 4 213 7 222 4 10
18 16 40 16 l34 0 1 -62 c0 -35 0 -97 -1 -140 -1 -44 3 -79 9 -83 7 -4 11 6
12 27 2 47 3 53 12 55 4 2 20 9 35 17 20 10 33 11 46 4 13 -7 26 -7 43 1 32
15 60 14 70 -2 4 -7 21 -21 37 -31 24 -16 28 -23 23 -52 -4 -20 0 -45 9 -62 7
-15 14 -34 14 -42 0 -9 4 -20 9 -25 6 -6 12 -30 14 -55 6 -59 0 144 -9 288
l-7 112 50 0 50 0 6 -57 c3 -31 2 -64 -4 -74 -14 -26 -10 -101 6 -123 8 -10
12 -23 8 -28 -3 -6 5 -4 18 2 19 11 24 10 36 -6 7 -10 13 -25 13 -34 0 -19 37
-53 45 -41 13 22 45 139 45 168 0 45 -41 76 -91 69 -34 -5 -36 -3 -32 17 9 37
24 47 64 47 24 0 39 5 39 12 0 7 7 2 16 -11 19 -27 28 -99 29 -226 l0 -90 -27
-3 c-24 -3 -28 -8 -28 -36 0 -17 -5 -37 -11 -43 -8 -8 -8 -13 0 -17 6 -4 11 0
11 9 0 9 5 13 10 10 6 -4 -2 -21 -20 -43 -21 -25 -26 -38 -18 -43 7 -5 18 -3
25 3 7 5 19 8 27 5 20 -8 47 25 36 43 -5 8 -6 18 -3 23 5 8 8 36 17 177 2 30
8 64 12 74 6 15 4 17 -6 11 -10 -6 -12 -2 -7 16 4 13 7 47 7 75 0 44 3 52 25
64 20 11 27 11 40 0 8 -7 15 -8 15 -3 0 11 80 11 98 0 6 -5 32 -5 57 -1 37 5
44 4 40 -8 -4 -9 0 -15 9 -15 8 0 12 6 9 16 -5 12 -3 13 6 5 24 -22 9 -49 -27
-49 -43 0 -42 -18 2 -28 l35 -9 4 -116 c2 -65 4 158 3 493 -1 336 2 576 5 535
4 -41 7 -244 8 -451 1 -513 11 -831 25 -826 6 2 10 12 8 22 -3 14 1 16 17 12
18 -4 21 0 23 26 1 18 4 -2 8 -43 4 -41 7 403 8 988 1 584 5 1062 10 1062 4 0
7 -201 7 -447 1 -642 8 -1593 12 -1493 3 51 9 88 16 93 9 6 9 10 1 13 -7 3
-10 14 -7 25 4 16 8 17 20 7 11 -9 16 -9 24 3 10 16 13 0 11 -56 -1 -29 -1
-29 8 -5 4 14 9 54 10 90 1 36 5 74 9 85 16 40 21 -100 21 -612 0 -318 4 -523
9 -523 26 0 62 22 70 43 9 24 22 3346 13 3392 -3 19 -17 29 -57 44 l-53 20
-144 -33 c-236 -55 -621 -146 -658 -157 -36 -10 -584 -135 -820 -188 -74 -16
-214 -46 -310 -65 -96 -20 -215 -47 -265 -60 -59 -16 -93 -21 -100 -15 -7 7
-10 257 -9 717 1 430 -2 709 -8 713 -5 3 -23 4 -41 2 -52 -7 -90 -4 -100 6
-23 23 -2 98 41 153 8 9 11 22 6 29 -4 8 -3 10 4 5 8 -5 12 2 12 19 0 17 4 24
11 19 8 -4 9 4 5 27 -6 30 -5 31 5 14 12 -18 13 -17 25 15 7 19 13 45 13 57 1
12 5 23 10 25 6 2 15 32 20 68 12 76 1 202 -23 273 -16 46 -16 49 4 80 l22 32
-26 -30 c-14 -16 -26 -41 -26 -55 -1 -54 -16 -49 -46 16 -18 39 -25 63 -17 60
8 -3 13 2 13 12 0 14 4 12 21 -8 19 -24 19 -23 -2 18 -11 23 -25 42 -30 42 -5
0 -9 5 -9 11 0 10 -53 72 -92 107 -20 18 -14 33 37 97 17 22 71 106 119 188
48 81 107 174 132 207 52 70 167 249 382 595 86 138 185 291 220 340 61 86 97
145 89 145 -2 0 -21 -27 -41 -59z m-1966 -794 c-1 -14 -39 52 -40 68 0 6 9 -5
20 -23 11 -18 20 -38 20 -45z m25 -47 c14 -27 21 -59 10 -49 -8 9 -35 79 -30
79 2 0 11 -13 20 -30z m85 -577 c-15 -74 -91 -273 -104 -273 -6 0 8 44 59 185
19 55 37 106 40 113 9 25 12 11 5 -25z m-1226 -73 c79 -12 199 -57 259 -99 54
-37 175 -151 162 -151 -6 0 -34 22 -62 49 -75 72 -135 109 -226 143 -148 54
-321 53 -429 -2 -146 -74 -212 -137 -257 -244 -35 -82 -40 -73 -10 16 24 72
67 138 112 172 43 32 181 96 242 111 62 16 120 18 209 5z m1920 -34 c38 -14
97 -46 132 -71 81 -58 96 -80 18 -28 -84 57 -134 81 -206 98 -112 26 -242 15
-342 -29 -50 -22 -173 -114 -248 -185 -52 -48 -48 -21 5 36 39 43 159 128 234
167 106 54 284 59 407 12z m-1976 -256 c34 -18 62 -36 62 -39 -1 -8 -87 -71
-97 -71 -5 0 -14 9 -21 20 -18 30 -117 28 -163 -3 -68 -45 -85 -135 -41 -210
25 -42 93 -71 150 -63 54 7 70 20 74 60 3 30 3 30 -44 27 l-48 -3 0 51 0 51
103 0 102 0 -3 -110 -3 -110 -67 -32 c-56 -27 -78 -32 -137 -32 -82 1 -126 17
-183 69 -56 50 -82 107 -82 178 0 104 47 179 142 227 56 28 70 31 129 27 49
-3 81 -12 127 -37z m945 -47 c20 -49 45 -113 56 -143 10 -30 40 -103 65 -162
25 -59 46 -108 46 -110 0 -2 -28 -1 -62 2 -58 5 -62 6 -72 37 -19 55 -27 58
-139 54 -56 -1 -104 -4 -105 -6 -2 -2 -10 -21 -17 -42 -13 -38 -14 -38 -74
-43 -69 -6 -72 -1 -41 59 10 21 38 85 60 142 23 57 61 145 86 194 l46 90 46 6
c26 3 52 7 58 7 6 1 27 -37 47 -85z m296 76 l32 -11 -2 -157 c-2 -132 1 -161
15 -183 38 -58 123 -60 157 -4 17 27 19 51 19 194 l0 162 58 0 57 0 -3 -162
c-4 -196 -12 -231 -63 -280 -97 -92 -267 -70 -334 42 -18 32 -20 52 -20 205 0
94 3 178 7 188 8 20 32 22 77 6z m830 -66 c-24 -37 -61 -89 -82 -116 -22 -26
-37 -53 -34 -60 3 -7 41 -65 86 -129 45 -64 81 -119 81 -122 0 -3 -29 -6 -64
-6 l-64 0 -25 43 c-14 23 -39 61 -57 85 l-31 44 -62 -81 -62 -81 -62 0 c-35 0
-63 2 -63 5 0 3 20 31 44 62 23 32 64 87 90 122 l47 63 -44 57 c-24 31 -63 84
-86 119 l-42 62 69 0 69 0 48 -75 c27 -42 52 -74 57 -73 4 2 29 35 55 73 l48
70 60 5 c33 3 62 4 64 3 2 -1 -16 -33 -40 -70z m-1551 15 l3 -48 -115 0 -116
0 0 -52 0 -53 106 3 105 4 -3 -44 -3 -43 -102 -3 -103 -3 0 -27 c0 -15 -3 -37
-6 -49 -6 -23 -6 -23 121 -23 l128 0 -7 -31 c-3 -17 -6 -40 -6 -50 0 -18 -11
-19 -175 -19 l-175 0 0 245 0 245 173 -2 172 -3 3 -47z m600 -73 c-12 -75 -28
-109 -28 -59 0 32 29 139 35 132 2 -2 -1 -35 -7 -73z m-241 -452 c-2 -32 -3
-8 -3 52 0 61 1 87 3 58 2 -29 2 -78 0 -110z m-1397 85 c11 -21 45 -65 75 -99
49 -55 69 -87 48 -77 -24 10 -125 131 -142 168 -23 49 -29 87 -10 60 5 -8 19
-32 29 -52z m2827 8 c-24 -62 -36 -68 -17 -9 11 34 27 63 35 63 2 0 -6 -24
-18 -54z m-2782 -156 c10 -11 16 -20 13 -20 -3 0 -13 9 -23 20 -10 11 -16 20
-13 20 3 0 13 -9 23 -20z m377 -145 c73 -163 82 -198 46 -193 -15 2 -24 14
-32 43 l-12 40 -88 0 -89 0 -10 -30 c-13 -41 -26 -55 -43 -48 -15 6 -19 43 -6
59 5 5 19 34 32 64 53 128 104 221 119 218 8 -2 44 -67 83 -153z m2006 81 c23
-30 42 -60 42 -66 0 -24 18 -6 64 65 32 49 55 75 67 75 32 0 22 -32 -38 -126
-50 -77 -59 -97 -63 -149 -4 -47 -9 -61 -22 -63 -16 -3 -18 5 -18 64 0 42 -5
73 -13 83 -30 35 -107 173 -102 182 10 16 40 -7 83 -65z m-1632 43 c19 -11 34
-26 34 -34 0 -19 -42 -26 -60 -10 -27 24 -66 28 -104 10 -54 -26 -76 -59 -76
-116 0 -42 5 -53 35 -84 20 -19 46 -35 58 -36 42 -2 72 3 101 18 23 12 30 12
37 2 20 -32 -38 -69 -108 -69 -48 0 -96 25 -138 71 -31 35 -35 45 -35 95 0 68
19 106 72 144 52 38 131 42 184 9z m271 -11 c10 -18 28 -55 40 -83 63 -143 93
-218 90 -221 -12 -12 -48 14 -62 47 -20 43 -32 46 -142 33 -48 -6 -52 -8 -57
-39 -6 -32 -29 -51 -47 -39 -5 3 -9 10 -9 16 0 8 122 285 137 311 10 16 32 5
50 -25z m376 18 c69 -28 127 -129 111 -193 -20 -78 -83 -119 -202 -129 l-82
-7 -2 84 c-2 46 -3 123 -3 171 l0 88 73 0 c40 0 87 -6 105 -14z m425 -8 c-3
-22 -8 -23 -90 -26 l-88 -3 0 -49 0 -50 80 0 c73 0 80 -2 80 -20 0 -18 -7 -20
-80 -20 l-80 0 0 -50 0 -50 90 0 c82 0 90 -2 90 -19 0 -24 -51 -34 -155 -29
l-70 3 -1 168 -2 167 115 0 c113 0 114 0 111 -22z m182 -83 c36 -58 67 -105
70 -105 3 0 12 15 21 33 34 68 111 177 124 177 13 0 15 -26 15 -151 0 -144 -9
-197 -31 -184 -5 4 -9 59 -10 123 0 94 -2 113 -12 98 -7 -10 -32 -49 -55 -87
-24 -38 -49 -69 -56 -69 -7 0 -36 36 -65 80 -29 44 -54 80 -56 80 -2 0 -1 -49
2 -110 6 -108 6 -110 -16 -110 -20 0 -21 5 -21 83 0 45 -3 119 -7 165 -6 76
-5 82 13 82 13 0 39 -32 84 -105z m695 25 c3 -6 -1 -7 -9 -4 -18 7 -21 14 -7
14 6 0 13 -4 16 -10z m-1123 -302 c-7 -7 -12 -8 -12 -2 0 14 12 26 19 19 2 -3
-1 -11 -7 -17z m-359 -58 c24 -33 69 -86 98 -118 l54 -57 144 -5 c93 -3 146
-9 148 -16 3 -8 -65 -11 -239 -10 -134 1 -257 -3 -274 -7 -24 -6 -36 -4 -48 8
-25 25 -21 49 7 40 38 -11 163 -18 204 -10 l38 7 -30 25 c-106 90 -165 153
-165 176 0 4 6 5 13 1 8 -5 8 -2 -2 9 -7 9 -9 17 -3 17 5 0 30 -27 55 -60z
m307 -3 c0 -2 -15 -16 -32 -33 -27 -24 -29 -25 -13 -4 24 30 45 47 45 37z
m965 -101 c-18 -28 -45 -25 -45 5 0 14 7 19 25 19 14 0 25 6 26 13 0 9 2 9 5
0 3 -6 -2 -23 -11 -37z m-2278 5 c77 -48 107 -164 64 -248 -12 -23 -24 -54
-25 -69 -2 -18 -11 -31 -27 -37 -26 -9 -289 1 -289 12 0 11 105 32 108 21 6
-16 125 -12 148 4 26 20 17 25 -36 17 -25 -4 -70 -3 -100 1 -47 6 -61 13 -92
46 -53 57 -59 101 -23 170 41 77 82 102 170 102 52 0 78 -5 102 -19z m2362
-83 c-2 -65 0 -72 19 -79 12 -5 22 -5 23 -1 0 4 1 39 2 77 l2 70 36 3 c46 4
85 -27 99 -78 13 -49 4 -89 -24 -100 -21 -9 -21 -9 2 -9 32 -1 29 -31 -4 -31
l-27 0 7 -72 c3 -40 10 -95 15 -123 l8 -50 3 55 2 55 10 -54 c8 -41 7 -55 -3
-62 -7 -4 -14 -16 -16 -26 -5 -28 6 -65 18 -57 7 4 7 0 0 -12 -5 -11 -12 -27
-15 -36 -7 -24 -71 -25 -80 -2 -14 37 -5 40 47 19 14 -6 17 -2 17 28 0 44 -8
67 -25 67 -8 0 -11 -8 -8 -22 3 -18 2 -19 -5 -8 -5 8 -12 31 -16 50 -13 66
-21 71 -142 71 -60 0 -116 4 -124 9 -10 6 29 8 110 5 157 -7 147 -6 146 -23 0
-8 5 -17 12 -20 11 -3 13 19 10 116 -1 66 -6 124 -10 127 -4 4 -33 10 -65 14
l-58 6 2 60 c3 73 10 105 24 105 6 0 9 -27 8 -72z m-534 -19 c11 -33 -3 -68
-35 -84 -28 -15 -30 -14 -65 16 -40 36 -51 85 -15 74 11 -3 20 -2 20 4 0 5 -8
11 -17 14 -14 3 -9 8 17 20 32 14 36 14 62 -4 15 -11 30 -29 33 -40z m432 39
c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z m-1699 -14 c23 -16 30
-58 12 -69 -6 -3 -17 1 -26 9 -27 27 -52 37 -57 23 -3 -6 -6 3 -6 21 -1 29 2
32 27 32 15 0 38 -7 50 -16z m1360 -15 c6 -32 -117 -187 -192 -241 -23 -16
-52 -28 -70 -28 -30 0 -28 2 21 28 68 35 176 131 197 175 9 19 16 47 16 62 0
28 23 31 28 4z m339 -66 c-2 -16 -4 -3 -4 27 0 30 2 43 4 28 2 -16 2 -40 0
-55z m-1697 -4 c12 -7 11 -9 -5 -10 -11 -1 -23 -1 -27 0 -5 0 -8 -3 -8 -8 0
-6 15 -7 34 -4 29 4 34 2 39 -18 11 -42 8 -86 -8 -99 -19 -16 -66 -16 -95 0
-23 13 -23 44 0 46 8 1 22 2 30 3 9 1 1 10 -17 21 -32 19 -42 43 -24 54 5 4
12 0 15 -6 3 -7 3 0 -1 15 -5 27 -4 28 23 21 16 -4 36 -10 44 -15z m1795 -61
c88 -19 83 -22 -40 -28 -66 -4 -127 -9 -135 -13 -9 -4 -30 -30 -48 -57 -52
-80 -70 -63 -27 24 13 27 22 53 20 57 -7 10 16 26 45 32 32 6 120 -1 185 -15z
m-1646 -32 c21 -22 22 -27 9 -53 -7 -15 -21 -29 -31 -31 -22 -4 -47 15 -47 37
0 12 5 10 19 -8 10 -13 23 -21 30 -17 16 10 14 46 -4 46 -9 0 -15 9 -15 25 0
31 10 32 39 1z m879 2 c18 -18 14 -46 -8 -60 -18 -11 -20 -24 -20 -103 0 -49
4 -116 10 -148 11 -69 -1 -110 -37 -126 -14 -6 -27 -10 -30 -8 -7 8 9 35 23
41 9 3 12 1 9 -4 -3 -6 -1 -10 4 -10 13 0 13 3 5 24 -3 9 -13 16 -22 16 -14 0
-14 1 0 13 13 10 17 39 20 155 3 78 1 142 -4 142 -14 0 -40 49 -34 65 7 18 67
20 84 3z m-1344 -37 c10 -11 15 -25 11 -32 -6 -8 -13 -5 -26 12 -31 40 -18 56
15 20z m316 -102 c0 -5 -4 -9 -10 -9 -5 0 -10 7 -10 16 0 8 5 12 10 9 6 -3 10
-10 10 -16z m-301 -194 c-1 -96 -5 -175 -9 -175 -7 0 -20 202 -20 303 0 36 4
47 16 47 13 0 15 -22 13 -175z m1791 71 c0 -41 4 -77 9 -80 5 -3 25 -7 45 -8
23 -2 36 -8 36 -17 0 -11 3 -11 17 0 15 12 16 12 10 -4 -4 -11 -3 -16 3 -12
12 8 90 -15 90 -27 0 -4 3 -7 8 -6 4 0 15 -2 26 -7 63 -28 188 -209 172 -251
-3 -9 -1 -12 4 -9 13 8 27 -31 34 -97 5 -42 1 -70 -18 -125 -13 -39 -31 -82
-40 -95 -9 -14 -14 -27 -11 -30 3 -2 -7 -18 -23 -36 -15 -17 -34 -40 -42 -51
-22 -32 -30 -25 -24 22 5 38 5 40 -9 23 -10 -14 -12 -28 -6 -49 7 -26 5 -33
-19 -54 -15 -13 -45 -28 -67 -34 -22 -6 -46 -16 -52 -21 -7 -6 -13 -7 -13 -3
0 4 -7 2 -15 -5 -12 -10 -15 -10 -15 1 0 11 -2 11 -9 1 -4 -7 -19 -14 -32 -14
-46 -3 -48 -10 -49 -194 0 -169 0 -174 20 -174 11 0 29 6 40 12 15 10 25 10
38 2 16 -10 17 -4 20 68 1 48 -1 77 -7 74 -10 -7 -9 19 1 30 4 3 4 12 2 19
-10 24 13 25 39 1 18 -16 22 -26 14 -29 -7 -3 -4 -6 6 -6 10 -1 17 -7 14 -13
-2 -7 -15 -12 -30 -10 -22 3 -25 0 -23 -21 2 -13 5 -28 9 -33 3 -5 2 -29 -3
-52 -6 -34 -5 -42 6 -38 14 6 19 -7 29 -76 4 -29 2 -48 -3 -48 -6 0 -8 8 -5
18 7 29 -19 45 -51 31 -24 -11 -30 -21 -27 -41 0 -5 -11 -8 -27 -8 -31 0 -59
21 -92 69 -19 27 -21 37 -12 52 16 26 16 146 0 152 -10 4 -10 7 0 15 9 6 12
33 10 93 -3 74 -5 84 -21 81 -9 -2 -20 4 -23 13 -3 8 -12 15 -19 15 -7 0 -18
12 -23 28 -9 22 -11 23 -11 6 -1 -28 -11 -36 -29 -22 -15 13 -18 14 -59 16
-15 1 -23 9 -23 20 0 13 -2 14 -9 4 -7 -12 -14 -11 -41 3 -18 9 -44 29 -57 43
-19 21 -23 22 -19 8 6 -16 4 -17 -10 -5 -11 9 -13 14 -4 17 7 3 -4 20 -26 43
-21 22 -34 39 -29 39 6 0 4 4 -3 9 -7 4 -14 24 -15 43 -1 20 -6 33 -11 30 -5
-3 -7 5 -4 16 4 12 3 20 -1 17 -5 -2 -14 15 -21 38 -7 23 -17 45 -24 49 -8 6
-7 8 2 8 7 0 11 4 7 10 -8 13 5 61 15 55 5 -3 6 4 3 14 -9 35 42 175 60 164 6
-3 7 -1 3 5 -10 16 22 74 36 66 7 -4 8 -3 4 5 -11 17 14 43 33 36 8 -3 12 -3
8 1 -9 9 13 35 24 28 5 -3 9 -1 9 5 0 6 20 22 45 37 62 36 145 67 145 53 0 -6
7 -3 16 5 8 9 29 16 46 16 l31 0 -7 48 c-12 89 -11 102 9 102 12 0 15 -15 15
-74z m344 -26 c5 -57 4 -82 -3 -75 -6 6 -13 48 -17 95 -4 57 -3 82 3 75 6 -5
13 -48 17 -95z m-2314 76 c0 -3 20 -69 45 -147 25 -78 43 -145 40 -147 -8 -8
-9 -5 -63 151 -40 113 -48 147 -37 147 8 0 15 -2 15 -4z m340 -42 c0 -19 -4
-33 -8 -30 -5 3 -21 -34 -36 -82 -39 -120 -46 -136 -52 -129 -9 9 79 286 88
281 5 -3 8 -21 8 -40z m1910 37 c0 -5 -13 -9 -30 -9 -16 1 -30 5 -30 10 0 4
14 8 30 8 17 0 30 -4 30 -9z m-1842 -172 c-33 -67 -57 -127 -54 -135 3 -8 0
-11 -10 -7 -18 7 -18 2 11 69 17 39 22 61 16 72 -8 14 -10 13 -16 -9 -4 -15
-18 -48 -31 -75 -23 -46 -24 -47 -18 -14 7 39 35 98 88 186 42 68 47 65 11 -6
-14 -27 -25 -60 -25 -72 0 -36 60 79 60 116 1 28 2 29 14 14 11 -15 5 -34 -46
-139z m-484 44 c20 -26 40 -53 44 -59 13 -15 32 -51 32 -60 0 -4 -7 1 -15 12
-23 30 -19 -5 5 -41 22 -34 25 -45 10 -45 -11 0 -140 262 -140 283 0 7 6 0 14
-15 8 -15 30 -49 50 -75z m2283 65 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4
-12 1 -19z m-2301 -224 l65 -81 52 26 c45 22 65 26 147 26 82 0 103 -4 151
-26 31 -15 68 -39 83 -55 39 -40 85 -142 92 -200 7 -57 -16 -160 -46 -212 -24
-41 -24 -42 -2 -42 10 0 45 -19 77 -42 32 -23 55 -36 51 -29 -6 10 -4 10 12 0
12 -7 18 -18 15 -24 -4 -5 -3 -7 2 -3 4 4 15 2 23 -5 13 -10 15 -9 9 6 -9 24
10 21 38 -7 14 -14 35 -27 47 -29 20 -4 19 -4 -4 -6 -23 -1 -28 -6 -28 -26 0
-41 -26 -41 -68 -2 -20 20 -73 66 -116 102 l-80 65 -21 -20 -21 -20 109 -111
c97 -99 108 -113 102 -137 -3 -15 -11 -28 -16 -30 -14 -5 -11 -32 4 -33 6 0 1
-5 -12 -10 -30 -12 -39 -4 -22 23 11 18 7 28 -32 87 -24 36 -57 81 -73 100
-88 103 -77 95 -110 78 -53 -27 -156 -49 -202 -43 -63 8 -150 54 -198 102 -48
50 -88 158 -88 239 0 55 38 150 84 212 l27 36 -25 31 c-14 17 -70 74 -124 126
-87 85 -96 96 -80 107 15 10 24 5 66 -40 26 -29 77 -88 112 -133z m690 172 c8
-8 14 -17 14 -20 0 -3 -26 -33 -57 -66 -31 -33 -63 -71 -71 -83 -21 -32 -75
-87 -84 -87 -18 0 -6 29 32 81 23 30 45 55 50 57 4 2 27 32 50 68 23 35 44 64
47 64 2 0 11 -6 19 -14z m1081 -73 c-3 -10 -5 -2 -5 17 0 19 2 27 5 18 2 -10
2 -26 0 -35z m-977 -60 c0 -5 -30 -28 -65 -52 -36 -24 -63 -47 -60 -51 3 -4
-3 -14 -12 -21 -12 -10 -14 -10 -9 -1 14 23 -10 12 -53 -24 -51 -44 -69 -37
-19 7 37 34 198 146 211 148 4 1 7 -2 7 -6z m-882 -108 c42 -33 100 -97 72
-80 -8 5 -49 32 -90 61 -69 47 -132 84 -144 84 -3 0 -3 -7 0 -15 4 -8 3 -15 0
-15 -13 0 -24 45 -14 57 10 13 103 -35 176 -92z m1049 43 c-3 -8 -6 -5 -6 6
-1 11 2 17 5 13 3 -3 4 -12 1 -19z m-123 -17 c12 -19 -55 -71 -161 -125 -74
-37 -93 -43 -93 -27 0 5 33 25 72 46 80 41 158 94 158 107 0 11 17 10 24 -1z
m-1110 -37 c79 -24 106 -36 106 -45 0 -4 17 -17 38 -29 36 -20 72 -60 54 -60
-4 0 -30 14 -56 30 -26 17 -88 51 -137 75 -49 25 -89 48 -89 51 0 3 8 3 17 0
9 -4 40 -14 67 -22z m1566 -55 c0 -21 -4 -39 -10 -39 -5 0 -10 21 -10 46 0 27
4 43 10 39 6 -3 10 -24 10 -46z m-3423 -81 c-2 -24 -4 -5 -4 42 0 47 2 66 4
43 2 -24 2 -62 0 -85z m7000 -30 c-2 -24 -4 -5 -4 42 0 47 2 66 4 43 2 -24 2
-62 0 -85z m-5162 98 c11 -7 31 -17 45 -21 14 -4 53 -24 88 -44 62 -35 62 -36
58 -75 -3 -21 -9 -42 -14 -45 -6 -3 -67 -5 -137 -3 -92 2 -125 6 -122 15 2 8
44 14 126 17 122 5 123 5 102 24 -12 11 -21 16 -21 12 0 -3 -23 5 -51 20 -28
14 -49 28 -46 30 3 3 23 -4 46 -16 23 -11 41 -17 41 -12 0 4 -34 24 -75 45
-44 21 -75 43 -75 52 0 19 10 19 35 1z m5072 -68 c-2 -13 -4 -3 -4 22 0 25 2
35 4 23 2 -13 2 -33 0 -45z m-3978 -22 c-12 -12 -34 -22 -48 -22 -14 -1 -52
-6 -83 -11 -44 -8 -58 -7 -58 2 0 7 19 15 44 18 57 8 130 33 134 47 3 7 9 7
18 -1 13 -11 12 -15 -7 -33z m-2276 -116 c67 -8 131 -13 142 -12 32 4 58 3 93
-3 l32 -6 0 -217 c0 -119 -3 -247 -7 -284 l-6 -68 -54 0 c-89 0 -96 8 -89 98
3 43 8 161 12 263 l6 186 -32 12 c-46 16 -68 14 -73 -6 -4 -14 -5 -12 -6 5 -1
21 -5 22 -75 22 -41 0 -76 3 -78 8 -2 4 -1 41 2 82 l5 75 3 -71 3 -70 122 -14z
m2874 108 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z m-2380 -10
c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z m5054 -101 c-18 -18 -19
-5 -7 53 l11 55 3 -49 c2 -27 -1 -53 -7 -59z m-54 6 c-7 -6 -47 52 -47 67 0 7
11 -4 25 -25 15 -20 24 -39 22 -42z m-5160 20 c-3 -10 -5 -2 -5 17 0 19 2 27
5 18 2 -10 2 -26 0 -35z m5323 1 c0 -8 -7 -14 -15 -14 -15 0 -21 21 -9 33 10
9 24 -2 24 -19z m169 10 c2 -2 -14 -4 -37 -4 -23 0 -42 5 -42 10 0 10 67 4 79
-6z m-6482 -86 c-2 -18 -4 -6 -4 27 0 33 2 48 4 33 2 -15 2 -42 0 -60z m1150
5 c-2 -16 -4 -3 -4 27 0 30 2 43 4 28 2 -16 2 -40 0 -55z m4800 35 c-3 -7 -5
-2 -5 12 0 14 2 19 5 13 2 -7 2 -19 0 -25z m-4616 -128 c6 0 7 -4 4 -10 -7
-11 -45 -5 -127 20 l-57 18 -4 -32 c-4 -30 -4 -29 -5 6 l-2 37 -57 6 c-105 12
-109 14 -102 60 l6 40 2 -36 1 -37 81 -11 c44 -7 99 -20 122 -30 23 -10 59
-21 80 -25 l37 -7 2 78 2 78 3 -77 c2 -44 8 -78 14 -78z m4679 140 c0 -13 -51
-59 -65 -59 -5 0 2 11 18 24 15 13 27 29 27 35 0 5 5 10 10 10 6 0 10 -5 10
-10z m-3990 -8 c0 -5 -7 -9 -15 -9 -8 0 -15 4 -15 9 0 4 7 8 15 8 8 0 15 -4
15 -8z m3880 -35 c0 -5 -7 -4 -15 3 -8 7 -15 20 -15 29 1 13 3 13 15 -3 8 -11
15 -24 15 -29z m177 11 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z
m661 0 c26 -22 12 -31 -37 -25 -47 6 -51 4 -80 -29 -38 -42 -40 -81 -7 -117
33 -35 70 -43 102 -22 30 19 28 49 -4 53 -37 5 -27 32 12 32 36 0 46 -12 46
-56 0 -41 -33 -64 -94 -64 -45 0 -59 4 -84 28 -59 55 -54 112 14 180 41 41 46
44 81 37 21 -4 44 -11 51 -17z m-3828 -8 c0 -5 8 -10 18 -10 9 0 24 -5 32 -11
11 -7 0 -8 -39 -5 -29 3 -59 10 -66 16 -6 5 -14 7 -17 4 -3 -3 -8 -1 -11 3 -3
5 14 10 39 12 25 1 44 -2 44 -9z m-93 -49 c30 5 74 -3 87 -17 9 -8 16 -11 16
-5 0 6 7 11 16 11 9 0 14 -6 11 -13 -3 -7 4 -19 15 -26 24 -15 15 -27 -27 -35
-30 -6 -81 12 -74 27 2 4 -25 21 -61 38 -77 36 -74 34 -66 55 5 14 10 13 41
-10 19 -14 38 -26 42 -25z m3678 37 c2 -7 6 -55 8 -106 5 -110 -7 -128 -52
-71 -14 18 -42 49 -61 69 l-35 35 -5 -74 c-3 -48 -10 -76 -18 -79 -10 -3 -12
21 -11 107 2 70 7 111 13 111 6 0 39 -29 73 -66 l63 -65 0 75 c0 46 4 76 10
76 6 0 12 -6 15 -12z m-4485 -6 c-1 -26 -32 -38 -147 -56 -7 -1 -16 -5 -19 -9
-13 -13 -54 -7 -54 7 0 19 71 47 87 35 7 -6 12 -6 15 1 5 17 118 38 118 22z
m-1300 -102 c16 0 32 -5 36 -12 5 -8 -4 -9 -34 -4 l-42 6 0 -75 c0 -81 -4 -77
70 -88 14 -3 4 -5 -22 -6 -47 -1 -48 -2 -49 -33 l-2 -33 -4 30 c-2 17 -12 36
-21 43 -15 11 -14 12 1 12 14 0 17 10 17 53 0 30 3 90 8 133 7 75 7 76 10 27
3 -51 4 -53 32 -53z m5451 -18 c0 -61 -2 -112 -5 -112 -20 1 -41 20 -89 80
l-54 68 -5 -74 c-3 -41 -10 -80 -17 -87 -18 -18 -15 183 3 208 13 18 17 17 62
-34 27 -30 54 -61 61 -70 10 -13 12 -3 13 55 0 39 3 74 7 78 18 18 24 -9 24
-112z m89 4 c0 -110 -12 -156 -26 -101 -9 35 6 215 17 215 5 0 9 -51 9 -114z
m-340 54 c27 -27 25 -59 -6 -91 l-25 -26 21 -40 c11 -22 18 -48 14 -57 -9 -22
-26 -7 -49 43 -31 69 -74 62 -76 -13 -1 -34 -2 -37 -8 -16 -4 14 -7 32 -5 40
1 8 3 48 3 88 1 66 3 74 24 82 39 15 86 11 107 -10z m-6103 -87 c-2 -21 -4 -6
-4 32 0 39 2 55 4 38 2 -18 2 -50 0 -70z m1760 35 c-2 -13 -4 -3 -4 22 0 25 2
35 4 23 2 -13 2 -33 0 -45z m1520 30 c-3 -7 -5 -2 -5 12 0 14 2 19 5 13 2 -7
2 -19 0 -25z m-1148 6 c8 9 22 16 33 16 18 0 19 -2 7 -16 -7 -9 -24 -20 -37
-25 -13 -5 -26 -18 -29 -29 -3 -11 -9 -17 -14 -14 -5 3 -9 0 -9 -6 0 -6 -4 -9
-9 -5 -5 3 -16 -2 -24 -10 -16 -15 -47 -21 -47 -8 0 3 8 15 18 26 16 19 16 20
0 14 -25 -9 -30 8 -9 27 16 15 23 15 41 6 24 -13 40 -1 40 29 0 11 3 10 13 -3
12 -16 14 -16 26 -2z m99 -34 c-12 -11 -27 -20 -33 -20 -5 0 -23 -12 -40 -26
-16 -14 -25 -23 -18 -20 7 4 11 -1 10 -13 -1 -11 -3 -18 -6 -16 -2 3 -10 0
-17 -6 -8 -7 -14 -7 -19 1 -3 5 -1 10 6 10 7 0 9 3 6 6 -4 4 -21 -7 -39 -25
-30 -29 -58 -41 -58 -23 0 7 46 51 123 117 9 8 23 15 30 16 6 0 26 8 42 18 36
22 46 8 13 -19z m739 34 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z
m2903 -61 c17 -32 33 -76 37 -98 l6 -40 -19 22 c-23 27 -97 46 -113 30 -6 -6
-11 -19 -11 -28 0 -9 -9 -19 -20 -22 -30 -8 -25 19 15 74 19 27 35 58 35 70 0
27 19 61 30 54 5 -3 23 -31 40 -62z m-2864 39 c-5 -14 7 -23 53 -43 58 -26 99
-68 86 -89 -5 -8 -13 -6 -25 5 -11 10 -24 14 -31 9 -7 -4 -10 -3 -6 3 10 16
-21 39 -113 83 -67 32 -77 40 -50 36 19 -2 44 -8 54 -12 13 -5 17 -4 13 3 -6
9 2 17 21 22 2 1 1 -7 -2 -17z m2674 3 c0 -11 -12 -15 -49 -15 -54 0 -63 -6
-55 -37 5 -18 12 -20 50 -15 39 4 44 2 44 -16 0 -16 -9 -21 -46 -27 -38 -5
-45 -10 -42 -27 2 -16 12 -21 42 -24 43 -4 51 -8 41 -23 -9 -15 -80 -14 -93 2
-6 6 -12 50 -13 97 l-4 85 30 5 c67 12 95 11 95 -5z m-4075 -10 c41 -18 7 -19
-36 0 -23 10 -28 14 -14 14 11 0 34 -6 50 -14z m3809 -85 l7 -80 39 0 c36 0
60 -14 47 -27 -11 -10 -90 -23 -108 -18 -17 6 -19 17 -19 106 0 77 3 99 14 99
10 0 15 -22 20 -80z m-4234 60 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10
11 10 2 0 4 -4 4 -10z m1075 -9 c-6 -11 -63 -41 -77 -41 -4 0 -8 5 -8 11 0 5
5 7 10 4 6 -3 10 -1 10 5 0 6 3 9 8 6 4 -2 18 2 32 10 30 16 33 17 25 5z m82
-30 l33 -38 -68 -78 c-136 -158 -132 -150 -125 -207 5 -37 3 -49 -5 -44 -7 4
-12 18 -12 32 0 13 -9 32 -20 41 -11 10 -20 21 -20 26 0 10 88 105 170 183 47
45 52 54 41 68 -7 9 -17 16 -22 16 -17 0 -125 -86 -122 -97 2 -6 -2 -11 -9
-10 -34 1 -46 -5 -51 -23 -6 -22 -52 -44 -74 -35 -12 4 -10 11 7 32 30 38 101
94 111 87 5 -3 9 1 9 9 0 8 7 17 15 21 8 3 15 1 15 -4 0 -6 7 -7 18 -1 9 5 30
14 45 20 19 8 27 16 23 26 -9 25 7 15 41 -24z m1086 32 c-13 -2 -35 -2 -50 0
-16 2 -5 4 22 4 28 0 40 -2 28 -4z m165 0 c-10 -2 -28 -2 -40 0 -13 2 -5 4 17
4 22 1 32 -1 23 -4z m129 -40 c-3 -10 -5 -2 -5 17 0 19 2 27 5 18 2 -10 2 -26
0 -35z m193 7 c0 -22 -4 -40 -10 -40 -5 0 -10 6 -10 13 0 9 -3 8 -9 -2 -7 -10
-13 -11 -30 -2 -25 14 -26 20 -5 49 8 12 26 22 40 22 21 0 24 -4 24 -40z
m-1500 -68 c0 -5 -14 -45 -30 -91 -17 -46 -29 -90 -28 -99 2 -10 -3 -16 -9
-14 -7 1 -14 -2 -14 -8 -1 -5 -2 -13 -3 -17 -1 -8 -28 -75 -31 -81 -1 -1 -10
0 -19 4 -19 7 -22 34 -3 34 14 0 84 139 99 197 5 21 9 48 9 61 -1 13 5 22 14
22 8 0 15 -4 15 -8z m873 -66 c1 -36 -1 -66 -5 -66 -5 0 -8 32 -8 72 0 89 10
84 13 -6z m-846 36 c-10 -10 -17 -27 -18 -38 0 -12 -3 -14 -6 -6 -6 16 16 62
30 62 6 0 3 -8 -6 -18z m322 -34 c13 -24 41 -77 63 -118 22 -41 44 -79 49 -84
13 -15 11 -56 -3 -56 -17 0 -49 51 -77 123 -16 39 -28 56 -37 53 -11 -4 -11
-2 -2 14 10 15 9 26 -7 57 -11 21 -21 41 -23 46 -2 4 0 7 5 7 5 0 20 -19 32
-42z m-1340 13 c-94 -7 -277 -2 -262 7 6 4 85 5 174 3 133 -4 150 -6 88 -10z
m1073 0 c-15 -9 -71 -182 -65 -198 3 -8 -1 -21 -10 -31 -8 -9 -17 -26 -18 -36
-4 -21 -29 -35 -29 -16 0 7 17 60 39 119 21 58 41 122 45 142 5 31 10 36 27
32 11 -3 16 -9 11 -12z m4282 9 c41 -15 30 -30 -22 -30 -48 0 -72 -12 -72 -37
0 -8 29 -27 65 -43 50 -22 65 -34 65 -50 0 -29 -27 -77 -49 -90 -46 -24 -131
-1 -131 36 0 13 4 13 30 -1 40 -21 83 -19 104 4 31 34 16 54 -62 85 -62 24
-72 32 -72 53 0 14 13 37 29 54 31 31 68 37 115 19z m-4424 -15 c-7 -9 -15
-13 -19 -10 -3 3 1 10 9 15 21 14 24 12 10 -5z m336 7 c-8 -14 16 -82 29 -82
7 0 12 -18 12 -46 0 -25 4 -49 9 -52 5 -4 10 -29 12 -55 3 -42 1 -48 -15 -45
-17 3 -33 66 -58 231 -5 29 -10 37 -28 38 -21 1 -20 1 3 9 34 11 42 11 36 2z
m3384 -59 c0 -8 -4 -12 -9 -9 -5 3 -22 3 -39 0 l-30 -6 -7 -99 c-3 -54 -11
-99 -16 -99 -5 0 -9 42 -9 94 l0 95 -32 3 c-40 4 -46 32 -8 36 77 8 90 13 90
34 0 21 2 20 30 -7 17 -16 30 -35 30 -42z m-2117 50 c-7 -2 -19 -2 -25 0 -7 3
-2 5 12 5 14 0 19 -2 13 -5z m144 -40 c-3 -10 -5 -2 -5 17 0 19 2 27 5 18 2
-10 2 -26 0 -35z m2432 38 c10 -6 26 -28 36 -50 17 -38 17 -42 1 -66 -9 -14
-20 -25 -24 -25 -4 0 -13 -4 -20 -9 -11 -6 -8 -16 12 -46 14 -21 26 -44 26
-51 0 -25 -29 -3 -60 46 -28 44 -47 60 -71 60 -5 0 -9 -25 -9 -55 0 -67 -15
-72 -24 -9 -8 61 -8 199 1 207 10 10 112 8 132 -2z m-1919 -11 c0 -5 -2 -10
-4 -10 -3 0 -8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m1675 -12 c78 -68
29 -228 -69 -228 -90 0 -133 110 -79 201 31 52 103 65 148 27z m-4948 -80 c-2
-18 -4 -4 -4 32 0 36 2 50 4 33 2 -18 2 -48 0 -65z m170 10 c-2 -18 -4 -6 -4
27 0 33 2 48 4 33 2 -15 2 -42 0 -60z m3373 67 c0 -8 -4 -15 -10 -15 -5 0 -10
7 -10 15 0 8 5 15 10 15 6 0 10 -7 10 -15z m941 -115 c-8 -77 -12 -87 -40
-112 -38 -34 -80 -36 -108 -5 -28 29 -45 207 -20 207 19 0 28 -37 22 -92 -3
-23 -2 -56 3 -73 8 -27 13 -30 43 -27 54 4 66 23 71 111 5 83 15 114 29 89 4
-8 4 -52 0 -98z m-222 81 c19 -12 -17 -31 -58 -31 l-31 0 0 -100 c0 -60 -4
-100 -10 -100 -5 0 -11 14 -11 30 -1 17 -3 35 -4 40 -1 6 -3 35 -4 65 -1 53
-2 55 -28 55 -16 0 -35 5 -43 10 -13 9 -12 12 4 25 22 17 161 21 185 6z
m-3075 -28 c-3 -16 -12 -51 -20 -80 -8 -28 -14 -62 -14 -75 0 -27 -8 -40 -20
-33 -4 3 -2 26 5 52 8 27 19 74 25 106 6 31 16 57 21 57 5 0 7 -12 3 -27z
m-224 -7 c0 -3 -4 -8 -10 -11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0 10 -2 10
-4z m1787 -43 c-3 -10 -5 -2 -5 17 0 19 2 27 5 18 2 -10 2 -26 0 -35z m-1210
21 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z m-607 -24 c0 -5 -2
-10 -4 -10 -3 0 -8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m2355 -20 c20
0 28 -19 15 -34 -8 -11 -8 -15 2 -18 10 -4 10 -8 -1 -22 -12 -14 -12 -16 3
-10 12 5 16 0 16 -19 0 -20 -4 -24 -20 -20 -18 5 -19 1 -13 -112 4 -87 3 -116
-6 -111 -7 5 -11 46 -11 119 -1 76 -5 120 -15 137 -9 17 -10 29 -3 37 5 7 10
29 11 50 0 21 2 30 4 21 3 -10 11 -18 18 -18z m-1545 -40 c-20 -13 -53 -13
-45 0 3 6 18 10 33 10 21 0 24 -2 12 -10z m-990 -19 c17 -33 11 -65 -15 -85
-14 -11 -24 -25 -21 -31 3 -8 -4 -10 -21 -7 -14 3 -28 13 -30 23 -3 11 -10 16
-17 12 -6 -4 -5 1 3 10 7 9 11 23 8 30 -6 15 11 39 38 55 29 16 43 15 55 -7z
m-1900 -118 c-3 -87 -5 -83 51 -83 47 0 50 -2 47 -22 -3 -20 -8 -23 -40 -20
-34 3 -38 1 -38 -21 0 -20 4 -23 24 -20 17 4 27 -1 35 -15 13 -25 6 -32 -36
-32 -27 0 -33 -4 -33 -21 0 -18 4 -20 43 -14 38 6 43 5 43 -14 0 -17 -9 -21
-54 -27 -29 -3 -56 -3 -60 1 -8 7 -4 314 4 327 11 18 15 6 14 -39z m167 -10
c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z m4340 0 c-3 -10 -5 -4
-5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z m-2380 -25 c-3 -8 -6 -5 -6 6 -1 11 2
17 5 13 3 -3 4 -12 1 -19z m4633 -36 c0 -5 -134 -14 -297 -21 -164 -6 -325
-14 -358 -16 -285 -22 -705 -33 -950 -24 l-40 1 35 8 c33 8 261 17 1005 40
176 6 347 12 380 13 136 7 225 7 225 -1z m-4560 -12 c0 -5 -2 -10 -4 -10 -3 0
-8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m-1957 -30 c18 -29 37 -40 37
-20 0 19 44 50 71 50 31 0 41 -17 30 -56 -5 -19 -1 -38 10 -62 36 -69 -15
-113 -95 -82 -40 15 -31 29 22 32 51 3 63 22 27 42 -11 6 -34 21 -52 34 l-32
22 -15 -27 c-12 -24 -12 -32 0 -53 16 -30 18 -60 4 -60 -6 0 -20 16 -31 35
-27 45 -59 48 -59 5 0 -23 -4 -30 -20 -30 -19 0 -20 7 -20 100 l0 100 53 0
c48 0 54 -3 70 -30z m2284 24 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2
13 -5z m-3434 -38 c10 -12 23 -30 29 -41 11 -19 10 -19 -9 -2 -11 9 -23 14
-26 10 -4 -3 -7 -2 -7 4 0 6 -7 14 -16 17 -12 5 -15 2 -10 -11 5 -12 4 -15 -3
-8 -9 10 -14 30 -12 52 1 17 32 5 54 -21z m2737 24 c0 -5 -9 -10 -20 -10 -11
0 -20 5 -20 10 0 6 9 10 20 10 11 0 20 -4 20 -10z m-2800 -54 c0 -3 -4 -8 -10
-11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0 10 -2 10 -4z m5490 0 c0 -3 -4 -8
-10 -11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0 10 -2 10 -4z m-5529 -53 c-12
-20 -14 -14 -5 12 4 9 9 14 11 11 3 -2 0 -13 -6 -23z m7722 -47 c20 -5 27 -12
27 -31 0 -13 -8 -29 -18 -34 -31 -16 -120 -25 -135 -13 -9 8 -105 9 -328 3
-173 -4 -325 -8 -339 -8 -14 0 -165 -3 -336 -8 -270 -7 -312 -6 -316 7 -8 19
11 49 19 31 7 -19 26 -16 19 3 -5 13 -1 15 19 12 14 -3 25 -2 25 3 0 4 8 8 18
9 99 4 697 20 957 25 181 3 331 8 333 10 2 2 9 2 15 0 7 -2 24 -6 40 -9z
m-1463 -82 c0 -8 -4 -12 -10 -9 -5 3 -10 13 -10 21 0 8 5 12 10 9 6 -3 10 -13
10 -21z m-6290 6 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4
-4 4 -10z m90 6 c0 -3 -4 -8 -10 -11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0
10 -2 10 -4z m1340 -6 c0 -5 -9 -10 -21 -10 -11 0 -17 5 -14 10 3 6 13 10 21
10 8 0 14 -4 14 -10z m75 0 c-3 -5 -11 -10 -16 -10 -6 0 -7 5 -4 10 3 6 11 10
16 10 6 0 7 -4 4 -10z m4735 -21 c0 -6 -4 -7 -10 -4 -5 3 -10 11 -10 16 0 6 5
7 10 4 6 -3 10 -11 10 -16z m-6187 -34 c-3 -9 -8 -14 -10 -11 -3 3 -2 9 2 15
9 16 15 13 8 -4z m7695 -41 c23 -16 28 -48 13 -73 -6 -9 -23 -13 -48 -12 -117
7 -227 8 -603 9 -228 1 -498 -3 -600 -7 -180 -7 -185 -7 -202 13 l-17 21 6
-22 c5 -20 1 -23 -25 -23 -35 0 -55 20 -50 52 2 19 9 23 32 21 17 -1 36 3 44
10 12 9 168 12 649 13 348 1 636 4 640 8 13 13 138 6 161 -10z m-7718 -1 c-1
-18 -18 -35 -24 -24 -4 6 -4 16 -1 21 7 12 25 13 25 3z m0 -63 c0 -5 -2 -10
-4 -10 -3 0 -8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m6820 -90 c41 -5
81 -5 90 0 9 5 57 5 111 0 77 -8 480 -11 669 -6 44 1 45 0 54 -36 15 -62 -1
-71 -104 -63 -47 4 -209 9 -360 12 -290 4 -288 4 -335 1 -16 -1 -100 2 -185 7
-85 4 -245 9 -354 9 -181 1 -200 3 -210 19 -18 30 35 65 104 69 91 5 439 -3
520 -12z m747 -482 c-2 -13 -4 -3 -4 22 0 25 2 35 4 23 2 -13 2 -33 0 -45z"/>
<path d="M4780 8218 c-18 -40 -34 -78 -36 -83 -3 -7 21 -10 61 -10 41 0 64 4
61 11 -2 5 -12 39 -21 75 -10 35 -21 68 -25 72 -4 4 -22 -25 -40 -65z"/>
<path d="M3753 7649 l-32 -69 64 0 64 0 -30 67 c-17 37 -31 68 -32 69 -1 1
-16 -30 -34 -67z"/>
<path d="M4453 7645 l-31 -75 64 0 63 0 -9 28 c-12 41 -22 64 -40 95 l-17 28
-30 -76z"/>
<path d="M4760 7628 c0 -62 4 -119 9 -127 6 -10 20 -11 52 -6 85 14 129 51
129 107 0 84 -53 138 -136 138 l-54 0 0 -112z"/>
<path d="M3611 7154 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M5493 7150 c11 -28 10 -33 -7 -46 -11 -7 -16 -17 -13 -21 10 -10 36
28 37 53 0 12 -6 27 -14 34 -13 10 -13 7 -3 -20z"/>
<path d="M5770 6595 c0 -14 -5 -25 -11 -25 -5 0 -8 4 -5 8 2 4 1 14 -5 22 -5
8 -9 10 -9 4 0 -5 -10 -10 -22 -10 -13 0 -47 -5 -75 -13 -42 -10 -53 -17 -53
-33 0 -16 -2 -17 -13 -6 -8 7 -17 20 -21 28 -3 9 -5 6 -2 -7 3 -15 -4 -27 -20
-37 -21 -15 -24 -14 -34 2 -11 16 -11 16 -6 0 3 -11 -2 -22 -15 -29 -12 -6
-18 -17 -15 -25 4 -11 2 -12 -13 -5 -18 10 -20 6 -22 -42 0 -9 -4 -15 -10 -12
-5 4 -9 -3 -9 -13 0 -16 -5 -19 -22 -14 l-23 5 20 -22 c12 -14 19 -34 17 -49
-2 -21 6 -12 36 36 54 86 73 104 150 143 60 31 74 34 151 34 78 0 93 -4 161
-36 77 -36 107 -65 160 -153 33 -55 39 -163 14 -267 -10 -42 -22 -75 -27 -72
-5 3 -6 -5 -2 -18 4 -17 3 -20 -3 -10 -8 11 -11 11 -18 -1 -17 -28 -133 -116
-168 -128 -37 -12 -43 -24 -26 -50 7 -11 10 -11 10 -2 0 8 5 10 13 6 9 -6 9
-5 0 7 -11 14 -8 16 18 14 21 -1 28 2 25 12 -3 8 2 13 15 13 11 0 18 4 15 8
-2 4 4 9 15 10 44 4 49 6 49 17 0 6 15 25 33 43 26 25 36 29 45 20 9 -9 12 -7
12 11 0 12 4 19 10 16 6 -3 10 0 10 8 0 8 7 18 16 21 8 3 12 11 8 17 -4 7 1
18 11 25 15 11 16 16 5 29 -10 12 -10 18 0 30 9 11 10 19 3 26 -5 5 -8 23 -5
39 4 28 12 34 37 31 6 -1 2 5 -7 12 -21 16 -25 52 -5 41 10 -6 10 -4 0 7 -7 7
-13 22 -13 32 0 20 -50 120 -62 125 -5 2 -8 9 -8 16 0 18 -38 50 -88 75 -23
12 -40 26 -37 31 6 10 -13 15 -47 12 -12 -1 -15 3 -11 16 6 14 4 15 -9 4 -10
-8 -17 -9 -20 -3 -1 6 -21 12 -43 14 -30 3 -39 8 -37 21 2 9 -2 16 -8 16 -5 0
-10 -11 -10 -25z m-200 -65 c0 -5 -10 -15 -22 -21 -23 -12 -23 -12 -4 10 21
23 26 26 26 11z m-60 -34 c0 -2 -8 -10 -17 -17 -16 -13 -17 -12 -4 4 13 16 21
21 21 13z m-52 -81 c-11 -20 -23 -34 -25 -31 -5 5 35 66 42 66 3 0 -5 -16 -17
-35z m601 -3 c-5 -2 -6 -9 -3 -14 4 -7 2 -8 -4 -4 -7 4 -12 14 -12 22 0 8 -4
14 -10 14 -5 0 -10 5 -10 10 0 6 11 3 24 -7 13 -10 20 -20 15 -21z"/>
<path d="M5805 6610 c-3 -6 1 -7 9 -4 18 7 21 14 7 14 -6 0 -13 -4 -16 -10z"/>
<path d="M5402 6485 c0 -16 2 -22 5 -12 2 9 2 23 0 30 -3 6 -5 -1 -5 -18z"/>
<path d="M5657 6482 c-60 -22 -148 -98 -184 -160 -25 -42 -28 -56 -27 -132 1
-102 29 -174 90 -232 145 -139 353 -105 479 78 40 57 40 59 40 148 -1 82 -4
97 -32 151 -38 74 -62 96 -137 131 -75 34 -163 40 -229 16z m165 -45 c29 -13
59 -31 67 -40 7 -9 18 -14 24 -10 5 3 7 1 3 -5 -6 -10 10 -26 26 -27 3 0 10
-4 15 -9 5 -5 3 -6 -4 -2 -17 9 -16 6 2 -32 9 -17 16 -55 16 -84 1 -74 -12
-188 -21 -188 -4 0 -13 -15 -20 -32 -18 -44 -39 -68 -62 -68 -10 0 -18 -5 -18
-11 0 -5 -4 -8 -10 -4 -5 3 -7 12 -3 21 3 8 8 13 10 10 6 -5 63 54 63 65 0 14
-36 15 -74 2 -50 -17 -167 -17 -190 0 -15 11 -7 12 53 4 49 -7 78 -7 94 1 22
11 -3 14 -151 17 -26 0 -49 7 -60 19 -16 17 -16 17 12 10 l29 -7 -7 119 c-4
65 -9 128 -11 139 -6 25 58 69 88 61 10 -2 16 -2 13 1 -3 4 -1 12 5 20 35 42
-101 -19 -145 -65 -27 -29 -28 -34 -29 -139 0 -64 4 -117 11 -130 6 -11 33
-33 59 -48 42 -24 59 -28 131 -28 57 1 82 -3 79 -11 -2 -6 -16 -12 -30 -14
-16 -2 -25 -8 -21 -14 15 -23 -147 12 -177 39 -9 7 -22 13 -29 11 -7 -2 -24
17 -38 42 -22 38 -27 61 -30 140 -3 87 -2 98 20 129 33 48 86 88 154 116 74
31 91 31 156 2z m196 -255 c2 -41 0 -77 -6 -88 -9 -15 -11 -3 -12 56 0 41 -3
86 -6 100 -5 20 -4 23 6 13 7 -6 15 -43 18 -81z"/>
<path d="M5780 6402 c0 -4 18 -15 40 -25 32 -15 42 -26 50 -57 10 -37 6 -130
-10 -217 l-7 -43 43 0 44 0 1 63 c2 159 -5 189 -53 234 -24 23 -108 58 -108
45z"/>
<path d="M5779 6334 c-1 -5 -1 -12 0 -16 0 -4 3 -24 5 -45 3 -21 10 -39 16
-41 8 -3 7 -8 -1 -18 -8 -10 -9 -18 0 -27 13 -16 5 -27 -20 -27 -13 0 -22 13
-30 43 -6 23 -13 46 -16 50 -3 5 5 11 17 14 16 4 20 11 16 27 -3 11 -6 25 -6
30 0 12 -89 -1 -106 -15 -10 -8 -14 -42 -14 -124 0 -129 -3 -125 100 -125 82
0 84 4 88 117 2 54 8 102 13 108 13 13 11 45 -3 45 -7 0 -23 3 -35 6 -13 4
-24 2 -24 -2z m26 -239 c6 -2 -14 -4 -43 -4 -29 -1 -51 3 -48 7 4 7 67 5 91
-3z"/>
<path d="M5392 6420 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M5365 6343 c0 -14 6 -28 14 -31 10 -3 12 0 8 12 -4 9 -1 16 5 16 7 0
6 5 -2 15 -18 22 -26 18 -25 -12z"/>
<path d="M5356 6285 c4 -8 1 -15 -6 -15 -6 0 -9 -4 -6 -9 3 -4 1 -22 -4 -39
-5 -19 -5 -34 0 -37 5 -3 8 -19 6 -36 -2 -17 2 -35 8 -42 7 -7 15 -20 19 -29
3 -10 11 -18 16 -18 5 0 8 -8 7 -17 -4 -26 29 -108 43 -105 6 1 14 -6 18 -15
9 -27 51 -61 84 -68 16 -4 29 -11 29 -15 0 -5 6 -7 14 -4 8 3 26 -2 40 -11 14
-9 29 -16 33 -15 4 0 10 -12 12 -27 4 -28 4 -28 10 -4 10 39 31 38 31 -1 0
-24 5 -35 15 -35 17 0 20 14 4 19 -7 2 -5 13 4 31 15 28 27 26 27 -4 0 -15 4
-17 23 -10 12 5 22 17 22 27 0 16 -10 20 -68 26 -132 13 -261 97 -314 207 -25
50 -28 67 -28 154 0 86 -2 95 -12 70 l-12 -28 -1 33 c0 17 -4 32 -10 32 -5 0
-7 -7 -4 -15z"/>
<path d="M5330 6010 c-13 -8 -12 -10 3 -10 9 0 17 5 17 10 0 12 -1 12 -20 0z"/>
<path d="M5350 5980 c-8 -5 -10 -10 -5 -10 6 0 17 5 25 10 8 5 11 10 5 10 -5
0 -17 -5 -25 -10z"/>
<path d="M5355 5950 c-8 -13 5 -13 25 0 13 8 13 10 -2 10 -9 0 -20 -4 -23 -10z"/>
<path d="M5390 5906 c0 -2 8 -10 18 -17 15 -13 16 -12 3 4 -13 16 -21 21 -21
13z"/>
<path d="M6021 5864 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M3878 6427 c-61 -20 -126 -73 -167 -136 -44 -69 -55 -118 -41 -189
21 -115 67 -180 154 -221 87 -42 137 -47 216 -22 147 47 215 138 215 286 0 70
-4 87 -30 134 -38 69 -72 103 -131 131 -55 27 -162 35 -216 17z m197 -43 c57
-29 94 -63 87 -83 -3 -8 0 -11 5 -8 5 3 18 -8 29 -26 15 -25 19 -50 18 -117 0
-47 -3 -100 -7 -118 -13 -67 -115 -143 -212 -158 -58 -8 -159 25 -212 71 -48
41 -72 95 -80 180 -5 53 -2 70 22 123 29 64 84 124 133 144 81 32 139 30 217
-8z"/>
<path d="M4440 5989 c0 -5 9 -9 20 -9 11 0 20 2 20 4 0 2 -9 6 -20 9 -11 3
-20 1 -20 -4z"/>
<path d="M7370 5964 c0 -36 0 -37 36 -31 43 7 64 23 64 48 0 16 -8 19 -50 19
l-50 0 0 -36z"/>
<path d="M7200 5916 c0 -29 12 -39 34 -30 14 5 14 8 -1 30 -20 31 -33 31 -33
0z"/>
<path d="M7812 5748 c-7 -7 -12 -28 -12 -48 l0 -37 43 1 c50 2 67 11 67 34 0
49 -66 82 -98 50z"/>
<path d="M7555 5717 c-17 -14 -28 -36 -32 -63 -4 -33 -1 -45 22 -72 33 -40 55
-40 97 -3 27 24 33 36 32 70 -3 84 -62 118 -119 68z"/>
<path d="M3403 5500 c2 -8 12 -16 23 -17 13 -2 15 -1 4 4 -8 3 -19 11 -23 17
-6 7 -7 6 -4 -4z"/>
<path d="M1737 5313 c-4 -3 -7 -17 -7 -30 0 -16 6 -23 19 -23 24 0 45 25 37
45 -5 15 -37 21 -49 8z"/>
<path d="M1885 5311 c-3 -6 1 -13 9 -16 9 -3 23 -7 32 -10 11 -3 14 0 12 13
-4 19 -43 29 -53 13z"/>
<path d="M7513 10227 c-10 -18 -61 -81 -90 -114 -13 -13 -23 -27 -23 -31 0 -5
-15 -23 -34 -42 -19 -19 -32 -38 -30 -41 2 -3 -16 -29 -39 -56 -68 -83 -191
-243 -207 -271 -8 -15 -18 -29 -21 -32 -6 -5 -253 -332 -264 -350 -3 -5 0 -12
7 -16 7 -4 10 -4 7 0 -3 3 11 26 33 49 21 23 71 89 110 147 40 58 95 134 123
170 29 36 84 110 124 165 69 96 139 188 265 350 32 41 56 78 53 81 -3 3 -9 -1
-14 -9z"/>
<path d="M8761 10038 c0 -112 4 -212 9 -223 5 -12 9 69 9 203 1 142 -3 222 -9
222 -6 0 -10 -74 -9 -202z"/>
<path d="M9190 9606 c0 -576 -1 -634 -16 -640 -13 -5 -15 -15 -10 -48 4 -23 9
-44 11 -46 2 -2 17 6 34 19 33 25 42 65 16 75 -13 5 -15 86 -15 640 0 416 -3
634 -10 634 -7 0 -10 -218 -10 -634z"/>
<path d="M9430 9943 c-1 -551 -12 -956 -27 -971 -32 -32 -5 -76 44 -70 36 4
43 40 13 65 l-21 18 7 628 c5 467 4 627 -5 627 -8 0 -11 -81 -11 -297z"/>
<path d="M9621 9898 c1 -189 5 -332 9 -318 12 40 12 660 0 660 -7 0 -10 -114
-9 -342z"/>
<path d="M9830 9908 c0 -297 -5 -388 -25 -506 -4 -23 -3 -32 4 -27 18 11 42
-81 46 -181 2 -53 8 -62 45 -56 21 3 32 11 36 26 7 28 -13 116 -32 137 -7 8
-21 46 -30 82 -11 45 -22 67 -32 67 -10 0 -12 6 -7 18 13 31 19 772 6 772 -8
0 -11 -90 -11 -332z"/>
<path d="M10078 9843 c-1 -219 0 -409 1 -423 17 -188 13 -223 -22 -218 -17 2
-23 11 -25 36 -4 40 -22 43 -22 3 0 -47 10 -61 41 -61 l29 0 0 -93 c0 -55 -5
-98 -11 -104 -16 -16 -2 -33 27 -33 26 0 28 3 15 28 -4 9 -11 59 -14 110 l-6
92 46 0 45 0 -4 64 c-3 52 -10 74 -38 118 l-35 53 -3 413 c-2 251 -7 412 -13
412 -5 0 -10 -155 -11 -397z"/>
<path d="M6056 10184 c-9 -26 -16 -55 -15 -63 0 -9 9 11 20 44 22 71 18 86 -5
19z"/>
<path d="M4000 10206 c0 -40 165 -764 225 -991 15 -55 37 -145 50 -200 13 -55
23 -93 24 -85 1 23 -34 199 -73 360 -33 138 -67 285 -171 730 -44 186 -55 224
-55 186z"/>
<path d="M3701 10200 c-2 -33 134 -473 268 -870 105 -310 110 -324 116 -318 7
6 0 26 -304 958 -44 135 -80 238 -80 230z"/>
<path d="M5171 10110 c-6 -56 -11 -120 -11 -143 0 -23 -4 -60 -9 -82 -5 -22
-6 -60 -2 -85 4 -33 11 13 26 183 20 228 18 314 -4 127z"/>
<path d="M3386 10180 c7 -25 98 -264 133 -350 11 -25 56 -133 101 -240 46
-107 109 -258 142 -335 82 -195 141 -325 145 -322 8 9 -42 132 -257 636 -76
180 -164 389 -195 466 -58 142 -82 193 -69 145z"/>
<path d="M4581 10175 c-2 -56 19 -420 30 -516 8 -72 8 -103 -1 -120 -11 -23
-10 -23 4 -5 20 25 20 74 0 324 -19 244 -31 356 -33 317z"/>
<path d="M7810 10113 c-35 -38 -74 -86 -88 -108 -14 -22 -46 -62 -72 -90 -26
-27 -53 -60 -61 -72 -8 -11 -44 -54 -79 -94 -71 -79 -252 -281 -309 -343 -36
-39 -36 -39 -5 -18 17 12 55 49 85 83 30 35 117 135 194 224 117 135 317 373
388 462 37 46 7 21 -53 -44z"/>
<path d="M2399 10090 c242 -342 355 -492 415 -555 19 -20 19 -20 1 10 -10 17
-57 80 -104 141 -47 61 -128 169 -179 240 -51 71 -109 147 -129 169 l-35 40
31 -45z"/>
<path d="M2779 10053 c26 -43 74 -118 106 -168 84 -130 114 -178 184 -292 35
-57 65 -103 67 -103 19 0 -74 155 -308 512 -91 139 -126 175 -49 51z"/>
<path d="M6026 10085 c-3 -9 -6 -22 -5 -28 0 -7 5 -1 10 12 5 13 8 26 5 28 -2
2 -6 -3 -10 -12z"/>
<path d="M6345 10069 c-4 -6 -5 -12 -2 -15 2 -3 7 2 10 11 7 17 1 20 -8 4z"/>
<path d="M5995 9993 c-10 -27 -29 -72 -42 -101 -13 -29 -42 -108 -64 -175 -54
-163 -88 -257 -103 -287 -19 -36 -167 -491 -164 -502 2 -5 27 58 56 139 29 81
96 267 148 413 121 334 195 552 191 557 -2 2 -12 -18 -22 -44z"/>
<path d="M6326 10025 c-9 -26 -7 -32 5 -12 6 10 9 21 6 23 -2 3 -7 -2 -11 -11z"/>
<path d="M6644 9995 c-4 -8 -10 -13 -14 -10 -4 3 -14 -10 -21 -28 -7 -17 -15
-34 -18 -37 -3 -3 -24 -39 -45 -80 -40 -76 -158 -295 -280 -517 -36 -66 -66
-126 -66 -132 0 -6 -4 -11 -8 -11 -4 0 -14 -16 -21 -35 -7 -19 -18 -41 -25
-48 -14 -14 -31 -57 -22 -57 2 0 11 12 19 28 8 15 39 68 69 117 88 146 162
280 333 610 48 94 95 180 103 193 8 12 11 22 8 22 -4 0 -9 -7 -12 -15z"/>
<path d="M6292 9945 c-17 -37 -14 -45 4 -12 9 16 14 31 11 33 -2 2 -9 -7 -15
-21z"/>
<path d="M2140 9946 c0 -2 8 -10 18 -17 15 -13 16 -12 3 4 -13 16 -21 21 -21
13z"/>
<path d="M2195 9876 c10 -14 19 -26 22 -26 7 0 -17 39 -28 46 -6 3 -3 -5 6
-20z"/>
<path d="M6265 9889 c-4 -6 -5 -12 -2 -15 2 -3 7 2 10 11 7 17 1 20 -8 4z"/>
<path d="M6225 9803 c-15 -32 -32 -68 -37 -80 -6 -13 -9 -25 -6 -28 2 -3 21
32 41 77 21 45 35 83 33 86 -3 2 -16 -22 -31 -55z"/>
<path d="M944 9723 c-2 -57 -2 -123 1 -718 1 -374 -1 -533 -5 -410 -4 110 -9
385 -10 610 -2 226 -5 400 -7 388 -2 -13 -13 -23 -25 -25 -15 -2 -26 -17 -38
-53 -10 -27 -35 -88 -58 -135 -79 -168 -105 -256 -105 -350 1 -101 37 -248 83
-340 45 -89 90 -236 95 -310 l4 -65 -9 57 c-5 32 -18 79 -29 105 -11 27 -34
85 -52 131 -17 46 -32 82 -34 80 -2 -2 21 -75 51 -163 29 -89 53 -178 53 -200
0 -50 -13 -24 -24 50 -9 61 -66 202 -110 270 -37 58 -141 156 -191 180 -45 21
-166 34 -222 23 -75 -14 -143 -57 -181 -115 -39 -60 -55 -64 -21 -6 l23 38
-40 -38 c-33 -31 -43 -50 -52 -95 -18 -88 -14 -179 9 -228 34 -69 192 -179
240 -167 15 4 17 10 9 36 -21 74 -6 173 33 215 26 27 77 56 85 48 3 -3 -5 -10
-19 -15 -13 -5 -39 -25 -56 -45 -24 -28 -32 -45 -31 -74 l1 -37 14 44 c7 24
19 50 26 58 21 25 86 53 125 53 44 0 129 -37 157 -68 10 -12 23 -19 29 -15 6
3 7 1 3 -5 -4 -6 3 -30 14 -52 11 -22 27 -66 34 -98 8 -31 15 -49 15 -40 2 28
-20 121 -35 151 -8 15 -12 27 -9 27 14 0 55 -109 55 -147 l0 -43 60 0 c35 0
60 4 60 10 0 7 6 7 19 0 11 -5 46 -10 79 -10 45 0 61 4 66 16 9 22 8 26 -5 18
-31 -19 46 277 116 448 66 160 78 216 72 333 -5 118 -25 184 -101 336 -30 58
-57 116 -60 130 -13 46 116 -191 141 -258 19 -55 23 -60 18 -28 -3 22 -22 72
-41 110 -20 39 -71 140 -114 225 -43 85 -84 163 -91 173 -13 16 -14 15 -15
-10z m-353 -1035 c74 -36 159 -101 159 -121 0 -6 -12 1 -27 15 -87 81 -222
133 -331 126 -54 -3 -86 -13 -164 -50 -93 -44 -98 -46 -97 -25 0 12 3 17 5 11
3 -7 25 -1 62 18 118 62 141 68 233 65 74 -3 95 -8 160 -39z m-103 -145 c-10
-2 -28 -2 -40 0 -13 2 -5 4 17 4 22 1 32 -1 23 -4z m55 -10 c-7 -2 -19 -2 -25
0 -7 3 -2 5 12 5 14 0 19 -2 13 -5z m77 -43 c0 -15 -5 -12 -26 11 -19 22 -19
22 4 10 12 -6 22 -16 22 -21z m36 -37 c-7 -7 -26 7 -26 19 0 6 6 6 15 -2 9 -7
13 -15 11 -17z m-439 -153 c14 -11 22 -20 17 -20 -12 1 -61 39 -51 40 5 0 20
-9 34 -20z"/>
<path d="M8776 9669 c-4 -44 -7 -336 -6 -648 1 -311 0 -586 -1 -611 -6 -86
-14 248 -17 680 -1 239 -6 451 -11 470 l-8 35 -26 -55 c-14 -30 -35 -71 -46
-90 -43 -73 -132 -289 -142 -346 -21 -109 -8 -193 55 -353 92 -233 108 -300
119 -476 l2 -40 70 -3 70 -3 1 78 c2 98 20 165 85 323 74 182 100 250 109 295
9 38 9 38 6 -15 -1 -38 -14 -82 -40 -140 -37 -82 -125 -324 -126 -345 0 -24
50 101 70 171 11 43 25 83 30 89 35 43 70 141 85 234 30 184 -2 305 -161 618
-58 115 -107 209 -109 211 -1 1 -6 -34 -9 -79z m122 -184 c-3 -3 -9 2 -12 12
-6 14 -5 15 5 6 7 -7 10 -15 7 -18z m56 -91 c14 -29 26 -57 26 -63 0 -7 7 -26
16 -43 30 -57 54 -166 53 -235 l-2 -68 -8 75 c-13 115 -27 165 -80 284 -27 60
-49 112 -49 115 0 12 21 -18 44 -65z"/>
<path d="M6166 9665 c-9 -26 -7 -32 5 -12 6 10 9 21 6 23 -2 3 -7 -2 -11 -11z"/>
<path d="M2390 9631 c0 -5 7 -12 16 -15 14 -5 15 -4 4 9 -14 17 -20 19 -20 6z"/>
<path d="M6139 9631 c-1 -6 -2 -17 -3 -23 -1 -7 -7 -19 -14 -26 -10 -12 -7
-40 4 -30 14 14 32 78 24 83 -6 3 -11 1 -11 -4z"/>
<path d="M2410 9597 c0 -2 14 -16 32 -33 l31 -29 -22 33 c-18 26 -41 42 -41
29z"/>
<path d="M7713 9553 c-39 -43 -43 -56 -7 -22 23 21 50 59 42 59 -2 0 -18 -17
-35 -37z"/>
<path d="M8260 9573 c0 -13 5 -23 10 -23 13 0 13 11 0 30 -8 12 -10 11 -10 -7z"/>
<path d="M6095 9530 c-4 -12 -28 -68 -55 -123 -63 -136 -106 -237 -114 -267
-3 -14 4 -5 15 20 154 319 179 374 170 383 -5 5 -12 1 -16 -13z"/>
<path d="M7634 9463 c-23 -31 -24 -34 -5 -18 22 19 46 55 38 55 -3 0 -17 -17
-33 -37z"/>
<path d="M9610 9449 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
-5 -10 -11z"/>
<path d="M9631 9394 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M9611 9389 c-1 -9 2 -18 5 -22 6 -6 6 -157 0 -307 -6 -154 -6 -172 8
-192 23 -32 39 1 32 64 -4 29 -9 138 -12 243 -3 104 -9 192 -13 195 -4 3 -11
12 -14 20 -5 13 -6 13 -6 -1z m26 -471 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3
-3 4 -12 1 -19z"/>
<path d="M7016 9289 c-80 -23 -191 -85 -241 -135 -61 -61 -115 -191 -115 -277
l0 -50 38 7 c20 3 48 6 62 6 19 0 21 3 12 12 -17 17 -15 34 6 54 9 10 18 22
18 28 1 6 2 17 3 24 1 15 38 16 43 1 3 -8 10 -5 21 6 27 27 32 11 14 -52 -20
-70 -28 -145 -16 -137 5 3 6 -1 4 -9 -3 -7 4 -24 16 -38 l22 -24 -7 45 c-6 42
6 106 32 170 8 21 11 14 18 -50 7 -70 8 -73 16 -37 11 54 32 81 86 110 37 20
61 25 115 25 49 0 70 -4 74 -14 3 -8 9 -11 14 -8 5 3 9 -1 9 -9 0 -8 10 -36
21 -62 15 -34 20 -61 16 -91 -2 -24 -2 -44 2 -44 3 0 4 -22 3 -49 -4 -55 13
-94 77 -180 23 -30 41 -63 41 -73 0 -10 4 -18 9 -18 13 0 100 79 112 102 9 17
8 19 -8 14 -13 -4 -26 1 -38 14 -10 11 -24 20 -31 20 -7 0 -19 8 -26 18 -7 9
-26 25 -43 34 -31 17 -48 56 -35 78 10 15 125 7 146 -11 8 -6 36 -13 63 -15
l48 -3 7 37 c3 20 6 56 6 80 0 33 -4 42 -17 42 -15 0 -16 2 -3 10 12 7 13 19
3 74 -31 182 -158 313 -358 369 -108 30 -148 31 -239 6z m404 -103 c0 -3 -4
-8 -10 -11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0 10 -2 10 -4z m-110 -278
c25 -52 30 -75 29 -133 0 -79 -17 -139 -19 -70 -3 138 -8 172 -28 212 -23 44
-26 53 -17 53 3 0 19 -28 35 -62z m198 -75 c-15 -2 -42 -2 -60 0 -18 2 -6 4
27 4 33 0 48 -2 33 -4z"/>
<path d="M3030 9239 c0 -76 9 -129 21 -129 5 0 9 28 9 63 l1 62 22 -25 c12
-14 39 -46 59 -70 24 -29 40 -41 46 -35 13 14 24 175 12 175 -5 0 -12 -32 -16
-72 l-7 -72 -41 49 c-23 28 -56 65 -73 85 l-32 35 -1 -66z"/>
<path d="M1956 9274 c-8 -20 -8 -69 0 -128 l7 -46 58 0 c32 0 61 5 64 10 4 6
-15 10 -49 10 l-56 0 0 85 c0 79 -10 107 -24 69z"/>
<path d="M2714 9268 c3 -13 6 -56 6 -95 0 -42 4 -73 10 -73 6 0 10 28 10 65 0
36 3 65 8 65 4 0 35 -30 68 -67 34 -38 64 -66 67 -63 10 9 10 180 1 182 -5 2
-11 -31 -14 -72 l-5 -74 -34 44 c-76 99 -131 140 -117 88z"/>
<path d="M2956 9283 c-3 -3 -6 -46 -6 -95 0 -67 3 -89 13 -85 8 2 12 31 13 91
0 82 -5 104 -20 89z"/>
<path d="M3291 9264 c-38 -32 -50 -84 -27 -119 25 -37 71 -58 116 -50 35 6 38
9 43 48 7 49 3 57 -28 57 -30 0 -41 -16 -15 -23 26 -7 26 -43 0 -57 -16 -9
-29 -7 -58 7 -30 15 -38 24 -40 51 -6 58 49 102 99 81 35 -14 46 -8 24 15 -25
25 -79 20 -114 -10z"/>
<path d="M2124 9264 c3 -9 6 -49 6 -90 l0 -74 65 0 c37 0 65 4 65 10 0 6 -25
10 -55 10 -54 0 -55 0 -55 30 0 29 2 30 45 30 25 0 45 5 45 10 0 6 -20 10 -44
10 -49 0 -61 9 -51 40 5 17 15 20 60 20 30 0 57 5 60 10 4 6 -22 10 -70 10
-66 0 -76 -2 -71 -16z"/>
<path d="M2366 9258 c-24 -38 -67 -149 -63 -161 2 -7 10 0 17 15 10 22 22 29
58 34 42 6 47 5 69 -22 12 -16 23 -23 23 -16 0 14 -78 172 -85 172 -2 0 -11
-10 -19 -22z m37 -55 c14 -36 14 -38 -5 -41 -29 -5 -39 10 -32 46 8 42 18 40
37 -5z"/>
<path d="M2520 9190 c0 -110 18 -121 22 -12 l3 77 35 3 c42 3 76 -18 67 -42
-5 -11 -19 -16 -52 -16 -48 0 -60 -15 -22 -29 13 -5 35 -23 50 -40 14 -17 30
-31 36 -31 17 0 13 9 -16 36 l-28 25 23 16 c25 17 31 70 10 91 -7 7 -38 12
-70 12 l-58 0 0 -90z"/>
<path d="M693 9224 c-7 -21 -14 -57 -17 -79 -4 -24 2 -12 14 30 11 39 18 74
17 79 -2 5 -8 -9 -14 -30z"/>
<path d="M1222 9095 c0 -27 3 -75 8 -105 l7 -55 1 55 c0 30 -3 78 -8 105 l-7
50 -1 -50z"/>
<path d="M3611 9101 c-1 -15 124 -270 140 -286 6 -5 1 10 -11 35 -84 175 -129
263 -129 251z"/>
<path d="M9763 9073 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z"/>
<path d="M9853 9073 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z"/>
<path d="M3410 9055 c0 -8 132 -228 143 -240 12 -12 -50 104 -100 188 -31 52
-43 66 -43 52z"/>
<path d="M9809 9056 c-7 -8 1 -696 9 -696 10 0 14 688 3 694 -4 3 -10 4 -12 2z"/>
<path d="M3218 8995 c11 -22 28 -49 37 -60 9 -11 5 3 -10 30 -34 61 -55 85
-27 30z"/>
<path d="M671 8994 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M4092 8980 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M5861 8984 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M681 8914 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M6054 8922 c-9 -6 -21 -32 -39 -87 -12 -37 13 -2 34 48 11 26 19 47
18 47 -1 0 -7 -4 -13 -8z"/>
<path d="M10088 8910 c-13 -49 -20 -158 -9 -164 13 -8 23 64 19 134 -3 41 -5
49 -10 30z"/>
<path d="M4111 8894 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M290 8890 c-24 -8 -23 -8 8 -9 20 -1 31 3 27 9 -3 6 -7 10 -8 9 -1
-1 -13 -5 -27 -9z"/>
<path d="M475 8875 c75 -17 92 -17 40 0 -22 8 -53 13 -70 13 -19 0 -7 -5 30
-13z"/>
<path d="M9385 8882 c30 -13 100 -23 89 -12 -5 4 -31 11 -59 14 -32 4 -43 3
-30 -2z"/>
<path d="M9258 8873 c12 -2 30 -2 40 0 9 3 -1 5 -23 4 -22 0 -30 -2 -17 -4z"/>
<path d="M691 8854 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M1409 8838 c-71 -25 -138 -74 -188 -137 -31 -39 -71 -121 -71 -146 0
-8 -16 -45 -35 -82 -19 -37 -45 -107 -59 -155 l-24 -88 78 0 78 0 6 35 c12 61
42 118 88 168 24 26 42 47 38 47 -10 0 -76 -72 -104 -115 -33 -50 -34 -39 -2
23 39 76 110 135 179 149 10 2 16 -1 12 -7 -3 -5 -12 -10 -19 -10 -7 0 -21 -7
-32 -16 -10 -8 -13 -12 -5 -8 8 4 42 10 75 14 l61 6 -35 11 -35 11 35 1 c52 1
130 -46 157 -94 31 -54 32 -198 2 -179 -5 3 -9 0 -9 -5 0 -15 20 -13 50 4 29
17 44 19 35 5 -3 -6 1 -7 9 -4 9 3 14 10 11 14 -3 5 -1 11 5 15 5 3 10 1 10
-5 0 -8 6 -7 21 1 14 7 18 14 10 18 -7 5 3 26 32 63 54 69 71 127 65 211 -7
78 -33 130 -93 186 -94 87 -222 112 -346 69z m116 -128 c14 -6 8 -7 -20 -4
-70 10 -231 -54 -302 -119 -19 -17 -23 -18 -23 -5 0 20 68 76 107 88 15 5 53
18 83 29 58 21 121 26 155 11z"/>
<path d="M8082 8842 c-72 -24 -114 -60 -163 -143 -35 -59 -42 -81 -47 -138 -4
-59 -1 -77 21 -124 13 -30 40 -72 59 -93 18 -22 40 -48 48 -59 14 -19 14 -19
-6 -5 -11 8 -7 2 9 -13 16 -16 35 -26 43 -23 8 3 13 2 10 -3 -8 -12 25 -24 35
-14 5 5 3 29 -4 53 -11 36 -11 55 -1 95 7 28 13 44 13 37 1 -8 16 6 34 29 17
23 49 51 71 62 34 18 45 19 90 10 63 -13 73 -8 15 7 -24 7 -61 9 -84 5 -31 -5
-37 -3 -28 6 6 6 34 14 61 17 132 12 262 -114 288 -279 l7 -40 56 3 56 3 -3
35 c-1 19 -10 67 -18 105 -14 61 -30 98 -81 190 -6 11 -19 43 -29 70 -22 62
-107 148 -189 189 -73 38 -182 45 -263 18z m260 -136 c71 -25 163 -74 155 -83
-3 -3 -25 6 -49 20 -51 30 -121 52 -204 67 -51 9 -70 8 -110 -6 -62 -21 -153
-83 -193 -131 -17 -21 -31 -34 -31 -30 0 21 30 75 54 94 21 19 124 72 186 97
26 10 121 -4 192 -28z m-210 -235 c-9 -16 -18 -28 -21 -26 -4 5 27 55 34 55 2
0 -4 -13 -13 -29z"/>
<path d="M9227 8840 c-100 -42 -164 -96 -225 -188 -31 -48 -57 -94 -57 -102 0
-8 -11 -34 -23 -58 -24 -44 -48 -129 -61 -213 l-8 -50 55 3 56 3 16 65 c23 89
40 119 104 178 65 59 109 76 181 70 42 -4 63 -12 104 -43 57 -44 69 -69 75
-163 5 -63 2 -60 -9 14 -3 17 -11 31 -18 31 -8 0 -12 -24 -12 -84 l0 -83 35 6
c88 16 196 99 236 182 21 43 34 199 15 188 -7 -4 -11 1 -11 13 0 10 -3 27 -7
37 -5 13 -3 15 8 9 8 -4 4 2 -8 14 -24 22 -31 37 -13 26 37 -23 -28 82 -70
114 l-35 26 37 -42 c56 -64 68 -95 16 -43 -71 71 -139 101 -245 106 -73 3 -96
1 -136 -16z m141 -125 c35 -8 80 -24 100 -36 20 -11 28 -17 17 -14 -173 58
-250 59 -367 3 -42 -20 -97 -55 -122 -78 -57 -53 -60 -45 -6 13 46 49 106 83
195 108 75 22 104 22 183 4z m281 -317 c-14 -29 -60 -78 -71 -78 -5 0 10 22
34 50 48 56 54 60 37 28z"/>
<path d="M2103 8812 c-15 -9 0 -37 15 -28 6 3 118 7 249 7 131 0 247 4 258 9
11 5 18 9 15 10 -26 6 -528 8 -537 2z"/>
<path d="M2700 8810 c0 -5 12 -10 26 -10 14 0 23 4 19 10 -3 6 -15 10 -26 10
-10 0 -19 -4 -19 -10z"/>
<path d="M2764 8811 c7 -11 76 -20 76 -10 0 3 -14 9 -31 13 -42 8 -51 8 -45
-3z"/>
<path d="M2857 8808 c-15 -9 -10 -10 115 -12 61 0 98 3 98 9 0 12 -195 14
-213 3z"/>
<path d="M3125 8800 c10 -11 20 -20 22 -20 2 0 -1 9 -7 20 -6 11 -16 20 -22
20 -6 0 -3 -9 7 -20z"/>
<path d="M6682 8815 c12 -13 -11 -45 -27 -39 -9 4 -15 0 -15 -9 0 -22 17 -30
24 -11 3 8 10 13 15 10 5 -3 11 6 14 19 2 14 -1 28 -7 32 -6 3 -8 3 -4 -2z"/>
<path d="M1181 8773 c-1 -12 -4 -23 -8 -25 -11 -4 -45 -97 -49 -133 -4 -28 -3
-28 5 -5 4 14 20 55 35 93 15 37 25 73 23 80 -3 6 -6 2 -6 -10z"/>
<path d="M640 8766 c0 -2 8 -10 18 -17 15 -13 16 -12 3 4 -13 16 -21 21 -21
13z"/>
<path d="M2095 8750 c-18 -19 -17 -20 3 -20 15 0 22 6 22 20 0 11 -2 20 -3 20
-2 0 -12 -9 -22 -20z"/>
<path d="M2499 8761 c-46 -15 -68 -31 -63 -46 8 -20 16 -19 42 5 12 11 25 20
29 19 21 -4 33 2 33 16 0 16 -3 17 -41 6z"/>
<path d="M2827 8758 c-6 -4 15 -7 48 -7 64 1 65 5 2 11 -20 2 -43 0 -50 -4z"/>
<path d="M3387 8735 c9 -19 18 -33 21 -31 4 5 -26 66 -33 66 -3 0 3 -16 12
-35z"/>
<path d="M2345 8749 c-4 -6 -5 -13 -2 -16 7 -7 27 6 27 18 0 12 -17 12 -25 -2z"/>
<path d="M2980 8750 c0 -12 47 -12 75 0 15 6 8 9 -27 9 -27 1 -48 -3 -48 -9z"/>
<path d="M2590 8740 l-25 -6 25 -7 c26 -7 34 -4 29 11 -2 4 -15 5 -29 2z"/>
<path d="M5592 8740 c-19 -4 -39 -13 -45 -20 -14 -14 15 -7 68 15 34 15 26 17
-23 5z"/>
<path d="M6555 8714 c-9 -15 -12 -23 -6 -20 11 7 35 46 28 46 -3 0 -12 -12
-22 -26z"/>
<path d="M10085 8711 c-7 -6 -13 -8 -44 -10 -27 -1 -81 -49 -80 -69 0 -13 3
-13 10 4 13 26 54 50 100 57 34 5 36 4 34 -24 -1 -17 3 -29 10 -29 22 0 63
-50 69 -83 8 -41 -10 -94 -34 -107 -25 -13 -106 -13 -131 1 -11 5 -33 28 -49
51 -17 23 -30 35 -30 27 0 -11 -2 -11 -11 1 -19 27 1 -32 23 -68 25 -40 76
-76 149 -102 63 -24 89 -25 114 -6 16 12 13 13 -32 9 -35 -4 -61 0 -87 12 -42
20 -39 35 10 35 42 0 76 31 103 91 11 25 21 36 24 27 3 -7 6 14 6 48 1 60 -4
73 -44 106 -22 19 -100 39 -110 29z"/>
<path d="M1857 8649 c4 -13 8 -18 11 -10 2 7 -1 18 -6 23 -8 8 -9 4 -5 -13z"/>
<path d="M6920 8637 c0 -14 -4 -29 -10 -32 -5 -3 -10 -11 -10 -17 0 -13 28 9
40 33 7 12 5 21 -5 29 -13 10 -15 8 -15 -13z"/>
<path d="M7200 8630 c-9 -6 -10 -10 -3 -10 6 0 15 5 18 10 8 12 4 12 -15 0z"/>
<path d="M10021 8604 c-12 -15 -21 -32 -21 -39 0 -7 9 -24 21 -39 16 -20 29
-26 60 -26 38 0 39 1 39 35 0 85 -56 123 -99 69z m79 -49 c0 -40 -2 -45 -23
-45 -30 0 -47 18 -47 50 0 34 7 40 42 40 27 0 28 -2 28 -45z"/>
<path d="M1873 8550 c0 -36 2 -50 4 -32 2 17 2 47 0 65 -2 17 -4 3 -4 -33z"/>
<path d="M3266 8597 c3 -10 9 -15 12 -12 3 3 0 11 -7 18 -10 9 -11 8 -5 -6z"/>
<path d="M2859 8580 c-71 -37 -111 -112 -95 -175 9 -36 65 -96 109 -115 21
-10 39 -21 39 -26 1 -5 8 -15 15 -22 11 -11 13 -10 13 6 0 11 -6 23 -12 25 -8
3 -4 6 7 7 37 4 40 5 62 21 33 23 73 99 73 140 0 44 -46 110 -93 132 -55 26
-80 28 -118 7z m108 -92 c16 -15 23 -32 22 -57 l-1 -36 -8 38 c-9 46 -18 57
-62 67 l-33 8 29 1 c18 1 39 -8 53 -21z m-87 9 c0 -2 -10 -12 -22 -23 l-23
-19 19 23 c18 21 26 27 26 19z m45 -83 c0 -19 -5 -29 -15 -29 -16 0 -25 28
-16 51 10 25 31 10 31 -22z m55 -28 c0 -2 -8 -10 -17 -17 -16 -13 -17 -12 -4
4 13 16 21 21 21 13z"/>
<path d="M1101 8574 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M7122 8497 l1 -72 7 65 c4 36 7 56 8 45 2 -15 4 -17 11 -7 4 8 11 13
15 13 39 -5 31 6 -13 19 l-31 9 2 -72z"/>
<path d="M6419 8543 c-13 -16 -12 -17 4 -4 16 13 21 21 13 21 -2 0 -10 -8 -17
-17z"/>
<path d="M6800 8540 c-14 -10 -21 -22 -16 -27 4 -4 15 1 25 13 9 11 23 23 31
27 13 5 13 5 0 6 -8 0 -26 -8 -40 -19z"/>
<path d="M8600 8545 c0 -5 5 -17 10 -25 5 -8 10 -10 10 -5 0 6 -5 17 -10 25
-5 8 -10 11 -10 5z"/>
<path d="M9155 8516 c-42 -19 -111 -93 -131 -141 -20 -48 -45 -138 -39 -143 2
-2 9 15 15 39 29 106 112 218 177 240 32 10 79 8 130 -6 10 -3 5 1 -12 9 -38
19 -101 19 -140 2z"/>
<path d="M1540 8483 c0 -6 5 -15 11 -19 18 -11 41 -75 49 -134 l7 -55 1 55 c0
30 -3 64 -6 76 -9 26 -62 93 -62 77z"/>
<path d="M2242 8457 c-6 -7 -17 -31 -24 -52 -8 -25 -26 -48 -47 -62 -37 -25
-36 -29 4 -11 14 6 25 15 25 20 0 4 7 8 15 8 8 0 17 14 21 38 4 20 11 45 16
55 10 20 5 22 -10 4z"/>
<path d="M2320 8444 c5 -16 11 -38 14 -49 2 -11 4 -3 3 18 -1 21 -7 43 -14 49
-10 8 -11 4 -3 -18z"/>
<path d="M8430 8432 c11 -15 29 -38 40 -52 l18 -25 -5 30 c-6 32 -26 57 -56
68 -16 6 -16 4 3 -21z"/>
<path d="M1840 8419 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
-5 -10 -11z"/>
<path d="M2282 8400 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M7335 8370 c-16 -11 -25 -20 -20 -20 10 0 64 39 55 40 -3 0 -18 -9
-35 -20z"/>
<path d="M6740 8360 c-6 -11 -8 -20 -6 -20 3 0 10 9 16 20 6 11 8 20 6 20 -3
0 -10 -9 -16 -20z"/>
<path d="M2352 8350 c13 -20 66 -36 90 -27 7 3 2 6 -12 6 -14 1 -40 10 -57 21
-33 20 -33 20 -21 0z"/>
<path d="M2013 8271 l2 -76 -48 -25 c-74 -39 -78 -91 -8 -110 22 -6 42 -18 45
-28 3 -10 -3 -48 -14 -86 -11 -38 -17 -72 -15 -76 3 -5 18 -13 34 -18 23 -8
34 -6 57 9 16 10 42 19 57 19 35 0 83 -45 93 -86 12 -53 32 -74 68 -74 41 0
52 12 71 78 26 87 93 117 146 66 27 -26 28 -26 53 -8 32 24 35 76 6 119 -11
17 -20 34 -20 38 0 4 25 19 55 33 35 15 59 33 64 47 11 29 5 34 -16 15 -10 -9
-36 -22 -57 -29 -49 -18 -82 -64 -60 -86 19 -19 18 -59 -1 -67 -8 -3 -29 -3
-45 0 -46 10 -81 -4 -122 -48 -21 -23 -38 -36 -38 -30 0 7 5 12 10 12 6 0 10
6 10 14 0 12 -58 32 -67 22 -2 -2 -1 -21 3 -42 6 -34 8 -36 15 -16 13 34 19
26 19 -24 0 -41 -2 -45 -22 -42 -22 3 -28 18 -42 98 -5 27 -14 40 -40 54 -35
19 -92 19 -89 0 1 -6 -8 -11 -20 -10 -16 1 -23 8 -25 28 -2 19 -10 28 -25 30
-13 2 -23 11 -25 23 -2 16 -1 17 7 5 18 -27 23 -2 6 34 -9 19 -27 38 -38 42
-48 14 -49 24 -8 71 38 42 40 48 43 122 2 55 0 78 -9 78 -8 0 -11 -23 -10 -76z"/>
<path d="M9790 8332 c-21 -17 -20 -17 10 -18 17 -1 33 -3 35 -6 5 -5 -24 -74
-48 -113 -6 -11 -18 -31 -27 -45 -8 -14 -13 -29 -12 -33 1 -5 -3 -5 -9 -1 -9
5 -10 2 -6 -10 4 -10 7 -20 7 -22 0 -3 5 -2 10 1 6 3 10 -3 10 -15 0 -28 17
-32 65 -16 22 8 42 13 44 10 10 -10 -115 -144 -132 -141 -6 1 -12 -4 -13 -10
-3 -26 -5 -28 -12 -15 -17 26 -61 -13 -69 -61 -3 -15 0 -16 20 -6 12 7 43 30
69 53 25 23 59 51 75 62 15 12 37 39 49 60 11 22 26 39 33 39 24 0 51 49 51
95 0 58 -28 117 -73 157 -20 18 -31 33 -24 36 6 2 1 6 -11 9 -13 4 -30 0 -42
-10z"/>
<path d="M2545 8321 c-21 -6 -28 -33 -29 -101 -1 -29 3 -36 22 -38 20 -3 22
-1 11 15 -9 16 -8 27 5 56 22 46 18 75 -9 68z"/>
<path d="M6704 8308 l-19 -23 23 19 c21 18 27 26 19 26 -2 0 -12 -10 -23 -22z"/>
<path d="M8399 8303 c-13 -16 -12 -17 4 -4 9 7 17 15 17 17 0 8 -8 3 -21 -13z"/>
<path d="M2210 8282 c-14 -13 -44 -39 -66 -58 -23 -19 -44 -46 -47 -60 -4 -23
6 -76 27 -139 4 -11 -2 -4 -13 15 -24 41 -25 39 -7 -14 10 -30 19 -40 39 -42
25 -2 25 -2 9 29 -24 47 -28 137 -7 162 16 19 16 19 12 -10 -5 -27 -4 -28 9
-10 8 10 14 29 14 42 0 18 10 29 43 43 60 28 99 25 139 -7 76 -63 89 -100 60
-165 -19 -43 -91 -118 -114 -118 -6 0 -9 -3 -5 -6 11 -11 95 45 123 81 16 21
28 53 31 78 9 88 -77 186 -167 190 -25 1 -47 4 -50 7 -3 3 -16 -5 -30 -18z"/>
<path d="M1650 8250 c-9 -6 -10 -10 -3 -10 6 0 15 5 18 10 8 12 4 12 -15 0z"/>
<path d="M10115 8229 c-10 -15 3 -25 16 -12 7 7 7 13 1 17 -6 3 -14 1 -17 -5z"/>
<path d="M660 8168 c0 -20 -3 -43 -6 -52 -6 -16 -1 -20 48 -30 34 -8 44 -40
27 -81 -7 -17 -11 -36 -10 -43 4 -26 -31 -52 -70 -52 -48 0 -100 43 -135 112
-13 26 -26 48 -29 48 -7 0 6 -62 17 -84 7 -13 7 -16 -1 -12 -6 4 -17 28 -25
54 l-14 47 -11 -28 c-6 -16 -11 -35 -11 -43 0 -8 -4 -14 -10 -14 -19 0 -10
-85 14 -137 18 -39 35 -58 70 -78 87 -51 213 -29 267 47 13 17 18 28 11 24
-17 -10 -15 2 7 32 25 37 58 129 62 177 l4 40 -42 6 c-103 13 -40 20 187 18
l245 -1 0 42 0 42 -298 1 -297 2 0 -37z m-2 -405 c-16 -2 -40 -2 -55 0 -16 2
-3 4 27 4 30 0 43 -2 28 -4z"/>
<path d="M2910 8173 c0 -73 23 -111 36 -60 7 30 -8 89 -24 95 -8 2 -12 -9 -12
-35z"/>
<path d="M8663 8203 l-203 -3 1 -53 c1 -28 3 -44 6 -34 2 9 8 15 12 13 4 -3
65 -6 134 -7 121 -1 163 -12 97 -26 -21 -4 -27 -9 -22 -17 12 -14 -55 -183
-85 -216 -23 -25 -33 -54 -11 -32 23 23 27 12 13 -29 -19 -52 -19 -73 0 -136
25 -83 154 -268 170 -243 3 6 3 15 0 20 -8 12 25 68 56 96 12 10 5 -5 -16 -34
-21 -29 -35 -55 -32 -58 7 -7 101 124 131 184 16 31 26 66 25 89 l-1 38 -8
-45 c-8 -44 -52 -134 -71 -146 -6 -3 1 16 15 44 38 74 43 135 16 202 -44 111
-51 135 -42 138 7 2 7 15 0 38 -14 51 -4 52 12 2 19 -65 49 -119 87 -159 19
-20 33 -42 31 -49 -8 -36 120 -54 188 -25 101 42 140 110 123 216 -18 113 -31
128 -49 57 -7 -24 -18 -53 -26 -66 -21 -32 -93 -82 -118 -81 -15 1 -12 3 10
10 38 11 114 82 114 106 0 15 -4 13 -20 -7 -16 -20 -19 -21 -13 -5 5 16 -1 13
-30 -12 -44 -38 -77 -49 -106 -34 -25 14 -66 67 -80 104 -10 26 -9 27 23 27
43 0 51 12 55 83 l3 57 -94 -2 c-51 -2 -184 -4 -295 -5z m184 -109 c-3 -3 -12
-4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z m50 0 c-3 -3 -12 -4 -19 -1 -8 3
-5 6 6 6 11 1 17 -2 13 -5z m-134 -146 c4 -66 6 -191 6 -277 -2 -133 -3 -145
-9 -81 -14 144 -23 480 -13 480 6 0 13 -53 16 -122z m517 -52 c0 -13 -9 -34
-21 -47 l-21 -24 16 25 c9 13 16 35 16 47 0 13 2 23 5 23 3 0 5 -11 5 -24z
m-243 -122 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z"/>
<path d="M9727 8153 c-4 -3 -7 -11 -7 -17 0 -6 5 -5 12 2 6 6 9 14 7 17 -3 3
-9 2 -12 -2z"/>
<path d="M7582 8114 c-22 -15 -22 -16 -5 -45 10 -16 21 -30 25 -30 4 -1 13 -3
18 -4 6 -1 13 -3 18 -4 4 -1 -1 -6 -11 -12 -9 -5 -24 -24 -33 -42 l-16 -32 31
35 c17 19 31 30 31 24 0 -6 -9 -21 -20 -34 -11 -12 -22 -31 -25 -41 -4 -11
-11 -19 -16 -19 -5 0 -9 -4 -9 -10 0 -20 21 -9 61 31 22 22 41 39 42 37 1 -1
11 -21 22 -43 15 -30 27 -41 48 -43 24 -3 38 11 19 20 -4 2 -15 27 -24 56 -13
42 -14 55 -4 65 17 16 36 53 36 67 0 6 -12 10 -27 8 -25 -3 -28 -7 -25 -36 3
-42 -14 -39 -38 6 -36 66 -56 76 -98 46z"/>
<path d="M9474 8114 c-31 -15 -74 -78 -74 -108 0 -25 35 -88 62 -113 13 -12
40 -29 60 -38 44 -18 51 -19 43 -5 -4 6 6 7 26 3 23 -4 30 -3 25 5 -4 7 -27
12 -50 12 -34 0 -53 8 -88 34 -47 36 -58 53 -58 89 0 35 39 103 66 115 56 26
97 7 119 -55 8 -21 14 -30 15 -20 0 26 -27 75 -49 87 -27 14 -61 12 -97 -6z"/>
<path d="M8105 8110 c-3 -6 1 -7 9 -4 18 7 21 14 7 14 -6 0 -13 -4 -16 -10z"/>
<path d="M9634 8100 c21 -91 27 -164 17 -187 -16 -34 -14 -41 5 -15 13 18 14
37 9 100 -4 42 -14 88 -22 102 l-14 25 5 -25z"/>
<path d="M885 8101 c-3 -2 -5 -27 -5 -55 -1 -72 -22 -162 -53 -223 -32 -62
-33 -91 -9 -171 19 -58 53 -115 109 -180 l28 -33 47 58 c57 72 118 188 118
226 0 15 -8 44 -19 65 -42 85 -72 177 -76 233 -4 71 8 69 25 -3 7 -29 19 -66
27 -81 8 -16 12 -35 9 -43 -3 -7 -2 -13 3 -11 5 1 26 -17 47 -40 22 -24 61
-51 89 -63 l50 -21 -45 6 c-43 5 -44 4 -20 -10 33 -19 134 -19 174 0 18 9 48
32 67 51 31 32 34 41 37 107 2 40 -1 83 -6 97 -7 18 -8 7 -4 -42 7 -96 -15
-149 -71 -178 l-42 -21 32 28 c57 51 78 119 64 216 -4 32 -13 63 -20 70 -10 9
-11 7 -6 -13 8 -32 -40 -126 -77 -154 -24 -17 -32 -18 -66 -8 -21 6 -49 23
-62 37 -12 13 -27 22 -32 19 -5 -3 -8 -2 -7 3 1 4 -7 30 -19 56 -12 27 -22 51
-22 53 0 2 25 4 55 4 30 0 55 4 55 8 0 4 -52 7 -117 6 -64 -1 -147 1 -185 5
-38 4 -71 5 -73 2z m62 -248 c-1 -43 -3 -10 -3 72 0 83 2 118 3 78 2 -40 2
-107 0 -150z"/>
<path d="M6990 8079 c0 -15 -5 -19 -16 -15 -8 3 -12 2 -9 -4 3 -6 1 -10 -4
-10 -6 0 -11 8 -11 18 -1 38 -30 -22 -30 -62 -1 -36 -2 -39 -14 -24 -7 10 -16
15 -19 11 -13 -12 -7 -51 9 -64 9 -7 14 -22 11 -35 -3 -16 0 -21 10 -17 9 4
13 25 13 73 0 48 4 71 15 80 13 11 15 10 9 -6 -5 -16 -2 -15 15 4 37 42 68 32
113 -35 25 -38 23 -65 -8 -98 -23 -25 -30 -27 -80 -22 -60 6 -69 -5 -24 -28
61 -32 107 -10 139 65 12 28 27 50 34 50 7 0 5 5 -4 10 -9 5 -27 28 -38 51
-26 50 -58 78 -88 79 -17 0 -23 -6 -23 -21z"/>
<path d="M40 8060 c-46 -39 -24 -39 25 0 21 17 32 30 24 30 -8 0 -30 -14 -49
-30z"/>
<path d="M8614 8083 l-41 -4 -21 -73 c-27 -92 -47 -111 -114 -108 -63 3 -77
14 -129 109 -22 40 -43 73 -46 73 -3 0 -3 -14 -1 -32 l5 -32 -18 22 c-17 22
-18 22 -24 -33 -17 -133 40 -221 156 -244 26 -5 34 -9 19 -10 -84 -3 -150 45
-179 134 -19 55 -20 57 -21 25 0 -120 156 -210 289 -165 47 15 81 48 67 63 -3
3 -6 1 -6 -4 0 -14 -49 -40 -90 -48 -42 -8 -29 7 20 23 20 6 57 33 83 59 38
39 52 64 77 137 31 91 36 116 23 113 -5 -1 -26 -3 -49 -5z m-314 -104 c15 -28
5 -23 -15 7 -9 15 -12 23 -6 20 6 -4 16 -16 21 -27z"/>
<path d="M6686 8065 c-11 -8 -17 -17 -14 -21 3 -3 -5 -17 -18 -31 -32 -35 -27
-54 34 -118 13 -14 27 -25 32 -25 19 0 18 17 -1 34 -12 10 -18 24 -15 33 5 11
2 14 -9 9 -9 -3 -13 -2 -10 4 3 6 11 10 16 10 11 0 39 25 39 34 0 3 -12 1 -26
-5 -33 -12 -45 -2 -20 16 13 10 17 22 14 40 -10 48 24 22 36 -28 5 -20 1 -35
-14 -54 -19 -25 -19 -27 -3 -45 16 -18 17 -18 42 6 23 24 24 27 11 67 -16 47
-46 89 -63 89 -7 0 -21 -7 -31 -15z"/>
<path d="M2912 8054 c-23 -16 -27 -53 -15 -136 4 -35 23 -55 23 -25 0 7 8 20
18 28 14 12 19 32 21 71 2 66 -13 86 -47 62z"/>
<path d="M9477 8052 c-10 -10 -17 -33 -17 -50 0 -38 43 -92 73 -92 19 0 18 3
-9 19 -62 38 -61 119 1 132 l30 7 -31 1 c-18 1 -38 -6 -47 -17z"/>
<path d="M7963 8004 c-37 -30 -98 -78 -135 -107 -37 -29 -67 -56 -67 -60 -1
-15 60 27 128 88 37 33 87 77 112 97 24 20 41 37 37 38 -4 0 -37 -25 -75 -56z"/>
<path d="M9575 8040 c10 -11 20 -20 23 -20 3 0 -3 9 -13 20 -10 11 -20 20 -23
20 -3 0 3 -9 13 -20z"/>
<path d="M9525 8010 c-4 -7 -1 -16 6 -21 17 -10 26 8 11 23 -6 6 -12 6 -17 -2z"/>
<path d="M1623 7998 c4 -10 2 -18 -3 -18 -17 0 11 -35 48 -61 20 -13 66 -52
102 -87 96 -92 96 -92 103 -92 3 0 17 -10 30 -22 43 -42 82 -70 122 -89 23
-10 44 -22 49 -26 4 -4 11 -8 15 -8 5 0 22 -15 39 -32 16 -18 34 -33 40 -33 5
0 12 -7 15 -15 8 -20 86 -75 106 -74 11 0 10 3 -5 9 -11 4 -28 19 -37 33 -9
14 -51 53 -94 88 -43 35 -82 68 -88 74 -5 6 -35 30 -65 52 -30 23 -64 50 -75
60 -16 15 -198 167 -289 242 -18 15 -19 15 -13 -1z"/>
<path d="M6947 7993 c-4 -3 -7 -29 -7 -56 l0 -50 45 6 c25 2 55 13 65 22 25
23 26 61 1 75 -22 11 -94 14 -104 3z"/>
<path d="M40 7980 c0 -5 12 -10 26 -10 14 0 23 4 19 10 -3 6 -15 10 -26 10
-10 0 -19 -4 -19 -10z"/>
<path d="M7985 7949 c-28 -22 -64 -53 -80 -67 -17 -15 -49 -40 -73 -56 -24
-16 -45 -33 -48 -38 -9 -14 11 -9 35 10 82 63 108 83 124 97 9 8 20 15 25 15
4 0 8 5 8 10 3 23 5 24 12 13 6 -9 18 -3 42 22 48 49 17 45 -45 -6z m55 27 c0
-2 -8 -10 -17 -17 -16 -13 -17 -12 -4 4 13 16 21 21 21 13z"/>
<path d="M9631 7983 c0 -7 -18 -32 -38 -55 -22 -24 -30 -37 -18 -31 35 19 67
60 62 80 -3 10 -5 12 -6 6z"/>
<path d="M1776 7932 c82 -75 154 -134 154 -125 0 5 -14 20 -30 33 -41 34 -108
90 -138 118 -14 12 -28 22 -31 22 -3 0 17 -22 45 -48z"/>
<path d="M291 7941 c-8 -17 -11 -34 -8 -38 8 -7 29 46 24 60 -2 6 -9 -4 -16
-22z"/>
<path d="M2148 7963 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M158 7934 c-31 -16 -37 -51 -12 -61 21 -8 69 40 61 61 -8 19 -14 19
-49 0z"/>
<path d="M46 7931 c-3 -4 6 -6 19 -3 14 2 25 6 25 8 0 8 -39 4 -44 -5z"/>
<path d="M8861 7914 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M1111 7833 c12 -24 27 -43 31 -43 10 0 -4 26 -33 60 -20 24 -20 23 2
-17z"/>
<path d="M9767 7858 c-9 -5 -17 -14 -17 -19 0 -14 52 -7 57 7 5 16 -20 24 -40
12z"/>
<path d="M8900 7843 c0 -13 29 -38 35 -31 3 3 -4 13 -15 23 -11 10 -20 13 -20
8z"/>
<path d="M7381 7831 c-9 -6 -10 -11 -2 -15 13 -8 31 1 31 15 0 11 -11 11 -29
0z"/>
<path d="M7215 7810 c-10 -11 -16 -22 -13 -25 3 -3 13 6 22 20 20 30 16 32 -9
5z"/>
<path d="M7397 7749 c-21 -17 -36 -34 -33 -37 3 -3 -1 -10 -10 -17 -15 -10
-14 -17 10 -63 14 -28 34 -56 44 -61 24 -13 60 6 101 51 26 28 30 30 31 13 1
-19 1 -19 11 -2 6 10 8 30 3 45 l-7 27 -7 -25 c-7 -22 -8 -21 -9 12 -1 30 -8
42 -34 62 -43 33 -54 33 -100 -5z m51 -11 c8 -10 4 -13 -15 -14 -29 -2 -34 -6
-37 -30 -2 -10 -9 -20 -16 -22 -19 -7 -3 48 18 65 22 16 37 16 50 1z m72 -20
c0 -6 -6 -5 -15 2 -8 7 -15 14 -15 16 0 2 7 1 15 -2 8 -4 15 -11 15 -16z m-90
-18 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4 -4 4 -10z m30
-15 c0 -8 -4 -15 -10 -15 -5 0 -10 7 -10 15 0 8 5 15 10 15 6 0 10 -7 10 -15z"/>
<path d="M772 7740 c0 -19 6 -53 13 -75 14 -39 14 -39 8 -5 -4 19 -10 53 -14
75 l-6 40 -1 -35z"/>
<path d="M9651 7757 c-1 -10 -5 -15 -11 -12 -16 10 -12 -41 5 -55 8 -7 15 -9
15 -5 0 4 6 2 13 -4 11 -8 13 -7 12 7 -3 28 -33 89 -34 69z"/>
<path d="M25 7730 c-17 -19 -17 -20 1 -20 10 0 30 9 44 20 l25 20 -26 0 c-14
0 -34 -9 -44 -20z"/>
<path d="M9680 7739 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
-5 -10 -11z"/>
<path d="M7052 7674 c-45 -36 -81 -69 -79 -73 2 -10 -55 -66 -64 -64 -3 1 -30
-23 -60 -54 -41 -43 -46 -51 -21 -33 19 12 36 29 39 36 3 8 8 12 12 9 4 -2 32
20 61 50 30 30 51 55 46 55 -5 0 -3 7 4 15 7 9 19 14 27 11 8 -3 12 -2 9 3 -8
12 31 44 44 36 6 -3 9 -3 8 2 -2 5 13 23 32 41 58 53 29 36 -58 -34z m-142
-148 c0 -2 -8 -10 -17 -17 -16 -13 -17 -12 -4 4 13 16 21 21 21 13z"/>
<path d="M2901 7712 c-1 -26 25 -40 42 -23 8 8 6 11 -10 11 -12 0 -24 8 -26
18 -4 12 -5 11 -6 -6z"/>
<path d="M7570 7710 c-9 -6 -10 -10 -3 -10 6 0 15 5 18 10 8 12 4 12 -15 0z"/>
<path d="M7662 7693 c-24 -24 -24 -25 -2 -8 42 33 44 35 37 35 -4 0 -19 -12
-35 -27z"/>
<path d="M1118 7654 c-9 -27 -15 -50 -13 -52 8 -8 36 60 33 79 -2 14 -8 5 -20
-27z"/>
<path d="M6730 7683 c-8 -2 -21 -6 -28 -9 -7 -2 -11 -8 -7 -14 7 -11 55 8 55
22 0 4 -1 8 -2 7 -2 0 -10 -3 -18 -6z"/>
<path d="M364 7615 c-28 -13 -59 -33 -68 -46 -18 -26 -22 -104 -6 -114 6 -4
10 14 10 45 0 43 3 51 16 46 9 -3 18 -6 20 -6 10 0 3 -29 -8 -33 -10 -3 -9
-12 4 -38 10 -19 19 -50 22 -69 2 -19 3 9 2 62 -2 93 -1 97 21 101 22 4 23 2
24 -72 2 -124 16 -152 18 -34 l1 102 36 -15 c62 -26 86 2 39 46 -14 13 -25 19
-25 14 0 -5 -4 -4 -8 1 -22 30 -47 32 -98 10z"/>
<path d="M10205 7613 c-11 -8 -67 -38 -125 -65 -58 -27 -158 -75 -222 -106
-116 -57 -117 -57 -123 -97 -3 -22 -5 -447 -3 -945 l3 -905 24 0 c34 0 60 69
60 162 1 40 6 75 12 79 11 6 231 45 235 41 1 -1 4 -78 5 -170 2 -119 6 -173
15 -185 11 -14 13 14 14 169 l0 186 67 14 c38 8 68 20 71 28 4 11 -3 13 -29 7
-19 -3 -51 -9 -72 -13 l-37 -6 2 374 3 374 65 21 c41 13 66 26 68 37 3 15 -1
15 -45 2 -26 -9 -58 -18 -70 -21 l-23 -6 0 440 0 441 28 18 c15 11 46 27 70
38 40 17 42 20 42 62 0 47 -5 51 -35 26z m-135 -592 c0 -333 -3 -442 -12 -447
-7 -4 -62 -22 -123 -39 l-110 -32 -3 411 c-3 474 -15 421 118 486 47 22 92 45
100 50 8 5 18 9 23 9 4 1 7 -197 7 -438z m0 -840 c0 -204 -4 -372 -8 -375 -4
-2 -50 -12 -102 -20 -52 -9 -105 -19 -118 -21 l-22 -5 2 357 3 357 110 36 c61
20 116 38 123 38 9 2 12 -78 12 -367z"/>
<path d="M800 7617 c0 -18 43 -90 83 -135 23 -27 47 -57 54 -68 6 -10 12 -14
12 -7 1 6 -20 35 -45 65 -25 29 -58 76 -74 103 -16 28 -30 46 -30 42z"/>
<path d="M2766 7583 c-62 -65 -65 -92 -11 -117 23 -11 62 -16 128 -16 52 0
119 -5 148 -11 85 -17 92 -16 108 13 21 36 2 78 -34 78 -19 0 -31 10 -46 35
-22 37 -43 45 -53 20 -3 -8 -16 -15 -30 -15 -13 0 -26 7 -30 15 -7 20 -36 19
-52 -2 -13 -17 -14 -17 -8 0 5 15 -1 17 -48 17 -39 0 -59 -5 -72 -17z"/>
<path d="M1085 7579 c-4 -6 -5 -12 -2 -15 2 -3 7 2 10 11 7 17 1 20 -8 4z"/>
<path d="M1501 7568 c-37 -96 -57 -143 -90 -208 -51 -103 -95 -209 -89 -215 3
-3 28 -8 56 -12 l51 -6 21 47 c25 53 28 53 152 34 l76 -11 28 -64 c29 -69 47
-83 110 -83 22 0 34 5 34 14 0 30 -229 500 -247 507 -10 3 -35 9 -56 13 -33 6
-38 4 -46 -16z m88 -150 c10 -24 30 -68 43 -98 14 -30 25 -56 24 -57 -1 -1
-20 4 -41 12 -22 8 -55 14 -72 15 -24 0 -33 5 -33 17 0 16 52 153 58 153 1 0
11 -19 21 -42z"/>
<path d="M1011 7481 c-43 -52 -47 -59 -17 -31 39 36 81 89 75 94 -2 2 -28 -27
-58 -63z"/>
<path d="M8137 7468 c-4 -46 -7 -112 -7 -147 0 -61 1 -63 23 -58 12 3 46 9 75
13 57 7 82 24 82 54 0 17 -3 17 -47 4 -95 -29 -93 -30 -93 101 0 90 -3 115
-14 115 -9 0 -15 -23 -19 -82z"/>
<path d="M444 7507 c3 -10 6 -27 6 -38 0 -10 5 -19 10 -19 15 0 11 33 -7 55
-14 18 -15 18 -9 2z"/>
<path d="M2265 7510 c3 -5 11 -10 16 -10 6 0 7 5 4 10 -3 6 -11 10 -16 10 -6
0 -7 -4 -4 -10z"/>
<path d="M2325 7510 c3 -5 14 -10 23 -10 15 0 15 2 2 10 -20 13 -33 13 -25 0z"/>
<path d="M2290 7495 c-10 -12 -10 -15 3 -15 19 0 31 16 18 24 -5 3 -14 -1 -21
-9z"/>
<path d="M7922 7497 c-11 -13 -116 -249 -127 -284 -3 -13 -3 -23 2 -23 17 0
32 16 38 42 11 42 34 56 100 59 56 3 61 1 75 -24 8 -15 21 -27 28 -27 20 0 14
34 -13 70 -13 18 -36 68 -50 111 -28 84 -37 96 -53 76z m30 -130 l16 -47 -39
2 c-22 2 -39 7 -39 12 0 5 8 33 18 62 12 38 19 48 23 36 3 -9 13 -38 21 -65z"/>
<path d="M8680 7470 c17 -22 37 -43 43 -47 6 -4 -6 14 -27 40 -21 26 -40 47
-43 47 -3 0 10 -18 27 -40z"/>
<path d="M513 7477 c3 -8 8 -42 12 -78 6 -57 4 -67 -15 -92 -17 -21 -25 -25
-31 -16 -6 10 -12 9 -29 -6 -17 -16 -24 -17 -41 -7 -18 11 -19 9 -19 -33 0
-50 -5 -54 -29 -26 -27 31 -172 104 -184 92 -19 -19 10 -58 90 -121 43 -34 87
-76 98 -93 28 -44 57 -68 71 -56 7 5 17 23 24 38 6 16 41 50 76 76 35 26 64
50 64 54 0 4 -5 12 -12 19 -8 8 -9 12 -1 12 6 0 13 -6 16 -12 4 -12 37 50 37
71 0 17 -33 21 -54 7 -12 -9 -41 -29 -66 -47 -25 -17 -57 -43 -72 -57 l-28
-26 0 36 c0 20 7 41 15 48 18 15 20 -1 3 -19 -7 -7 3 -3 23 8 66 39 78 59 81
139 1 40 6 76 10 78 14 9 -2 24 -24 24 -13 0 -18 -5 -15 -13z m47 -281 c0 -2
-12 -12 -27 -21 l-28 -18 19 21 c17 20 36 29 36 18z m-60 -39 c0 -2 -10 -12
-22 -23 l-23 -19 19 23 c18 21 26 27 26 19z"/>
<path d="M205 7460 c-3 -5 -1 -10 5 -10 8 0 9 -18 5 -57 -5 -42 -3 -54 4 -43
13 19 14 120 2 120 -6 0 -13 -4 -16 -10z"/>
<path d="M1936 7454 c-3 -9 -6 -109 -6 -224 0 -232 -7 -212 73 -226 l37 -6 0
230 0 230 -22 6 c-41 11 -76 6 -82 -10z"/>
<path d="M7640 7448 c-98 -17 -100 -17 -100 -38 0 -17 7 -20 40 -20 l40 0 0
-111 c0 -100 2 -110 18 -107 15 3 17 18 20 116 l3 112 32 0 c37 0 57 15 57 42
0 20 -20 21 -110 6z"/>
<path d="M292 7400 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M7463 7408 c-10 -16 -14 -166 -7 -225 6 -47 28 -58 38 -20 3 12 6 75
6 140 0 95 -3 117 -14 117 -8 0 -18 -6 -23 -12z"/>
<path d="M185 7400 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0
-8 -4 -11 -10z"/>
<path d="M7270 7379 c-93 -37 -128 -163 -64 -230 22 -23 36 -29 72 -29 25 0
62 5 83 12 l39 11 0 70 0 70 -37 -7 c-21 -3 -44 -6 -50 -6 -7 0 -13 -9 -13
-20 0 -16 5 -19 30 -13 28 5 30 3 30 -24 0 -39 -16 -53 -65 -53 -61 0 -85 22
-85 75 0 35 6 52 29 77 28 31 33 33 90 30 48 -2 61 1 61 13 0 31 -67 45 -120
24z"/>
<path d="M277 7363 c-12 -11 -7 -40 8 -53 9 -7 31 -13 50 -14 37 -1 42 9 25
49 -8 19 -9 19 -9 -2 -1 -18 -7 -23 -26 -23 -20 0 -25 5 -25 25 0 24 -10 32
-23 18z"/>
<path d="M151 7334 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M442 7339 c2 -7 10 -15 17 -17 8 -3 12 1 9 9 -2 7 -10 15 -17 17 -8
3 -12 -1 -9 -9z"/>
<path d="M7078 7263 c0 -49 -2 -107 -4 -130 -2 -37 0 -43 17 -43 18 0 19 8 19
130 0 109 -2 130 -15 130 -12 0 -15 -17 -17 -87z"/>
<path d="M9505 7269 c-60 -27 -153 -65 -205 -85 -52 -19 -142 -59 -200 -88
l-105 -53 1 -449 c2 -758 4 -874 22 -932 9 -29 20 -52 25 -52 5 0 6 8 2 18 -4
9 -10 31 -12 47 -5 29 -4 29 15 -7 11 -21 23 -54 27 -75 5 -28 9 -33 17 -22 7
11 9 9 5 -8 -3 -13 -1 -23 4 -23 4 0 5 -7 2 -17 -4 -11 -3 -14 5 -9 8 4 10 2
6 -7 -4 -12 -13 -11 -47 9 -35 19 -53 22 -103 19 -58 -4 -61 -3 -78 26 -10 16
-26 29 -37 29 -22 0 -23 -3 -6 -33 24 -43 39 -57 52 -47 8 7 12 5 12 -5 0 -8
-4 -12 -8 -9 -4 2 -10 0 -14 -6 -3 -5 0 -10 8 -10 13 0 84 -76 119 -129 14
-21 30 -28 87 -37 61 -9 68 -9 64 5 -3 11 0 10 11 -3 22 -27 20 -16 -9 50 -14
32 -23 59 -20 62 3 3 6 3 8 1 10 -13 77 -167 77 -175 0 -6 -15 -9 -32 -8 l-33
3 35 -12 c19 -7 42 -16 50 -21 13 -9 13 -8 1 7 -17 21 -9 64 24 136 19 40 21
50 9 40 -15 -12 -16 -11 -10 18 11 48 9 81 -7 155 -8 36 -11 70 -8 75 5 8 147
53 166 53 3 0 5 -69 4 -153 -2 -154 -2 -154 -35 -218 -19 -35 -34 -59 -34 -53
0 17 32 108 43 122 7 9 6 11 -7 6 -20 -8 -87 -105 -106 -154 -7 -19 -16 -39
-20 -43 -4 -4 -3 -27 1 -50 13 -69 9 -99 -7 -48 -16 53 -29 68 -20 24 7 -30 6
-31 -28 -31 -20 0 -34 3 -31 7 2 4 -4 14 -14 23 -13 11 -23 13 -36 6 -12 -7
-20 -7 -25 2 -5 9 -9 8 -13 -3 -6 -17 9 -25 103 -57 75 -26 96 -40 58 -40 -15
0 -30 5 -33 11 -4 6 -13 8 -21 5 -7 -3 -16 0 -20 6 -4 7 -10 4 -17 -7 -13 -24
7 -35 66 -35 l47 0 0 -50 c0 -27 -4 -50 -10 -50 -5 0 -10 8 -10 19 0 10 -8 21
-17 24 -10 3 -43 15 -73 26 -70 27 -90 27 -90 0 0 -11 -4 -29 -10 -39 -8 -15
-4 -23 21 -45 27 -22 90 -55 106 -55 3 0 -3 12 -12 27 -16 23 -16 25 -1 20 10
-4 16 -1 16 7 0 8 12 16 26 19 20 3 28 -1 36 -19 6 -13 15 -24 20 -24 4 0 8
-9 8 -21 0 -11 5 -17 10 -14 6 4 10 -8 10 -29 0 -24 -6 -39 -21 -50 -25 -17
-19 -46 10 -46 11 0 26 -7 35 -15 8 -8 19 -15 25 -15 14 0 14 -13 -1 -28 -9
-9 -6 -10 12 -7 12 2 30 0 40 -5 15 -8 18 -4 23 31 4 34 47 119 111 221 17 28
-2 33 -24 7 -20 -22 -20 -23 -11 -2 6 12 16 25 21 28 6 3 17 21 26 38 l15 32
-21 -28 c-12 -15 -26 -25 -31 -22 -4 3 -11 -6 -15 -20 -3 -14 -12 -25 -20 -25
-8 0 -29 -14 -47 -31 -32 -31 -32 -31 -37 -8 -5 22 -7 21 -27 -11 l-22 -34
-11 29 c-15 38 -29 138 -21 145 4 3 21 37 40 75 l33 70 -6 -54 -5 -54 24 23
c37 35 49 112 47 305 -1 94 1 206 4 251 l6 81 86 17 c48 10 91 21 96 27 14 13
-25 11 -109 -5 -52 -10 -72 -11 -77 -2 -9 13 -8 431 1 530 l6 70 50 12 c61 16
125 44 125 56 0 11 5 12 -93 -21 l-86 -28 -5 36 c-7 43 -6 758 1 784 2 9 9 17
14 17 6 0 48 18 95 40 72 35 84 44 84 65 0 35 -16 32 -145 -26z m-75 -507 l0
-408 -82 -28 c-46 -15 -89 -30 -96 -33 -10 -4 -12 78 -10 402 l3 407 85 33
c47 18 88 33 93 34 4 0 7 -183 7 -407z m-211 -98 c1 -355 0 -382 -16 -389 -10
-4 -48 -18 -85 -30 l-68 -24 0 388 c0 441 -9 396 95 449 60 30 60 30 67 9 3
-12 6 -194 7 -403z m211 -638 l0 -305 -77 -16 c-43 -9 -83 -18 -89 -20 -18 -5
-24 79 -24 340 l0 240 88 31 c48 17 90 32 95 33 4 0 7 -136 7 -303z m-212 -46
c-3 -154 -7 -282 -10 -285 -11 -11 -38 8 -38 26 0 35 -29 20 -55 -28 -14 -27
-23 -37 -19 -23 16 59 21 90 14 85 -4 -3 -11 3 -14 12 -6 15 -8 15 -17 3 -8
-12 -10 -9 -5 9 3 13 1 31 -3 40 -5 9 -11 98 -14 197 l-6 181 42 13 c23 7 58
21 77 31 19 10 39 18 44 19 5 0 7 -120 4 -280z m-107 -357 c-12 -20 -14 -14
-5 12 4 9 9 14 11 11 3 -2 0 -13 -6 -23z m-237 -59 c5 -14 4 -15 -9 -4 -17 14
-19 20 -6 20 5 0 12 -7 15 -16z m386 -208 c0 -3 -4 -8 -10 -11 -5 -3 -10 -1
-10 4 0 6 5 11 10 11 6 0 10 -2 10 -4z m171 -71 l-9 -40 -1 42 c-1 23 2 50 6
60 7 17 8 17 11 -2 1 -11 -1 -38 -7 -60z m-251 -371 c0 -11 -40 -2 -54 12 -28
27 -17 34 19 13 19 -12 35 -23 35 -25z"/>
<path d="M6840 7296 l-35 -13 -5 -119 c-3 -65 -5 -120 -5 -120 0 -1 27 2 60 8
110 17 171 76 162 157 -7 68 -34 96 -93 98 -27 1 -65 -4 -84 -11z m132 -57
c41 -49 -1 -119 -86 -144 -27 -8 -51 -15 -53 -15 -5 0 -3 114 4 154 l6 38 55
-4 c43 -4 60 -10 74 -29z"/>
<path d="M326 7265 c4 -8 11 -15 16 -15 6 0 5 6 -2 15 -7 8 -14 15 -16 15 -2
0 -1 -7 2 -15z"/>
<path d="M0 7141 c0 -23 5 -41 13 -43 9 -4 13 -118 15 -518 3 -456 1 -515 -12
-522 -22 -13 -20 -31 3 -23 16 5 20 -1 25 -37 7 -44 9 -50 63 -148 50 -90 180
-276 213 -304 17 -14 46 -28 65 -32 l35 -6 1 -227 c1 -124 5 -237 9 -251 4
-14 6 169 3 405 -3 237 -6 436 -9 443 -2 7 -9 12 -16 11 -28 -3 -49 1 -43 10
6 11 -41 51 -61 51 -7 0 -15 -6 -17 -12 -4 -8 -6 -7 -6 4 -1 9 5 19 11 22 7 3
-2 3 -20 0 -23 -3 -34 0 -38 10 -5 14 -70 43 -86 38 -3 -1 -12 5 -18 13 -7 8
-23 15 -36 15 l-23 0 0 537 c-1 575 0 566 -51 593 -18 10 -20 8 -20 -29z m375
-1339 c25 -35 45 -68 43 -72 -2 -5 -26 22 -55 59 -28 38 -49 72 -46 75 8 7 2
14 58 -62z m45 -2 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4
-4 4 -10z"/>
<path d="M8292 7160 c-115 -70 -103 -244 19 -273 28 -7 134 17 156 35 8 6 13
33 13 69 l0 59 -50 0 c-38 0 -52 -4 -60 -19 -15 -30 -13 -33 20 -26 27 6 30 4
30 -19 0 -54 -96 -77 -138 -33 -29 31 -30 95 -1 131 32 40 68 55 121 49 39 -5
49 -2 54 12 10 24 -12 35 -76 35 -37 0 -65 -6 -88 -20z"/>
<path d="M2120 7159 c0 -12 29 -19 76 -19 44 0 59 14 26 24 -24 8 -102 4 -102
-5z"/>
<path d="M8109 7143 c0 -5 0 -51 0 -103 l2 -95 -75 77 c-41 42 -84 82 -95 88
-21 11 -21 9 -21 -134 0 -122 2 -145 16 -150 9 -3 18 -6 20 -6 2 0 4 47 4 105
l0 104 83 -86 c51 -53 88 -83 95 -79 8 5 12 51 12 147 0 132 -1 139 -20 139
-11 0 -20 -3 -21 -7z"/>
<path d="M7828 7093 c-16 -4 -18 -20 -18 -144 0 -132 1 -139 20 -139 19 0 20
7 20 145 0 80 -1 144 -2 144 -2 -1 -11 -3 -20 -6z"/>
<path d="M1192 6983 l3 -108 55 -6 c37 -3 59 -1 67 7 10 10 6 14 -20 19 -57
12 -67 16 -67 31 0 8 -5 14 -11 14 -7 0 -9 26 -7 75 2 56 0 75 -10 75 -10 0
-12 -25 -10 -107z"/>
<path d="M7708 6980 l-3 -101 -75 85 c-41 46 -80 85 -86 85 -15 1 -24 -55 -24
-145 0 -88 9 -134 25 -134 15 0 25 53 25 134 l0 59 22 -29 c37 -50 122 -134
135 -134 19 0 24 35 21 160 -3 99 -5 115 -20 118 -15 3 -18 -9 -20 -98z"/>
<path d="M709 6997 c-9 -34 -19 -71 -24 -82 -7 -18 -6 -18 7 -5 21 21 59 150
44 150 -6 0 -18 -28 -27 -63z"/>
<path d="M8670 7050 c0 -5 10 -15 23 -21 22 -12 22 -12 3 10 -21 23 -26 26
-26 11z"/>
<path d="M627 7030 c3 -11 9 -20 14 -20 5 0 9 9 9 20 0 11 -6 20 -14 20 -9 0
-12 -7 -9 -20z"/>
<path d="M330 7030 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
-4 -4 -4 -10z"/>
<path d="M1465 7030 c3 -5 13 -10 21 -10 8 0 12 5 9 10 -3 6 -13 10 -21 10 -8
0 -12 -4 -9 -10z"/>
<path d="M6615 7030 c-3 -6 1 -7 9 -4 18 7 21 14 7 14 -6 0 -13 -4 -16 -10z"/>
<path d="M260 7005 c0 -8 2 -15 4 -15 2 0 6 7 10 15 3 8 1 15 -4 15 -6 0 -10
-7 -10 -15z"/>
<path d="M1563 6913 c1 -60 7 -111 12 -115 22 -17 76 -8 100 17 14 13 25 29
25 35 0 6 5 8 10 5 16 -10 12 53 -6 90 -19 42 -47 60 -101 69 l-43 6 3 -107z
m83 59 c23 -16 44 -58 44 -87 0 -34 -29 -85 -30 -52 0 19 -15 23 -25 7 -3 -5
-14 -10 -25 -10 -16 0 -18 7 -13 63 2 34 6 68 8 75 5 13 24 16 41 4z m1 -158
c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z"/>
<path d="M7313 7003 l-33 -4 0 -112 c0 -62 3 -122 6 -135 10 -37 29 -19 32 30
4 67 41 76 74 18 17 -31 63 -59 75 -47 4 4 -6 20 -20 35 -33 34 -33 36 -3 75
34 45 41 79 22 116 -16 29 -20 31 -69 29 -28 0 -67 -3 -84 -5z m111 -39 c24
-9 20 -51 -6 -68 -34 -20 -95 -27 -102 -11 -7 20 4 58 22 73 17 13 60 16 86 6z"/>
<path d="M1402 6980 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M1775 6974 c-13 -5 -4 -163 10 -185 6 -9 23 -23 40 -32 27 -13 31
-13 42 2 11 14 12 13 13 -9 2 -53 19 18 26 108 6 78 5 89 -10 89 -13 0 -16
-12 -16 -68 0 -104 -18 -125 -59 -73 -17 21 -21 41 -21 95 0 66 -5 80 -25 73z"/>
<path d="M7098 6918 c-15 -35 -38 -92 -53 -127 -18 -42 -23 -67 -17 -73 7 -7
14 -3 21 11 14 26 35 37 88 46 39 6 44 5 54 -19 17 -37 43 -35 36 3 -11 56
-80 221 -92 221 -6 0 -23 -28 -37 -62z m63 -58 c7 -22 10 -42 8 -44 -2 -2 -21
-7 -41 -11 -28 -5 -38 -4 -38 6 0 22 41 99 51 94 4 -3 14 -24 20 -45z"/>
<path d="M6950 6950 c-8 -5 -39 -10 -67 -10 l-53 0 0 -124 c0 -69 4 -127 8
-130 7 -4 38 1 120 19 43 10 21 25 -38 25 -59 0 -60 0 -60 29 0 31 18 41 73
41 21 0 27 5 27 21 0 19 -4 20 -50 14 l-50 -7 0 35 c0 36 15 47 66 47 23 0 48
23 42 39 -2 7 -8 7 -18 1z"/>
<path d="M1407 6933 c-10 -3 -14 -9 -10 -16 4 -7 -1 -6 -10 2 -15 12 -17 10
-17 -20 0 -54 12 -63 81 -66 68 -3 69 8 4 29 -28 9 -41 20 -43 34 -3 18 1 20
28 16 23 -3 30 0 30 12 0 16 -23 19 -63 9z"/>
<path d="M4760 6913 c-80 -48 -120 -113 -120 -196 0 -99 50 -181 136 -223 63
-31 100 -28 177 14 74 40 101 77 116 158 12 64 11 73 -9 127 -18 47 -28 61
-60 77 -52 26 -58 25 -30 -5 20 -21 24 -40 31 -127 12 -151 10 -159 -59 -181
-117 -36 -192 -18 -208 50 -3 16 -10 44 -15 63 -11 45 -12 142 0 172 19 51
151 95 221 75 l25 -8 -25 15 c-42 26 -128 20 -180 -11z"/>
<path d="M1955 6863 c-3 -32 -8 -79 -11 -105 -4 -37 -1 -48 9 -48 15 0 27 59
27 126 0 47 9 64 36 64 31 0 57 -37 43 -62 -8 -15 -17 -18 -40 -13 -18 4 -29
3 -29 -4 0 -6 4 -11 9 -11 5 0 23 -24 40 -54 17 -29 38 -59 46 -66 23 -19 19
5 -10 50 -14 22 -25 43 -25 48 0 5 13 23 29 41 16 18 27 39 24 46 -9 25 -52
45 -97 45 l-45 0 -6 -57z"/>
<path d="M6636 6912 c-2 -4 -4 -62 -5 -130 0 -138 -8 -129 96 -111 53 9 63 14
63 31 0 19 -4 19 -60 13 l-60 -7 0 84 c0 45 -3 93 -6 106 -6 22 -19 29 -28 14z"/>
<path d="M2176 6788 c4 -70 11 -108 21 -118 13 -13 15 -5 11 72 -2 48 -2 85 1
82 3 -3 29 -42 56 -86 28 -44 60 -87 73 -96 l22 -14 0 110 c0 61 -4 113 -9
117 -13 8 -17 -36 -11 -123 5 -79 -3 -106 -15 -46 -3 20 -18 55 -32 76 -30 48
-102 128 -115 128 -5 0 -6 -42 -2 -102z"/>
<path d="M4806 6875 c-52 -18 -66 -34 -71 -81 -3 -31 -3 -33 3 -9 6 23 13 30
33 31 14 1 32 5 39 9 9 5 11 4 6 -3 -4 -7 -2 -12 4 -12 6 0 9 -4 5 -9 -7 -13
12 -24 26 -15 8 5 8 9 -1 14 -18 11 -2 32 20 25 10 -3 21 -1 25 5 3 6 11 8 16
5 5 -4 9 1 9 9 0 13 3 14 19 4 24 -15 35 -43 32 -83 -2 -24 0 -27 10 -18 9 9
10 24 3 55 -8 37 -15 46 -54 66 -51 25 -70 27 -124 7z"/>
<path d="M645 6863 c-52 -12 -61 -80 -16 -114 30 -22 32 -49 4 -49 -8 0 -13
-6 -10 -12 7 -21 68 -10 105 18 18 14 41 41 50 60 15 32 15 37 0 62 -22 36
-42 42 -27 8 9 -20 9 -31 1 -48 -12 -23 -12 -23 -7 -1 6 23 -19 83 -34 83 -5
0 -12 -6 -14 -12 -4 -10 -6 -10 -6 0 -1 12 -10 13 -46 5z m85 -95 c0 -9 -9
-20 -21 -23 -27 -9 -34 -1 -14 18 8 9 15 24 15 34 0 15 2 16 10 3 5 -8 10 -23
10 -32z"/>
<path d="M2425 6766 c2 -144 4 -156 25 -156 20 0 21 5 18 108 -3 99 -4 107
-23 108 -18 1 -20 -5 -20 -60z"/>
<path d="M2978 6823 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M2312 6790 c0 -19 2 -27 5 -17 2 9 2 25 0 35 -3 9 -5 1 -5 -18z"/>
<path d="M2540 6695 c0 -87 3 -105 15 -105 12 0 15 16 15 86 l0 86 36 -68 c19
-38 48 -85 65 -104 l29 -34 0 44 c0 25 2 68 4 95 3 41 2 44 -4 15 -7 -34 -7
-34 -10 15 -3 45 -4 43 -9 -25 l-6 -75 -29 55 c-37 73 -74 120 -92 120 -11 0
-14 -20 -14 -105z m17 -22 c-2 -16 -4 -5 -4 22 0 28 2 40 4 28 2 -13 2 -35 0
-50z"/>
<path d="M2807 6729 c-26 -15 -47 -64 -43 -101 5 -39 74 -107 88 -86 6 10 8
10 8 0 0 -10 5 -10 20 -2 12 6 29 8 39 5 13 -4 20 1 25 17 13 50 8 58 -31 58
-35 -1 -36 -2 -20 -15 11 -7 25 -11 33 -8 10 4 12 0 8 -12 -10 -24 -51 -37
-75 -24 -27 14 -59 68 -59 100 0 47 33 60 97 37 42 -15 55 -2 23 22 -27 21
-84 26 -113 9z"/>
<path d="M4941 6694 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M1214 6457 c-2 -7 -6 -53 -7 -102 l-2 -89 40 -7 c22 -3 59 -9 83 -12
l42 -5 0 103 0 103 -44 11 c-60 15 -105 14 -112 -2z"/>
<path d="M390 6140 c21 -35 30 -65 31 -98 l2 -47 7 50 c4 28 4 52 1 55 -3 3
-19 24 -34 48 -38 58 -43 53 -7 -8z"/>
<path d="M558 6183 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M631 6174 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M606 6138 c-5 -20 -15 -39 -23 -42 -12 -5 -14 -1 -9 20 5 19 3 25 -6
22 -7 -3 -14 -14 -16 -26 -4 -23 -17 -29 -27 -11 -5 7 -14 4 -28 -8 -20 -18
-20 -17 -15 4 4 13 1 26 -4 30 -6 3 -8 1 -4 -5 3 -6 2 -13 -3 -17 -6 -3 -10
-31 -11 -63 -1 -31 -2 -75 -3 -96 -1 -22 3 -41 8 -43 10 -3 89 69 129 117 11
14 19 39 19 59 0 20 2 28 4 19 8 -30 20 -20 19 16 -1 19 -4 32 -8 30 -3 -2 -8
4 -11 13 -2 11 -7 4 -11 -19z m-44 -100 c-6 -6 -7 0 -4 19 5 21 7 23 10 9 2
-10 0 -22 -6 -28z m-35 10 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1
-19z m41 -38 c-7 -10 -14 -17 -17 -15 -4 4 18 35 25 35 2 0 -1 -9 -8 -20z"/>
<path d="M691 6020 c-24 -11 -85 -50 -137 -87 l-94 -66 0 -46 c0 -35 3 -42 11
-31 8 11 9 9 3 -10 -3 -14 -10 -29 -14 -35 -6 -8 -16 -239 -11 -268 2 -15 113
77 156 129 55 68 136 227 169 332 14 46 26 87 26 93 0 16 -63 10 -109 -11z"/>
<path d="M1914 5916 c-15 -47 -26 -87 -24 -89 9 -8 130 -13 130 -5 0 12 -61
162 -69 171 -4 4 -21 -30 -37 -77z"/>
<path d="M421 5978 c-1 -12 -7 -15 -23 -11 -23 6 -23 6 2 -21 24 -27 25 -27
28 -7 2 12 1 29 -1 39 -4 15 -5 15 -6 0z"/>
<path d="M13 5939 c-9 -9 -13 -50 -13 -131 l0 -117 40 -32 c40 -33 106 -110
79 -94 -7 5 -21 10 -30 10 -8 1 -32 19 -52 41 l-36 39 -1 -142 c0 -115 3 -143
14 -143 7 0 19 -7 26 -15 7 -8 16 -12 21 -9 5 3 9 -2 9 -10 0 -9 -6 -16 -14
-16 -16 0 -26 -21 -26 -58 0 -17 -3 -23 -10 -16 -6 6 -6 22 0 44 10 36 8 46
-9 35 -17 -10 -14 -154 4 -171 12 -13 15 -12 25 6 6 11 21 30 34 44 19 18 27
21 37 12 9 -8 10 -3 5 24 l-6 35 20 -30 c32 -46 70 -123 70 -140 0 -9 18 -43
40 -75 22 -33 43 -73 46 -90 8 -36 24 -50 24 -21 0 11 5 23 10 26 6 3 10 17
10 30 0 13 5 27 10 30 6 3 10 11 10 16 0 6 -5 7 -11 3 -15 -9 -1 37 15 51 6 6
13 29 15 53 2 33 -2 47 -15 57 -12 9 -19 28 -20 61 -3 79 -34 151 -109 254
-22 30 -50 71 -64 90 -13 19 -40 55 -59 79 -20 25 -37 56 -37 70 -1 14 -4 33
-7 41 -4 8 -13 50 -20 93 -10 63 -15 76 -25 66z m122 -408 c3 -5 0 -13 -7 -17
-7 -4 -10 -4 -6 1 4 4 -3 16 -15 27 l-22 19 22 -10 c12 -6 24 -15 28 -20z m60
-59 c-2 -3 -11 0 -18 6 -8 7 -17 9 -21 5 -4 -4 -4 1 0 10 6 17 8 17 25 1 11
-10 17 -19 14 -22z m-7 -142 c15 -24 7 -25 -51 -9 -44 12 -40 29 6 29 21 0 36
-7 45 -20z m104 -100 c7 -14 20 -36 30 -49 10 -13 18 -30 18 -37 0 -31 -21
-10 -55 55 -20 38 -45 78 -56 89 -10 12 -19 27 -19 34 0 15 63 -55 82 -92z
m-245 -17 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z"/>
<path d="M8869 5887 c19 -49 75 -147 84 -147 20 0 -4 62 -44 115 -46 60 -53
66 -40 32z"/>
<path d="M8981 5894 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M1200 5800 l0 -79 43 -5 c23 -3 60 -8 82 -10 22 -2 3 -3 -43 -2 l-83
1 3 -80 3 -80 79 -8 c43 -4 80 -6 82 -4 2 1 4 77 4 167 l2 165 -69 3 c-37 1
-76 4 -85 6 -16 4 -18 -5 -18 -74z"/>
<path d="M1386 5845 c-3 -9 -6 -43 -6 -76 l0 -59 38 0 c20 0 61 -3 90 -6 l52
-7 0 71 c0 80 7 74 -111 87 -47 5 -58 3 -63 -10z"/>
<path d="M1570 5766 c0 -57 2 -64 23 -71 l22 -8 -22 -4 c-22 -4 -23 -9 -23
-84 l0 -79 79 0 c83 0 91 5 91 51 0 16 -7 19 -50 19 -62 0 -63 6 -15 119 19
45 35 88 35 95 0 13 -61 26 -116 26 -23 0 -24 -3 -24 -64z"/>
<path d="M6191 5714 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M1382 5616 l3 -81 75 -7 c41 -4 81 -5 88 -3 8 3 12 28 12 80 0 71 -1
75 -22 76 -13 0 -54 3 -91 8 l-68 7 3 -80z"/>
<path d="M4945 5630 c-3 -4 8 -10 25 -12 16 -2 27 -1 25 3 -7 11 -44 18 -50 9z"/>
<path d="M5028 5583 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M5003 5550 c-1 -12 4 -20 13 -20 9 0 14 7 12 17 -4 24 -23 27 -25 3z"/>
<path d="M5044 5508 c0 -14 3 -24 5 -22 12 12 34 -45 32 -82 -1 -23 2 -45 8
-49 6 -3 11 -15 11 -26 0 -10 4 -19 10 -19 5 0 7 8 4 18 -5 13 -4 14 4 3 6 -8
8 -21 4 -30 -3 -9 -2 -13 3 -9 4 4 14 3 22 -3 10 -9 13 -5 13 19 0 17 -4 33
-10 37 -5 3 -7 12 -4 20 6 16 -13 82 -26 90 -4 3 -6 -5 -3 -17 4 -21 3 -21 -7
-5 -6 10 -10 23 -7 30 2 6 0 16 -5 22 -5 5 -16 19 -24 30 -9 11 -13 14 -9 8 3
-7 2 -13 -4 -13 -5 0 -11 6 -14 13 -2 6 -4 0 -3 -15z m76 -133 c0 -14 -4 -25
-10 -25 -11 0 -14 33 -3 43 11 11 13 8 13 -18z"/>
<path d="M626 5503 c-6 -14 -5 -15 5 -6 7 7 10 15 7 18 -3 3 -9 -2 -12 -12z"/>
<path d="M4614 5473 c-48 -82 -64 -190 -39 -257 24 -63 42 -51 51 35 4 45 10
66 17 62 6 -4 1 7 -11 24 -12 17 -22 39 -22 50 0 15 -2 16 -10 3 -11 -17 -13
0 -3 25 5 14 8 12 19 -11 8 -19 13 -23 13 -11 1 9 6 17 12 17 5 0 15 13 20 30
6 16 15 27 20 24 10 -6 12 17 3 40 -12 30 -42 17 -70 -31z"/>
<path d="M606 5465 c-9 -26 -7 -32 5 -12 6 10 9 21 6 23 -2 3 -7 -2 -11 -11z"/>
<path d="M2390 5412 c0 -53 4 -73 15 -80 9 -5 21 -37 29 -78 l13 -69 7 60 c11
90 14 95 46 95 31 0 40 18 40 88 l0 42 -59 0 c-33 0 -66 3 -75 6 -14 5 -16 -4
-16 -64z"/>
<path d="M5146 5465 c4 -8 8 -15 10 -15 2 0 4 7 4 15 0 8 -4 15 -10 15 -5 0
-7 -7 -4 -15z"/>
<path d="M2550 5403 l0 -63 39 0 c21 0 59 3 85 6 l46 7 0 53 0 53 -85 3 -85 3
0 -62z"/>
<path d="M9814 5455 c11 -8 24 -15 30 -15 5 0 1 7 -10 15 -10 8 -23 14 -29 14
-5 0 -1 -6 9 -14z"/>
<path d="M2734 5376 l6 -85 -27 -3 c-14 -2 -28 -9 -31 -17 -3 -10 3 -12 26 -6
18 4 33 2 37 -5 10 -16 0 -23 -31 -24 -43 -2 -42 -26 0 -26 29 0 36 -4 36 -20
0 -11 5 -20 10 -20 13 0 13 147 0 155 -6 4 -8 11 -5 16 10 15 58 10 93 -11
l32 -20 0 75 0 75 -76 0 -77 0 7 -84z"/>
<path d="M4555 5439 c-4 -6 -5 -12 -2 -15 2 -3 7 2 10 11 7 17 1 20 -8 4z"/>
<path d="M9900 5440 c-24 -8 -23 -8 8 -9 17 -1 32 -5 32 -11 0 -5 7 -7 15 -4
8 4 15 10 15 15 0 4 -7 6 -15 3 -8 -4 -15 -1 -15 5 0 12 -4 12 -40 1z"/>
<path d="M3302 5410 c0 -19 2 -27 5 -17 2 9 2 25 0 35 -3 9 -5 1 -5 -18z"/>
<path d="M9736 5030 c1 -224 6 -396 11 -401 5 -5 23 -7 39 -3 l30 6 3 304 c2
274 1 304 -14 304 -13 0 -14 4 -4 21 7 14 17 19 30 16 26 -7 24 8 -4 30 -19
15 -22 22 -13 35 7 11 7 26 0 45 -7 22 -16 29 -44 31 l-35 3 1 -391z m54 274
c0 -13 -21 -44 -30 -44 -5 0 -9 11 -8 25 2 17 8 25 20 25 10 0 18 -3 18 -6z"/>
<path d="M3623 5369 c-12 -31 -36 -33 -27 -1 2 9 0 7 -7 -4 -9 -18 -7 -26 10
-43 13 -13 20 -29 17 -39 -3 -9 -1 -23 3 -31 8 -12 12 -12 25 -2 13 11 15 6
19 -36 3 -26 3 -3 1 52 -4 134 -17 168 -41 104z m17 -29 c0 -5 -4 -10 -10 -10
-5 0 -10 5 -10 10 0 6 5 10 10 10 6 0 10 -4 10 -10z"/>
<path d="M5183 5360 c0 -25 2 -35 4 -22 2 12 2 32 0 45 -2 12 -4 2 -4 -23z"/>
<path d="M6200 5360 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z"/>
<path d="M3710 5330 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
-4 -4 -4 -10z"/>
<path d="M1427 5313 c-4 -3 -7 -15 -7 -25 0 -29 44 -20 48 10 3 16 -2 22 -16
22 -10 0 -22 -3 -25 -7z"/>
<path d="M2507 5313 c-4 -3 -7 -16 -6 -27 0 -19 1 -19 10 3 10 24 8 36 -4 24z"/>
<path d="M2616 5304 c-3 -9 -6 -27 -6 -40 0 -13 -11 -34 -25 -46 -14 -12 -25
-25 -25 -30 0 -11 67 -10 74 1 4 5 9 37 12 70 6 51 4 61 -9 61 -8 0 -18 -7
-21 -16z"/>
<path d="M10077 5313 c-12 -11 -8 -65 4 -57 8 5 9 -6 4 -37 -8 -48 -25 -77
-25 -42 0 29 -30 39 -37 13 -6 -21 -6 -21 -29 1 -19 18 -27 20 -36 11 -10 -10
-10 -17 0 -33 8 -12 9 -18 3 -14 -6 3 -11 -1 -11 -9 0 -8 17 -29 38 -46 43
-34 83 -84 86 -107 1 -8 7 -18 12 -21 11 -9 16 -32 7 -32 -5 0 -15 13 -25 29
-15 28 -65 68 -72 60 -2 -2 -6 -20 -10 -40 -6 -33 -2 -42 44 -99 27 -34 47
-66 44 -72 -6 -10 46 0 59 11 4 4 0 22 -9 40 -11 22 -13 36 -6 43 14 14 32 1
32 -23 0 -13 4 -18 12 -13 6 4 8 3 5 -3 -4 -6 4 -27 18 -47 14 -20 25 -39 25
-41 0 -9 -73 -35 -96 -35 -13 0 -24 -4 -24 -10 0 -13 3 -13 83 6 l67 17 0 59
c0 33 -4 57 -9 54 -5 -3 -12 1 -15 10 -9 24 -7 28 9 14 13 -11 15 5 15 133 0
138 -1 145 -21 150 -17 5 -19 9 -10 26 24 43 3 43 -23 0 -14 -24 -17 -43 -13
-81 4 -28 11 -56 18 -64 6 -8 9 -20 6 -29 -4 -8 -2 -17 3 -20 6 -4 10 -11 10
-17 0 -6 -11 2 -25 18 -14 16 -25 39 -25 51 0 12 -8 28 -19 35 -23 16 -21 74
5 113 20 31 8 33 -24 3 l-24 -23 2 45 c1 25 1 53 1 63 -1 17 -12 22 -24 10z
m-22 -189 c9 -15 12 -23 6 -20 -11 7 -35 46 -28 46 3 0 12 -12 22 -26z m72
-66 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z"/>
<path d="M2051 5296 c-7 -8 -11 -32 -9 -53 3 -35 6 -38 36 -41 36 -4 48 13 38
52 -6 25 -31 56 -45 56 -5 0 -14 -6 -20 -14z"/>
<path d="M2800 5255 c0 -40 4 -57 15 -61 42 -16 61 60 25 96 -32 32 -40 24
-40 -35z"/>
<path d="M9003 5248 c0 -24 3 -47 6 -53 3 -5 6 -14 6 -20 0 -5 11 -9 23 -7 13
2 31 -2 39 -10 14 -11 16 -11 11 2 -3 8 1 21 8 28 13 12 18 8 16 -9 -1 -4 8
-5 19 -2 12 4 25 0 30 -8 6 -11 9 -8 9 9 0 12 -6 22 -14 22 -13 0 -31 27 -28
43 3 11 -15 8 -30 -5 -21 -20 -41 -21 -34 -3 3 9 6 18 6 21 0 2 7 1 15 -2 8
-3 20 -2 27 2 8 5 -6 13 -37 21 -72 18 -73 18 -72 -29z m87 -50 c0 -4 -7 -8
-15 -8 -8 0 -15 4 -15 8 0 5 7 9 15 9 8 0 15 -4 15 -9z"/>
<path d="M781 5252 c-30 -42 -26 -50 5 -12 15 17 24 33 21 36 -2 3 -14 -8 -26
-24z"/>
<path d="M3060 5193 l0 -88 37 1 38 1 1 87 2 86 -39 0 -39 0 0 -87z"/>
<path d="M6195 5270 c-3 -5 1 -10 10 -10 9 0 13 5 10 10 -3 6 -8 10 -10 10 -2
0 -7 -4 -10 -10z"/>
<path d="M6190 5225 c0 -9 6 -12 15 -9 8 4 12 10 9 15 -8 14 -24 10 -24 -6z"/>
<path d="M4332 5171 c-11 -7 -11 -11 2 -23 17 -17 12 -53 -12 -80 -8 -10 -10
-18 -5 -18 6 0 14 8 17 17 6 15 9 15 16 3 7 -11 10 -8 13 11 9 48 5 79 -10 79
-8 0 -11 5 -8 10 7 12 4 12 -13 1z"/>
<path d="M6180 5170 c-13 -8 -13 -10 2 -10 9 0 20 5 23 10 8 13 -5 13 -25 0z"/>
<path d="M9206 5171 c-4 -6 0 -18 8 -27 12 -12 16 -12 16 -2 0 22 -17 42 -24
29z"/>
<path d="M4261 5118 c-1 -28 3 -48 10 -48 5 0 7 5 4 10 -3 6 -2 10 3 10 5 0 9
14 10 32 0 21 -2 28 -8 19 -6 -11 -9 -10 -13 5 -2 10 -5 -2 -6 -28z"/>
<path d="M9045 5150 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0
-7 -4 -4 -10z"/>
<path d="M3360 5130 c0 -5 17 -10 38 -9 30 0 33 2 17 9 -28 12 -55 12 -55 0z"/>
<path d="M5247 5115 c-10 -14 -36 -52 -57 -84 -22 -32 -51 -68 -65 -79 -14
-11 -25 -23 -25 -28 0 -4 11 3 25 16 14 13 25 20 25 16 0 -4 16 2 36 13 20 12
46 19 60 17 20 -4 24 -1 24 22 0 15 3 51 6 80 7 57 -1 65 -29 27z"/>
<path d="M5291 5048 c-2 -65 1 -90 8 -83 6 6 37 8 78 4 38 -3 69 -5 70 -4 1 0
5 37 9 81 l7 81 -54 6 c-30 4 -68 7 -85 7 l-30 0 -3 -92z"/>
<path d="M3760 5115 c-9 -11 -10 -15 -1 -15 7 0 9 -4 6 -10 -5 -8 29 -15 38
-8 1 2 13 -5 27 -15 29 -20 61 -24 42 -5 -7 7 -12 20 -12 31 0 10 -4 16 -9 13
-5 -4 -11 -1 -13 5 -6 18 -64 20 -78 4z m30 -5 c0 -5 -2 -10 -4 -10 -3 0 -8 5
-11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z"/>
<path d="M6178 5123 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z"/>
<path d="M637 5079 c-28 -32 -38 -61 -14 -41 12 11 51 72 45 72 -2 0 -16 -14
-31 -31z"/>
<path d="M3645 5100 c3 -6 13 -10 21 -10 8 0 14 -5 14 -11 0 -5 -6 -7 -12 -3
-10 6 -10 5 -1 -8 7 -8 10 -18 6 -21 -3 -4 -1 -7 6 -7 7 0 11 -8 10 -17 -3
-36 1 -63 10 -63 5 0 12 10 14 23 4 21 4 21 6 -3 1 -14 5 -32 11 -40 9 -15 9
-16 24 34 5 16 46 10 46 -6 0 -6 7 -5 16 3 14 11 14 13 -1 21 -8 5 -13 13 -10
18 7 12 -30 32 -40 22 -5 -4 -5 -2 -2 5 4 6 -10 20 -36 33 -59 31 -90 42 -82
30z"/>
<path d="M4160 5090 c-8 -5 -10 -10 -5 -10 6 0 17 5 25 10 8 5 11 10 5 10 -5
0 -17 -5 -25 -10z"/>
<path d="M1418 5083 l-38 -4 0 -73 c0 -41 3 -87 6 -104 6 -29 8 -30 42 -25 63
11 72 26 72 125 0 98 8 90 -82 81z"/>
<path d="M3093 5083 l-33 -4 0 -69 c0 -89 4 -97 40 -92 l30 4 0 84 c0 46 -1
83 -2 82 -2 0 -18 -3 -35 -5z"/>
<path d="M6185 5080 c-16 -7 -17 -9 -3 -9 9 -1 20 4 23 9 7 11 7 11 -20 0z"/>
<path d="M1200 4986 c0 -52 3 -101 6 -110 5 -13 22 -16 85 -16 l79 0 0 110 0
110 -85 0 -85 0 0 -94z"/>
<path d="M2900 5021 c0 -59 1 -61 20 -49 11 7 20 16 20 21 0 4 4 6 9 3 5 -3
14 1 21 9 7 8 25 15 41 15 25 0 29 4 29 28 0 27 -1 27 -70 30 l-70 3 0 -60z"/>
<path d="M9141 5068 c-1 -17 -41 -22 -41 -6 0 4 -7 8 -15 8 -8 0 -15 -5 -15
-12 0 -6 3 -9 6 -6 3 4 17 0 32 -8 30 -15 46 -6 39 22 -4 16 -5 16 -6 2z"/>
<path d="M362 5050 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M6276 5038 c-3 -17 -2 -36 4 -42 7 -7 10 4 10 32 0 50 -5 54 -14 10z"/>
<path d="M660 5040 c-6 -11 -8 -20 -6 -20 3 0 10 9 16 20 6 11 8 20 6 20 -3 0
-10 -9 -16 -20z"/>
<path d="M705 5050 c-8 -13 5 -13 25 0 13 8 13 10 -2 10 -9 0 -20 -4 -23 -10z"/>
<path d="M2367 5039 c4 -13 8 -18 11 -10 2 7 -1 18 -6 23 -8 8 -9 4 -5 -13z"/>
<path d="M2053 5034 c-3 -8 2 -23 11 -32 15 -15 17 -15 32 0 21 21 11 48 -16
48 -11 0 -23 -7 -27 -16z"/>
<path d="M3872 5024 c-7 -8 -9 -14 -3 -14 5 0 7 -8 4 -18 -2 -10 5 -26 18 -37
l22 -20 -6 44 c-6 51 -17 65 -35 45z"/>
<path d="M4323 5026 c4 -10 7 -28 7 -42 0 -15 5 -22 13 -18 15 5 19 34 5 34
-4 0 -8 6 -8 14 0 8 -5 18 -12 22 -8 5 -9 2 -5 -10z"/>
<path d="M5043 5026 c-4 -7 -21 -20 -38 -29 -16 -9 -24 -16 -17 -17 21 0 51
19 62 40 12 22 6 28 -7 6z"/>
<path d="M4067 5000 c-9 -11 -13 -20 -8 -20 11 0 35 29 29 35 -2 2 -12 -4 -21
-15z"/>
<path d="M156 4995 c4 -8 11 -15 16 -15 6 0 5 6 -2 15 -7 8 -14 15 -16 15 -2
0 -1 -7 2 -15z"/>
<path d="M5742 4988 c-64 -32 -164 -143 -145 -162 4 -3 13 -6 21 -6 8 0 21 -8
28 -17 13 -17 13 -17 14 0 0 9 -5 17 -11 17 -6 0 -9 6 -6 13 2 6 10 11 16 10
6 -2 11 3 11 11 0 8 16 17 37 21 25 4 50 20 76 47 21 22 40 38 43 36 2 -3 -3
-22 -12 -43 -12 -30 -13 -39 -3 -46 19 -11 34 4 49 51 14 42 40 55 40 20 0
-11 -6 -36 -14 -54 -12 -29 -19 -34 -62 -40 -27 -4 -57 -7 -66 -7 -12 0 -18
-12 -22 -42 -12 -91 -11 -177 3 -177 12 0 21 39 10 46 -5 3 -9 28 -9 56 l0 51
99 -6 c55 -4 108 -10 118 -13 17 -6 17 -6 1 11 -16 17 -16 19 0 32 9 8 11 11
3 7 -10 -5 -11 -1 -6 15 5 15 2 21 -9 21 -9 0 -16 -4 -16 -10 0 -5 -7 -6 -17
-3 -12 5 -14 3 -8 -8 5 -8 4 -11 0 -6 -22 20 -11 37 36 52 27 9 49 20 49 25 0
26 -22 60 -39 60 -10 0 -33 6 -50 13 -49 21 -128 6 -195 -37 -31 -20 -56 -32
-56 -28 0 10 89 69 133 87 20 8 37 17 37 20 0 9 -42 0 -78 -17z"/>
<path d="M5931 4994 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M9380 4958 c-17 -22 -28 -43 -25 -46 3 -3 6 -3 8 -1 24 34 56 89 52
89 -3 0 -18 -19 -35 -42z"/>
<path d="M0 4970 c0 -19 3 -21 12 -12 9 9 9 15 0 24 -9 9 -12 7 -12 -12z"/>
<path d="M2211 4985 c1 -22 16 -48 22 -38 3 5 0 19 -8 29 -8 10 -14 15 -14 9z"/>
<path d="M4150 4980 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z"/>
<path d="M5590 4974 c0 -8 5 -12 10 -9 6 4 8 11 5 16 -9 14 -15 11 -15 -7z"/>
<path d="M9028 4983 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M9422 4969 c-20 -32 -32 -69 -23 -69 9 0 45 80 39 86 -2 2 -9 -6 -16
-17z"/>
<path d="M4948 4973 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M213 4959 c19 -11 47 -70 47 -99 0 -19 26 -35 35 -20 7 11 -5 40 -17
40 -5 0 -6 5 -2 11 7 12 -53 79 -70 79 -6 0 -3 -5 7 -11z"/>
<path d="M2483 4922 c-1 -36 1 -42 8 -24 4 12 15 22 24 22 8 0 15 4 15 8 0 9
-33 42 -41 42 -2 0 -5 -21 -6 -48z"/>
<path d="M5607 4955 c-10 -7 -17 -21 -15 -29 2 -11 8 -7 20 14 9 17 16 30 15
30 -1 0 -10 -7 -20 -15z"/>
<path d="M40 4941 c0 -7 35 -30 47 -31 6 0 11 8 10 18 -1 14 -9 19 -29 18 -15
-1 -28 -3 -28 -5z"/>
<path d="M5441 4934 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M160 4917 c0 -13 -5 -28 -12 -35 -8 -8 -8 -15 2 -27 25 -30 40 -18
40 35 0 38 -4 50 -15 50 -9 0 -15 -9 -15 -23z"/>
<path d="M3686 4916 c-3 -12 -23 -40 -45 -61 -34 -33 -39 -44 -37 -74 2 -20 5
-35 7 -34 2 1 15 6 30 11 30 12 56 67 62 135 5 49 -6 65 -17 23z"/>
<path d="M4275 4930 c-3 -6 1 -7 9 -4 18 7 21 14 7 14 -6 0 -13 -4 -16 -10z"/>
<path d="M5290 4919 c0 -32 83 -40 100 -10 13 26 1 33 -55 30 -35 -2 -45 -7
-45 -20z"/>
<path d="M9942 4864 l-32 -74 25 -28 c14 -15 25 -39 25 -54 0 -16 5 -28 11
-28 6 0 25 -11 42 -24 37 -28 82 -42 91 -28 3 5 -3 12 -13 15 -20 5 -21 14 -7
55 5 15 1 30 -12 50 -25 35 -82 152 -82 168 0 36 -20 15 -48 -52z"/>
<path d="M5410 4920 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z"/>
<path d="M0 4762 c0 -145 2 -161 20 -182 17 -20 23 -39 19 -66 0 -4 3 -10 8
-13 5 -3 20 -37 34 -76 21 -56 30 -71 49 -73 12 -2 27 2 31 10 6 8 9 9 9 1 0
-6 15 -15 32 -19 18 -3 42 -13 54 -20 11 -8 24 -11 27 -7 4 3 7 2 7 -3 0 -6
16 -27 35 -48 39 -43 46 -40 15 5 -17 23 -19 32 -10 49 25 47 -32 170 -69 151
-11 -6 -23 -4 -36 5 -17 13 -20 12 -32 -8 -10 -19 -12 -20 -13 -5 0 9 -5 16
-12 15 -7 -2 -12 3 -13 9 0 20 -52 63 -75 63 -11 0 -20 -7 -20 -16 0 -9 5 -12
12 -8 7 5 8 3 4 -5 -10 -16 -17 -8 -32 34 -9 28 -9 37 2 46 12 10 11 14 -3 25
-16 11 -15 13 11 20 20 5 31 3 34 -4 2 -7 8 -12 13 -12 6 0 8 4 5 9 -4 5 -1
11 5 13 9 3 9 20 3 63 -7 48 -13 60 -27 59 -9 -1 -17 3 -17 10 0 6 -3 22 -7
36 -6 24 -6 24 14 8 11 -10 24 -18 31 -18 6 0 29 -21 52 -47 39 -44 48 -43 11
1 -16 18 -15 18 18 1 19 -9 30 -20 25 -24 -13 -9 -17 -41 -5 -41 7 0 18 -57
25 -131 2 -17 114 -148 121 -141 5 4 5 2 2 -4 -4 -7 0 -25 8 -40 8 -16 15 -22
15 -14 0 13 1 13 10 0 7 -10 9 42 7 159 -1 138 -5 175 -16 179 -8 3 -11 0 -7
-7 7 -10 -6 -45 -15 -41 -2 1 -16 -1 -31 -5 -21 -5 -28 -13 -28 -32 0 -28 -25
-59 -35 -43 -3 5 -1 10 4 10 6 0 11 7 11 15 0 8 -6 15 -14 15 -11 0 -14 12
-12 53 3 62 -2 86 -15 65 -6 -9 -9 -7 -9 8 0 15 -15 27 -58 47 -32 15 -84 50
-115 78 l-57 51 0 -160z m270 -312 c0 -5 -4 -10 -10 -10 -5 0 -10 5 -10 10 0
6 5 10 10 10 6 0 10 -4 10 -10z m-25 -50 c3 -5 1 -10 -4 -10 -6 0 -11 5 -11
10 0 6 2 10 4 10 3 0 8 -4 11 -10z m78 -55 c4 -8 2 -17 -3 -20 -6 -4 -10 3
-10 14 0 25 6 27 13 6z"/>
<path d="M2151 4913 c-1 -7 8 -17 19 -23 14 -7 20 -7 20 0 0 5 -6 10 -14 10
-8 0 -17 6 -19 13 -4 9 -6 9 -6 0z"/>
<path d="M1880 4892 c-16 -5 -34 -30 -35 -47 0 -5 -19 -11 -42 -13 -30 -2 -43
-8 -43 -18 0 -8 5 -12 10 -9 6 3 10 -4 10 -18 0 -33 25 -51 64 -49 25 2 35 -3
48 -25 17 -28 17 -28 18 50 0 71 -2 77 -21 77 -12 0 -17 4 -14 11 4 6 10 8 13
5 6 -7 32 13 32 24 0 11 -22 18 -40 12z m-70 -82 c0 -5 -4 -10 -10 -10 -5 0
-10 5 -10 10 0 6 5 10 10 10 6 0 10 -4 10 -10z"/>
<path d="M2087 4885 c-15 -11 -16 -13 -2 -19 8 -3 15 -1 15 5 0 6 5 7 10 4 6
-3 10 -2 10 4 0 17 -14 20 -33 6z"/>
<path d="M3410 4890 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z"/>
<path d="M3093 4883 c-24 -3 -33 -9 -33 -23 0 -10 5 -22 10 -25 6 -4 10 -3 9
2 -3 20 2 27 11 13 8 -12 11 -13 19 -1 7 11 9 11 14 0 3 -8 6 -2 6 14 1 15 0
26 -1 25 -2 0 -18 -3 -35 -5z"/>
<path d="M8993 4883 c-7 -2 -13 -9 -13 -14 0 -6 4 -8 9 -5 15 10 21 -22 21
-112 0 -104 7 -132 30 -132 15 0 18 15 24 107 4 59 8 108 9 110 7 7 46 -11 41
-18 -3 -5 -2 -9 3 -8 4 1 16 1 27 0 17 -1 16 -3 -4 -19 l-22 -18 43 -29 c24
-17 53 -34 63 -38 19 -7 19 -7 2 12 -13 15 -15 24 -8 38 17 30 -4 50 -75 73
-38 13 -82 31 -99 41 -17 11 -33 19 -35 18 -2 0 -10 -3 -16 -6z m203 -109 c8
3 14 -1 14 -9 0 -18 -41 -20 -58 -3 -19 19 -14 30 9 18 11 -7 27 -9 35 -6z"/>
<path d="M2200 4873 c0 -8 -14 -13 -34 -13 -19 0 -38 -5 -41 -11 -4 -6 -42 -9
-93 -8 -107 2 -131 -2 -72 -11 l45 -7 -37 -1 -38 -2 0 -54 c0 -52 11 -78 25
-56 3 5 16 10 29 10 12 0 28 6 34 12 10 10 15 10 22 -2 8 -12 10 -10 11 10 1
23 2 23 9 -5 6 -24 8 -17 9 33 1 88 21 79 21 -10 1 -61 3 -70 13 -56 8 10 26
16 50 15 47 -1 53 6 41 52 -9 34 -8 38 6 34 10 -3 17 2 17 11 0 12 -11 16 -41
17 l-41 1 38 8 c45 8 49 11 37 30 -7 10 -10 11 -10 3z"/>
<path d="M2998 4873 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M1235 4831 c-32 -7 -34 -15 -18 -116 5 -33 7 -36 14 -20 7 18 8 18 8
2 1 -16 9 -18 56 -15 30 2 55 7 55 13 0 5 5 3 10 -5 7 -10 10 11 10 68 l0 82
-52 -1 c-29 -1 -66 -4 -83 -8z"/>
<path d="M1390 4764 l0 -77 34 6 c19 3 50 2 70 -3 25 -5 36 -4 37 4 0 6 4 2 9
-9 6 -14 9 5 9 58 1 90 15 95 25 10 l6 -58 53 1 c28 0 57 -4 64 -9 15 -11 33
-1 33 19 0 8 -4 13 -10 9 -5 -3 -7 13 -3 44 l6 50 -34 5 c-19 3 -73 7 -121 9
-69 3 -88 1 -88 -10 0 -7 -4 -13 -10 -13 -5 0 -7 6 -4 14 5 13 -22 26 -58 26
-16 0 -18 -10 -18 -76z m37 60 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2
13 -5z"/>
<path d="M4180 4831 c0 -6 5 -13 10 -16 6 -3 10 1 10 9 0 9 -4 16 -10 16 -5 0
-10 -4 -10 -9z"/>
<path d="M4236 4829 c7 -11 41 -17 54 -9 7 5 -2 9 -23 12 -20 2 -34 1 -31 -3z"/>
<path d="M1733 4795 c0 -22 2 -30 4 -17 2 12 2 30 0 40 -3 9 -5 -1 -4 -23z"/>
<path d="M2244 4814 c3 -9 6 -35 6 -59 0 -43 1 -44 30 -42 16 1 30 6 30 10 0
5 5 5 10 2 6 -4 10 5 10 19 0 14 5 26 10 26 6 0 10 9 10 20 0 11 5 20 10 20 6
0 10 5 10 10 0 6 -29 10 -66 10 -56 0 -65 -2 -60 -16z"/>
<path d="M2463 4823 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z"/>
<path d="M5488 4823 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M2458 4803 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M2731 4794 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M10163 4704 c-82 -29 -107 -58 -45 -52 25 2 36 -1 35 -9 -4 -16 -2
-16 47 3 36 14 40 20 40 50 0 19 -1 34 -2 33 -2 0 -35 -12 -75 -25z m52 -4
c-3 -5 -14 -10 -23 -9 -14 0 -13 2 3 9 27 11 27 11 20 0z"/>
<path d="M9170 4689 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
-5 -10 -11z"/>
<path d="M9278 4668 c5 -5 16 -8 23 -6 8 3 3 7 -10 11 -17 4 -21 3 -13 -5z"/>
<path d="M2256 4655 c7 -16 24 -21 24 -6 0 5 10 12 23 14 14 3 8 5 -15 6 -29
1 -36 -2 -32 -14z"/>
<path d="M1888 4653 c-13 -3 -18 -14 -17 -36 0 -26 2 -28 8 -12 7 16 11 8 18
-35 l11 -55 1 73 c0 39 0 71 -1 71 -2 -1 -11 -3 -20 -6z"/>
<path d="M1930 4615 c0 -22 5 -47 10 -55 8 -12 10 -10 9 10 -1 14 -1 36 1 50
2 21 4 20 10 -10 6 -30 8 -32 15 -15 13 29 36 44 68 45 15 0 27 5 27 11 0 6
-25 9 -70 7 l-70 -3 0 -40z"/>
<path d="M2100 4607 c0 -31 3 -57 8 -57 8 0 7 98 -2 107 -3 4 -6 -19 -6 -50z"/>
<path d="M5783 4653 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z"/>
<path d="M578 4634 c-3 -3 -4 -18 -2 -34 3 -15 0 -31 -5 -35 -7 -3 -9 1 -6 12
3 10 -1 5 -9 -12 -18 -38 -10 -47 15 -16 10 13 19 38 19 57 0 34 -2 39 -12 28z"/>
<path d="M1434 4632 c-48 -3 -51 -4 -46 -27 2 -14 8 -23 12 -20 4 2 34 5 68 6
33 1 67 6 74 10 14 9 3 12 -37 10 -18 -1 -18 0 3 9 12 5 22 11 22 13 0 3 -10
4 -22 3 -13 0 -46 -2 -74 -4z"/>
<path d="M1540 4630 c0 -5 7 -7 15 -4 8 4 15 8 15 10 0 2 -7 4 -15 4 -8 0 -15
-4 -15 -10z"/>
<path d="M5641 4618 c0 -14 2 -28 7 -30 4 -1 14 -16 23 -33 18 -32 78 -69 105
-63 12 2 6 13 -25 45 -28 30 -45 41 -57 36 -12 -4 -15 -3 -10 6 5 7 2 10 -6 9
-7 -2 -12 3 -10 10 1 8 -2 11 -7 8 -5 -4 -12 4 -14 16 -4 21 -4 20 -6 -4z"/>
<path d="M6997 4633 c-9 -2 -15 -8 -12 -13 10 -17 -14 -20 -29 -4 -16 16 -46
13 -46 -5 0 -20 89 -35 97 -15 7 19 23 18 23 -1 0 -9 10 -15 26 -15 14 0 23 4
20 9 -3 5 5 11 19 13 14 3 25 1 25 -3 0 -18 16 -8 17 11 2 17 -4 20 -47 20
-27 0 -54 2 -62 4 -7 2 -21 2 -31 -1z"/>
<path d="M7235 4533 c5 -54 9 -170 10 -258 2 -161 9 -225 25 -225 13 0 18 560
5 568 -5 4 -19 8 -29 9 -18 3 -19 -2 -11 -94z"/>
<path d="M1258 4613 c-25 -3 -38 -9 -38 -19 0 -8 5 -14 10 -14 6 0 10 -14 10
-31 0 -26 3 -30 18 -24 9 4 28 10 42 13 32 6 70 40 70 64 0 19 -18 21 -112 11z"/>
<path d="M9438 4613 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M10196 4604 c-22 -8 -41 -12 -44 -9 -3 3 -11 0 -17 -5 -7 -6 -122
-15 -256 -21 -134 -5 -246 -12 -249 -15 -6 -6 -7 -910 -1 -1181 l4 -181 24 9
c29 11 76 8 85 -5 4 -6 11 -6 20 1 7 6 31 9 52 7 22 -2 45 1 53 7 9 8 17 7 28
-5 13 -12 20 -13 35 -4 17 11 17 13 2 24 -14 10 -13 11 11 7 15 -3 27 -9 27
-14 0 -5 7 -9 16 -9 8 0 13 -4 9 -9 -3 -5 -1 -13 5 -16 6 -4 8 -16 4 -27 -6
-19 18 -47 41 -47 6 0 2 6 -7 13 -19 14 -24 46 -8 46 6 0 15 -10 21 -22 15
-31 104 -98 129 -98 31 0 35 -27 11 -74 -11 -24 -21 -50 -21 -59 0 -40 -17
-20 -28 32 -7 33 -18 64 -26 70 -9 8 -93 12 -266 12 -139 0 -254 -1 -255 -3
-6 -5 42 -279 53 -308 20 -53 91 -90 172 -90 45 0 50 2 50 23 0 15 3 18 9 9 6
-10 18 -2 47 30 39 43 39 43 14 47 -14 2 -80 1 -147 -1 -116 -4 -122 -3 -127
17 -10 41 -38 237 -34 240 5 5 456 10 460 5 3 -3 14 -30 27 -60 l22 -55 -28
-22 c-15 -13 -34 -23 -40 -23 -7 0 -25 -19 -40 -42 -15 -24 -42 -62 -60 -85
-33 -42 -33 -42 -11 -49 13 -4 64 -11 113 -15 85 -7 83 -7 -29 -4 -115 4 -119
4 -152 -21 -23 -18 -42 -25 -58 -22 -24 5 -24 4 7 -26 l32 -31 -104 -3 -104
-3 -128 61 c-191 90 -199 71 -18 -43 16 -11 29 -22 29 -25 0 -14 -165 0 -173
14 -12 21 -74 34 -172 36 -84 1 -86 2 -30 7 l61 6 -1 100 c-1 106 -11 165 -26
165 -5 0 -9 7 -9 16 0 8 -4 13 -9 9 -5 -3 -12 3 -15 12 -4 15 -2 -15 5 -77 1
-8 1 -36 1 -61 -2 -44 -4 -47 -29 -47 -32 0 -59 12 -88 39 -20 18 -21 18 -21
-1 0 -10 3 -17 6 -16 3 2 13 -5 23 -16 14 -15 14 -18 2 -18 -8 0 -15 5 -15 11
0 6 -7 9 -15 5 -8 -3 -15 -1 -15 5 0 7 -10 9 -25 5 -16 -4 -25 -2 -25 5 0 7
-11 9 -30 5 -16 -3 -44 -9 -61 -12 -17 -4 -33 -13 -36 -20 -3 -8 -10 -11 -16
-7 -5 3 -7 1 -4 -4 4 -6 0 -16 -9 -23 -8 -7 -13 -18 -11 -24 8 -21 -32 -59
-63 -60 -17 -1 -30 -5 -30 -9 0 -4 21 -7 48 -6 40 2 52 8 78 37 32 37 54 37
54 1 0 -11 7 -22 16 -26 13 -5 13 -7 2 -14 -10 -7 -9 -9 3 -9 25 0 30 -36 8
-56 -10 -9 -20 -34 -22 -58 -2 -26 -4 -15 -5 31 l-2 71 -37 -4 c-142 -14 -340
-11 -315 5 21 14 23 50 3 70 -23 23 -18 29 24 26 17 -1 41 -3 55 -4 20 -1 22
-3 10 -11 -13 -8 -13 -10 2 -10 9 0 23 -3 32 -6 9 -3 16 -1 16 5 0 6 -5 11
-10 11 -6 0 -20 9 -32 20 -22 20 -22 20 -1 20 22 0 36 31 26 57 -5 13 -20 14
-89 8 -82 -7 -83 -6 -88 17 -5 24 -31 227 -31 241 0 4 111 8 248 10 228 2 247
1 247 -15 0 -9 4 -19 8 -22 5 -3 7 9 5 27 -3 27 -2 29 6 11 15 -35 29 -37 56
-10 14 14 25 22 25 19 0 -6 31 26 57 58 11 13 8 15 -17 11 -17 -2 -30 0 -31 4
-5 51 -3 67 7 71 21 8 54 -17 54 -40 0 -18 2 -19 10 -7 19 29 10 47 -30 63
l-40 15 4 71 c2 39 -1 68 -5 65 -5 -3 -9 0 -9 6 0 6 -4 9 -9 5 -5 -3 -13 0
-17 6 -5 9 2 10 27 5 19 -4 54 -9 79 -11 44 -5 44 -4 10 5 -19 5 -50 12 -69
16 -19 3 -44 10 -57 14 -25 10 -38 -8 -28 -35 5 -11 -3 -17 -25 -21 -17 -4
-31 -13 -31 -20 0 -7 6 -11 14 -8 19 7 23 -2 30 -71 6 -55 5 -57 -7 -28 -6 18
-18 38 -24 45 -10 10 -13 4 -13 -26 0 -30 8 -49 35 -82 39 -47 44 -64 17 -64
-10 0 -23 -5 -29 -11 -8 -8 -97 -13 -272 -17 -144 -3 -261 -8 -261 -11 0 -3 7
-42 15 -86 19 -108 20 -195 1 -195 -8 0 -21 7 -30 15 -9 9 -17 11 -21 5 -9
-14 -25 -12 -25 3 0 6 -11 13 -25 13 -15 1 -25 -3 -25 -12 0 -17 -27 -19 -32
-2 -6 18 -28 0 -28 -23 0 -24 -25 -35 -44 -20 -10 8 -14 81 -18 329 -7 352 -1
532 16 537 6 1 30 8 53 14 52 14 78 54 70 110 -21 148 -30 191 -50 231 l-22
45 -60 0 c-33 0 -66 4 -72 8 -7 5 -13 4 -13 -2 0 -10 -38 -27 -52 -23 -5 1 -8
-2 -8 -8 0 -5 5 -10 11 -10 8 0 9 -15 4 -47 -4 -27 -10 -79 -14 -118 -3 -38
-12 -79 -18 -90 -6 -11 -14 -28 -17 -37 -3 -12 -11 -15 -22 -11 -13 5 -15 2
-10 -15 4 -11 2 -23 -3 -27 -7 -4 -7 -12 1 -25 10 -16 9 -22 -6 -33 -10 -7
-16 -20 -15 -28 2 -7 -2 -29 -10 -46 -12 -30 -17 -33 -56 -33 -31 0 -42 -4
-42 -15 0 -9 6 -14 14 -11 8 3 11 1 8 -4 -3 -6 -17 -10 -30 -10 -22 0 -24 -4
-31 -87 -9 -117 3 -495 19 -557 12 -48 13 -49 70 -66 31 -10 60 -14 63 -9 3 5
8 57 11 115 3 58 9 100 14 92 10 -18 41 -222 37 -246 -2 -14 12 -32 48 -61 29
-23 57 -41 63 -41 6 0 11 -5 11 -12 0 -8 -34 -9 -127 -5 -71 4 -158 7 -195 7
l-68 0 1 38 c0 30 2 33 9 17 7 -17 9 -16 9 10 0 17 -9 50 -20 75 -13 30 -24
86 -31 172 l-12 128 -63 0 -62 0 -11 40 c-13 47 -29 57 -102 66 -50 6 -56 4
-86 -24 -28 -27 -31 -35 -28 -73 3 -24 9 -56 15 -70 5 -15 7 -30 4 -33 -3 -3
2 -18 12 -32 16 -25 16 -28 1 -39 -15 -11 -15 -13 -1 -19 16 -6 21 -53 7 -72
-12 -18 -41 -24 -54 -11 -19 19 -47 27 -54 16 -3 -5 -15 -9 -27 -7 -16 2 -24
-6 -36 -43 -9 -25 -24 -58 -35 -73 -10 -16 -19 -36 -21 -45 -2 -14 -21 -16
-144 -16 l-143 0 -21 30 c-12 17 -41 50 -64 75 l-42 45 23 -70 c18 -54 25
-101 30 -208 4 -87 11 -151 21 -173 8 -20 15 -38 15 -40 0 -5 -60 2 -64 7 -20
28 -126 232 -126 244 0 3 7 5 15 5 9 0 21 12 27 26 10 22 9 28 -14 47 -15 12
-36 41 -47 65 -12 23 -25 43 -29 43 -4 1 -42 3 -85 5 l-77 2 22 -19 c23 -20
23 -20 1 -10 -12 6 -26 11 -32 11 -5 0 -28 -37 -50 -82 -22 -46 -41 -79 -41
-74 0 20 32 130 45 150 10 15 15 68 17 188 l3 167 -75 3 -75 3 -3 30 c-4 41
-21 81 -35 84 -98 15 -137 -5 -137 -70 0 -38 -13 -73 -36 -94 -14 -13 -37
-103 -29 -116 4 -5 1 -9 -4 -9 -12 0 -130 -115 -146 -143 -9 -16 -13 -15 -52
3 -24 10 -43 15 -43 11 0 -4 11 -29 25 -54 16 -32 21 -49 13 -53 -7 -5 -8 -2
-3 6 6 9 4 11 -4 6 -7 -5 -10 -14 -7 -22 3 -8 4 -14 3 -15 -1 0 -46 -3 -99 -6
l-97 -5 -25 56 c-27 61 -41 75 -24 24 6 -19 14 -177 17 -368 5 -231 11 -341
19 -355 6 -11 32 -87 57 -170 80 -262 93 -294 93 -230 0 22 -8 61 -19 87 -10
26 -17 48 -14 48 2 0 -3 19 -11 43 -31 84 -39 195 -36 499 l4 296 71 7 c40 4
106 5 147 3 l75 -3 7 -48 c3 -27 12 -55 19 -63 6 -8 9 -17 6 -21 -4 -3 -9 2
-13 11 -9 23 -24 10 -24 -22 0 -19 -3 -23 -9 -14 -6 10 -11 6 -19 -15 -7 -22
-6 -44 4 -84 8 -29 14 -69 14 -89 l-1 -35 -15 25 -15 25 6 -25 c3 -14 9 -44
12 -68 4 -27 11 -42 20 -42 12 0 14 14 9 78 -5 67 -4 73 7 50 10 -21 16 -24
30 -17 14 8 19 5 26 -13 9 -21 10 -22 10 -2 1 11 7 29 15 39 13 18 15 17 33
-19 l20 -38 21 36 c16 27 28 36 47 36 64 0 111 21 146 65 19 24 37 44 42 45 9
0 9 -34 0 -44 -11 -11 -16 -38 -17 -96 -1 -30 -5 -61 -9 -67 -5 -7 -5 -17 -2
-23 3 -5 -2 -10 -12 -10 -38 0 -79 -38 -114 -105 -18 -37 -42 -73 -52 -80 -17
-12 -16 -14 8 -44 32 -37 63 -40 92 -8 17 18 64 91 121 190 11 19 12 4 8 -98
-3 -66 -3 -113 0 -104 9 30 56 41 179 45 l120 3 -109 -9 c-121 -9 -146 -21
-177 -80 -11 -21 -19 -28 -19 -17 0 20 -1 20 -300 21 l-205 1 -55 112 c-49
101 -80 152 -66 113 44 -128 54 -192 60 -360 5 -146 4 -180 -9 -204 -14 -26
-14 -36 1 -105 10 -42 17 -88 16 -104 -1 -15 3 -27 8 -27 6 0 10 104 10 269 0
149 4 272 9 275 4 3 14 -7 22 -22 11 -21 15 -118 19 -467 l5 -440 31 -50 c18
-28 44 -79 60 -115 15 -36 34 -72 41 -81 7 -8 13 -20 13 -25 0 -5 9 -15 19
-21 37 -23 32 15 -15 122 -26 58 -54 115 -64 128 -16 20 -18 61 -21 467 l-4
445 185 3 c207 3 227 0 191 -27 -22 -17 -24 -24 -18 -75 5 -50 3 -60 -19 -85
-13 -16 -24 -33 -24 -39 0 -5 16 -34 36 -63 35 -52 35 -53 7 -26 l-29 27 -27
-187 c-30 -213 -49 -374 -45 -378 2 -2 10 2 18 8 32 24 101 426 83 474 -4 10
-1 14 7 11 7 -2 14 -19 15 -36 2 -18 6 -36 10 -40 5 -4 5 3 2 16 -6 25 5 29
23 7 8 -9 13 -54 15 -116 2 -55 6 -103 9 -106 3 -3 12 0 20 6 8 7 21 9 27 5 9
-5 5 -10 -12 -17 -15 -6 -19 -11 -11 -14 19 -7 40 14 47 47 5 22 13 30 33 32
25 3 27 6 24 43 -1 22 -5 52 -8 67 -5 26 -3 28 29 28 l35 0 -4 -53 c-4 -50 11
-98 23 -69 7 17 24 15 17 -2 -3 -7 2 -16 11 -20 9 -3 13 -2 10 4 -5 9 14 15
37 11 4 0 10 8 13 19 4 11 11 20 16 20 6 0 7 9 4 20 -9 27 3 60 21 60 8 0 14
-8 14 -17 1 -17 1 -17 11 0 5 9 19 17 29 17 11 0 20 7 20 15 0 22 57 20 69 -2
8 -17 30 -164 66 -462 9 -68 21 -133 27 -145 13 -25 73 -101 107 -136 22 -23
23 -24 12 -3 -6 13 -16 23 -21 23 -6 0 -10 5 -10 11 0 6 -14 31 -32 56 -17 26
-31 54 -31 62 0 9 -6 43 -13 76 -8 33 -14 79 -14 102 0 23 -4 44 -9 47 -4 3
-9 45 -9 93 -2 174 -35 308 -81 332 -20 11 -21 20 -21 134 l0 123 31 11 c22 9
36 24 52 62 l21 51 88 0 88 0 0 -44 c0 -25 5 -48 10 -51 6 -4 10 15 10 49 l0
56 34 0 c33 0 33 -1 40 -53 3 -28 6 -116 6 -195 l0 -142 -35 -17 c-26 -12 -36
-25 -41 -49 -4 -23 -10 -31 -22 -27 -10 2 -27 -5 -39 -16 -19 -18 -21 -28 -16
-85 3 -36 1 -66 -5 -70 -5 -3 -9 26 -8 74 1 45 -3 75 -8 70 -18 -18 -27 -101
-33 -296 l-6 -202 43 -46 c28 -31 51 -46 64 -45 12 1 28 0 36 -3 128 -47 141
-48 135 -17 -3 17 -2 19 10 9 8 -7 12 -16 9 -21 -3 -5 6 -9 20 -9 13 0 27 6
29 13 4 9 6 9 6 0 1 -8 14 -13 31 -13 23 0 31 5 36 25 5 21 9 23 27 13 16 -8
22 -8 25 1 2 6 9 8 15 4 7 -4 5 2 -3 12 -11 14 -11 17 -1 11 29 -18 1 483 -28
516 -4 5 -6 -7 -4 -25 5 -64 10 -437 5 -433 -2 3 -8 111 -12 241 -6 193 -10
239 -23 252 -8 8 -41 19 -74 23 -32 4 -48 8 -37 9 17 1 20 6 17 25 -6 30 -38
66 -59 66 -11 0 -12 4 -5 19 6 10 11 97 12 194 2 170 3 176 23 179 17 2 21 10
21 38 l0 35 -100 6 c-55 4 -144 7 -198 8 -89 1 -96 2 -89 18 46 93 46 92 34
144 -9 36 -9 91 -2 197 5 81 8 193 7 249 -1 56 2 105 6 109 5 5 82 9 172 9
l163 0 6 -35 c10 -59 7 -70 -14 -70 -28 0 -90 -33 -117 -62 -21 -23 -40 -81
-69 -208 -17 -78 -17 -90 -3 -90 5 0 7 4 4 10 -8 13 32 177 47 194 10 11 23 8
69 -17 64 -34 74 -55 63 -138 -4 -30 -2 -49 5 -53 12 -8 14 -4 27 59 7 30 15
41 34 45 24 6 24 6 5 17 -34 19 -9 26 69 18 l75 -7 6 -46 c4 -26 14 -66 22
-89 20 -53 81 -126 100 -119 8 3 11 2 8 -3 -9 -15 14 -24 69 -28 138 -9 128
-6 143 -54 7 -24 13 -45 13 -46 0 -2 -84 -3 -187 -3 l-188 0 -127 124 c-131
127 -149 135 -108 45 19 -43 187 -210 253 -252 27 -18 28 -21 22 -75 -3 -31
-8 -222 -11 -424 l-6 -366 43 -27 c24 -15 91 -77 149 -138 64 -66 111 -108
120 -105 9 3 -20 41 -89 116 -57 62 -107 112 -112 112 -5 0 -15 12 -23 27 -18
36 -24 344 -12 650 l9 223 156 0 156 0 -40 -19 c-69 -32 -80 -52 -79 -145 2
-120 65 -444 109 -558 5 -14 2 -18 -13 -18 -11 0 -22 7 -26 15 -13 36 -106 -6
-106 -47 0 -24 60 -85 123 -126 74 -48 205 -167 287 -259 62 -71 81 -77 25 -8
-21 25 -35 48 -32 52 4 3 -27 43 -68 88 -41 45 -75 86 -75 90 0 4 -8 13 -17
20 -14 10 -15 17 -6 36 10 24 11 24 20 -10 11 -42 38 -57 31 -17 -6 32 -1 33
43 1 74 -55 109 -107 109 -162 0 -42 15 -58 26 -28 4 8 12 15 18 15 7 0 77
-65 156 -145 79 -80 150 -145 156 -145 7 0 16 -5 20 -12 5 -7 3 -8 -6 -3 -9 5
-11 4 -6 -4 6 -9 11 -9 21 -1 8 7 20 8 26 4 8 -4 9 -3 5 4 -4 7 -2 12 3 12 6
0 11 -5 11 -11 0 -11 58 -7 94 7 11 4 16 0 17 -12 0 -12 3 -14 6 -6 5 14 -33
62 -50 62 -5 0 -15 6 -21 14 -6 8 -60 55 -119 105 -60 50 -154 131 -208 179
l-100 87 4 125 c3 69 3 114 0 100 -2 -14 -8 -38 -13 -55 -5 -16 -12 -55 -16
-85 -7 -60 -14 -79 -14 -37 0 15 -12 38 -30 56 -20 20 -30 39 -30 58 1 15 -2
78 -6 138 -5 83 -12 123 -30 162 -13 28 -26 75 -30 102 -9 72 -33 63 -35 -12
-1 -21 -5 -10 -14 33 -7 36 -12 66 -10 68 5 5 140 -81 170 -110 17 -15 36 -28
42 -28 23 0 31 -25 23 -70 -9 -49 -2 -113 11 -104 5 3 9 26 10 52 0 26 3 65 7
87 l7 40 110 -4 c103 -3 111 -5 132 -29 11 -14 23 -40 25 -58 5 -39 11 -37
-157 -52 l-100 -10 120 2 120 1 9 -62 c5 -35 13 -63 17 -63 4 0 3 -15 -2 -32
-5 -18 -9 -51 -9 -74 0 -37 5 -46 48 -83 26 -24 91 -85 144 -137 71 -69 103
-94 122 -94 15 0 26 -6 26 -14 0 -14 77 -39 92 -30 10 6 -39 47 -61 52 -9 1
-27 3 -40 4 -21 0 -22 2 -7 10 10 5 24 7 32 4 18 -7 18 -1 0 27 -7 12 -19 55
-25 96 -16 103 -86 391 -118 484 -25 72 -53 118 -80 128 -7 3 -7 24 -2 64 5
33 12 86 15 118 5 48 8 57 25 57 28 0 66 44 73 85 l7 35 73 0 74 0 -6 -45 c-3
-30 -1 -45 7 -45 6 0 11 18 11 44 0 43 1 44 37 51 42 8 52 18 54 55 1 18 3 20
6 7 3 -10 16 -22 29 -27 l24 -10 0 -439 0 -439 73 -40 c40 -22 79 -48 87 -57
7 -9 33 -28 57 -42 24 -14 40 -30 36 -35 -3 -7 -1 -8 5 -4 7 4 12 2 12 -4 0
-17 26 -40 44 -40 21 0 20 7 -5 33 -12 12 -19 15 -15 7 4 -8 -1 -4 -11 10 -10
14 -33 42 -51 62 -19 21 -31 42 -27 49 12 19 25 161 18 203 -10 64 -21 17 -22
-92 -1 -71 -4 -94 -16 -98 -23 -9 -83 15 -104 43 -20 24 -20 41 -19 473 l1
448 54 -40 c51 -39 53 -42 53 -89 0 -26 4 -92 10 -146 5 -54 11 -137 13 -184
3 -57 9 -94 19 -108 14 -20 17 -21 20 -5 1 9 0 58 -4 108 -3 50 -7 160 -7 244
l-1 152 173 0 c94 0 209 3 255 7 59 4 82 3 82 -6 0 -7 -22 -11 -62 -11 -76 0
-129 -14 -151 -38 -24 -26 -37 -106 -25 -150 5 -19 22 -53 36 -75 18 -27 27
-55 29 -91 1 -29 14 -84 28 -122 14 -38 28 -82 31 -99 3 -16 7 -35 9 -41 2 -6
0 -15 -3 -20 -13 -18 -87 -72 -130 -93 -24 -12 -46 -29 -49 -38 -11 -28 26
-78 75 -102 26 -13 81 -43 123 -67 77 -45 99 -52 99 -33 0 5 -4 8 -8 5 -4 -2
-7 8 -6 22 1 15 -2 32 -6 37 -4 6 -6 24 -6 40 1 17 -3 34 -9 38 -7 6 -7 10 1
13 13 5 0 131 -22 216 -8 33 -17 89 -20 126 -3 37 -7 81 -9 99 l-3 31 61 -33
62 -32 0 -59 c1 -70 -7 -91 -37 -97 -20 -4 -19 -4 5 -6 21 -1 27 -6 26 -23 0
-22 -1 -22 -9 -3 -5 12 -8 -49 -8 -155 0 -109 5 -182 12 -194 18 -32 49 -66
59 -66 14 0 101 -44 105 -52 8 -18 20 -6 15 15 -9 35 -22 46 -94 82 l-67 34 4
138 c2 76 7 157 10 181 l5 43 145 -2 c80 0 148 2 151 5 4 3 -62 6 -146 6
l-153 0 7 53 c11 89 5 84 113 89 55 3 102 1 110 -5 6 -5 12 -21 12 -36 0 -20
2 -23 10 -11 5 8 10 26 10 38 0 15 7 26 20 29 19 5 20 14 20 209 l0 203 -42 4
-43 4 43 1 42 2 0 743 0 742 -33 19 c-17 10 -46 27 -64 37 -17 10 -50 23 -72
29 -51 13 -165 82 -212 127 -20 19 -45 54 -54 76 -10 23 -24 59 -33 80 -18 44
-10 58 18 32 19 -18 57 -14 45 5 -4 6 8 11 27 11 27 1 29 3 8 6 -14 3 -29 9
-35 14 -6 6 3 7 24 3 23 -5 36 -3 41 7 7 11 13 11 37 -1 32 -16 86 -70 78 -79
-4 -3 -10 1 -15 8 -4 8 -15 11 -23 8 -11 -4 -14 -1 -11 7 6 17 -20 39 -42 34
-10 -2 -19 -9 -22 -17 -3 -8 0 -11 6 -7 6 3 14 0 19 -7 4 -8 18 -19 29 -25 30
-16 104 -31 104 -22 0 11 49 19 56 9 3 -5 1 -9 -5 -9 -6 0 -20 -18 -31 -40
-23 -45 -21 -47 18 -23 27 16 27 16 7 -4 -11 -11 -43 -25 -70 -32 -54 -13 -91
-5 -150 31 -101 61 -47 -32 69 -118 85 -64 108 -61 207 23 65 54 79 71 79 95
0 18 -5 28 -14 28 -16 0 -50 43 -60 76 -4 14 -2 21 8 21 8 0 12 -6 9 -12 -2
-7 8 -22 24 -35 18 -14 29 -17 31 -10 3 7 -2 16 -9 21 -10 6 -11 9 -1 9 6 0
12 9 12 20 0 11 -7 20 -15 20 -9 0 -12 6 -8 16 5 13 7 13 14 2 5 -8 9 14 9 54
0 56 -3 66 -15 62 -9 -4 -15 0 -15 9 0 17 -40 31 -53 18 -5 -5 -7 -19 -5 -32
3 -21 4 -22 18 -8 13 14 16 15 26 1 17 -23 5 -57 -26 -75 -26 -16 -28 -16 -34
0 -7 18 12 35 29 26 5 -4 3 2 -6 13 -14 17 -49 100 -49 117 0 16 78 6 104 -14
l26 -20 0 51 c0 49 -2 53 -52 100 -29 27 -59 49 -65 50 -19 0 -16 11 9 37 12
13 17 23 11 23 -6 0 -14 -6 -16 -12 -4 -10 -6 -10 -6 -1 -1 6 8 18 19 26 24
17 76 15 72 -2 -1 -7 2 -10 7 -7 5 4 12 -2 15 -11 2 -10 4 10 3 45 -1 36 -6
61 -12 60 -5 -2 -9 -12 -7 -23 2 -16 0 -17 -7 -6 -8 13 -12 13 -27 0 -16 -13
-17 -12 -10 14 3 15 9 48 13 73 4 30 9 41 14 32 15 -22 9 6 -6 32 -23 41 -19
53 15 47 39 -8 39 9 0 18 -38 8 -46 21 -21 35 13 7 22 7 26 0 9 -15 25 -12 25
6 0 8 -4 13 -9 9 -5 -3 -12 -1 -15 4 -3 5 0 11 8 14 11 4 14 27 14 91 l1 86
-30 0 c-26 0 -29 -3 -24 -20 4 -11 2 -20 -4 -20 -10 0 -12 6 -15 50 -1 8 -4
20 -7 25 -10 14 11 29 46 33 34 4 39 7 34 20 -2 5 -21 3 -43 -4z m34 -139 c0
-8 -4 -17 -10 -20 -6 -3 -9 4 -8 19 2 25 18 26 18 1z m-139 -85 c26 -14 24
-28 -3 -26 -13 1 -24 9 -26 19 -4 20 2 21 29 7z m136 -22 c-3 -7 -5 -2 -5 12
0 14 2 19 5 13 2 -7 2 -19 0 -25z m-152 -38 c-3 -5 -14 -10 -23 -10 -15 0 -15
2 -2 10 20 13 33 13 25 0z m-73 -148 c-18 -10 -51 -35 -72 -56 -39 -38 -110
-137 -110 -153 0 -4 5 -1 10 7 9 13 11 13 20 0 7 -11 10 -11 10 -2 0 7 5 10
10 7 8 -5 7 -11 -1 -21 -6 -8 -9 -17 -7 -20 3 -3 50 -8 104 -10 152 -9 157 -9
161 -20 2 -7 -21 -12 -59 -13 -92 -3 -102 -5 -113 -18 -16 -19 -99 7 -131 42
-15 17 -32 29 -36 28 -12 -4 -10 1 18 64 14 32 43 81 66 108 27 34 16 25 -36
-28 -42 -43 -76 -83 -77 -90 0 -9 -2 -9 -6 1 -2 6 -9 10 -14 6 -5 -3 -9 16
-10 43 -1 72 -17 24 -19 -57 -1 -46 -4 -59 -10 -45 -11 25 -12 176 -2 191 16
25 58 35 153 38 55 2 103 7 106 10 4 3 22 6 42 6 l36 -1 -33 -17z m-12 -70 c0
-10 -6 -24 -12 -32 -11 -12 -10 -12 5 -1 9 7 17 19 17 27 0 12 37 30 46 21 2
-2 -14 -21 -36 -41 -22 -20 -40 -40 -40 -46 0 -5 -8 -10 -18 -10 -10 0 -23 -5
-30 -12 -27 -27 -11 30 20 70 35 46 48 52 48 24z m-186 -237 c-3 -8 -1 -29 5
-46 14 -41 10 -45 -20 -20 -18 15 -20 20 -8 21 12 0 14 8 11 30 -2 18 0 30 7
30 6 0 8 -7 5 -15z m-81 -34 c25 3 38 -1 32 -11 -3 -5 -15 -10 -25 -10 -10 0
-21 -8 -23 -17 -3 -10 -5 2 -5 27 0 25 2 37 5 27 2 -10 10 -17 16 -16z m195 3
c5 3 18 -1 28 -9 17 -13 18 -14 2 -15 -10 0 -18 -7 -18 -15 0 -13 9 -15 49 -9
40 5 49 3 55 -11 3 -9 3 -22 -1 -27 -4 -7 -1 -8 6 -3 9 5 12 2 9 -11 -4 -23
-64 -64 -93 -64 -22 0 -65 38 -69 61 -1 8 -7 24 -14 36 -13 23 -16 75 -5 86 3
4 14 0 24 -9 10 -9 22 -13 27 -10z m-138 -79 c7 -9 10 -18 7 -22 -8 -7 -37 15
-37 28 0 14 16 11 30 -6z m-40 -31 c0 -8 -5 -12 -10 -9 -6 4 -8 11 -5 16 9 14
15 11 15 -7z m357 -29 c-6 -34 -39 -74 -63 -75 -7 0 -15 -8 -18 -17 -5 -13 -9
-14 -19 -4 -9 10 -5 18 21 39 18 15 32 30 32 34 0 22 22 58 36 58 13 0 16 -7
11 -35z m-317 4 c0 -5 -4 -9 -10 -9 -5 0 -10 7 -10 16 0 8 5 12 10 9 6 -3 10
-10 10 -16z m-62 -28 c3 -8 -1 -12 -9 -9 -7 2 -15 10 -17 17 -3 8 1 12 9 9 7
-2 15 -10 17 -17z m189 -47 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13
-5z m-98 -54 c-7 -5 -19 -6 -26 -3 -11 5 -12 8 -2 13 7 5 19 6 26 3 11 -5 12
-8 2 -13z m268 -47 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z
m-32 -13 c3 -5 1 -10 -4 -10 -6 0 -11 5 -11 10 0 6 2 10 4 10 3 0 8 -4 11 -10z
m115 -52 c0 -26 -57 -88 -79 -87 -11 0 -9 3 5 9 12 5 28 22 35 39 7 16 16 28
20 25 4 -2 5 5 2 16 -3 11 0 20 6 20 6 0 11 -10 11 -22z m40 -24 c0 -9 -64
-64 -74 -64 -6 0 5 16 24 35 31 32 50 43 50 29z m-405 -104 c11 -12 25 -18 34
-15 16 6 151 -54 151 -67 0 -7 39 -26 85 -43 13 -5 15 -9 7 -12 -6 -3 -49 14
-95 36 -51 25 -92 39 -109 37 -16 -2 -28 0 -28 5 0 5 -7 5 -17 2 -11 -4 -14
-3 -9 5 5 8 -1 12 -17 12 -14 0 -30 7 -37 15 -7 8 -9 15 -5 15 4 0 2 7 -5 15
-20 24 23 19 45 -5z m-68 -31 c6 -6 26 -15 45 -20 32 -8 31 -8 -12 -7 -25 1
-52 -2 -59 -6 -17 -11 -21 -4 -14 22 6 24 23 28 40 11z m-664 -19 c3 -11 1
-23 -4 -26 -5 -3 -9 6 -9 20 0 31 6 34 13 6z m790 -45 c-3 -9 -8 -14 -10 -11
-3 3 -2 9 2 15 9 16 15 13 8 -4z m-3463 -395 c0 -106 -12 -143 -26 -82 -9 37
-32 82 -60 115 -40 48 -33 65 29 70 28 2 53 4 55 5 1 1 2 -47 2 -108z m1316
-4 c9 -100 1 -137 -12 -55 -4 22 -12 39 -20 39 -7 0 -20 7 -28 16 -21 20 -21
41 -1 24 13 -11 14 -10 9 4 -3 9 -11 16 -18 16 -18 0 -33 14 -40 38 -7 21 -5
22 47 22 l54 0 9 -104z m-1636 -6 c-19 -13 -30 -13 -30 0 0 6 10 10 23 10 18
0 19 -2 7 -10z m1370 -26 c0 -8 -5 -12 -10 -9 -6 4 -8 11 -5 16 9 14 15 11 15
-7z m750 -129 c0 -13 6 -25 13 -28 6 -2 10 -7 7 -9 -3 -3 -17 2 -31 11 -22 13
-25 20 -18 39 11 28 29 20 29 -13z m1685 15 c-3 -5 -10 -10 -16 -10 -5 0 -9 5
-9 10 0 6 7 10 16 10 8 0 12 -4 9 -10z m-1705 -75 c0 -8 -9 -15 -20 -15 -22 0
-27 15 -7 23 21 9 27 7 27 -8z m-2233 -17 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13
3 -3 4 -12 1 -19z m3966 -28 c-3 -11 -9 -20 -14 -20 -10 0 -12 24 -2 33 13 13
21 7 16 -13z m-842 -1 c-25 -5 -49 -13 -55 -19 -5 -5 -15 -10 -20 -10 -6 1 0
10 13 20 15 14 37 20 65 19 l41 -1 -44 -9z m-3088 -26 c-7 -2 -19 -2 -25 0 -7
3 -2 5 12 5 14 0 19 -2 13 -5z m3929 -35 c8 -18 14 -43 13 -55 -1 -19 5 -23
42 -29 23 -3 40 -10 37 -16 -3 -5 -14 -6 -24 -3 -15 5 -17 2 -13 -15 4 -14 -3
-28 -23 -45 l-29 -25 25 -24 c14 -14 50 -33 80 -43 39 -13 58 -25 67 -43 15
-33 23 -121 10 -113 -6 4 -7 -11 -3 -41 8 -54 -4 -76 -60 -102 -24 -12 -38
-13 -52 -5 -11 6 -23 7 -26 3 -4 -4 -5 5 -1 21 10 37 -3 35 -17 -3 -9 -29 -11
-29 -24 -13 -9 12 -13 13 -14 5 0 -18 -68 -45 -102 -40 -15 3 -28 1 -28 -4 0
-4 -11 -18 -25 -30 -14 -12 -25 -27 -25 -34 0 -14 -46 -24 -82 -17 -26 5 -48
33 -26 33 6 0 9 3 5 6 -3 3 -2 16 3 29 6 16 3 34 -12 65 l-21 43 -154 -5
c-107 -4 -155 -2 -161 6 -5 6 -12 38 -15 71 -4 33 -15 112 -25 177 l-18 116
325 -1 325 -2 8 -45 c13 -73 28 -120 38 -120 18 0 16 48 -6 143 l-16 67 -72 0
c-82 0 -118 8 -113 24 2 7 34 11 83 12 l79 1 3 29 c6 64 20 71 44 22z m-2967
-59 c3 -15 5 -118 3 -230 -3 -173 -5 -199 -15 -170 -6 19 -16 37 -21 40 -16
10 -32 108 -41 246 -5 72 -12 142 -16 156 l-7 27 46 -22 c33 -15 47 -28 51
-47z m1265 45 c6 -14 10 -41 10 -61 0 -34 -1 -35 -32 -29 -18 4 -41 7 -50 7
-25 0 -22 16 7 44 13 14 20 25 15 25 -6 0 -2 9 7 20 23 26 32 25 43 -6z
m-2571 -289 c1 -171 -3 -255 -9 -245 -6 9 -9 125 -9 280 0 157 4 257 9 245 5
-11 9 -137 9 -280z m3679 258 c2 -8 -5 -13 -17 -13 -12 0 -21 6 -21 16 0 18
31 15 38 -3z m262 0 c0 -34 -16 -42 -103 -49 -84 -7 -87 -6 -87 15 0 19 6 21
53 22 28 0 68 6 87 13 48 18 50 18 50 -1z m87 4 c0 -1 3 -11 5 -22 2 -16 -3
-21 -28 -23 -25 -2 -33 1 -37 19 -8 32 1 42 32 34 14 -4 27 -7 28 -8z m-832
-5 c42 -6 51 -11 53 -29 3 -20 -1 -23 -30 -23 -86 0 -168 -49 -168 -100 0 -30
30 -74 52 -76 49 -4 49 -3 37 -22 -9 -15 -8 -34 3 -85 8 -37 14 -67 12 -67 -2
0 -15 21 -28 48 -14 26 -35 58 -47 72 -11 14 -18 20 -15 14 3 -7 3 -26 0 -42
-8 -38 -58 -61 -143 -64 -33 -2 -57 -6 -55 -9 2 -4 -5 -14 -16 -24 -11 -10
-20 -14 -20 -9 0 5 -4 3 -8 -4 -11 -16 -140 -52 -161 -44 -9 3 -23 14 -33 24
-16 19 -16 19 -23 -2 -6 -20 -8 -20 -19 -4 -11 15 -14 15 -19 1 -3 -8 -22 -20
-41 -27 -20 -6 -36 -18 -36 -25 0 -16 -44 -23 -83 -13 -25 6 -29 3 -42 -25 -7
-18 -16 -40 -19 -51 -5 -15 -9 -16 -22 -5 -16 13 -25 6 -37 -26 -3 -5 -7 -7
-11 -4 -8 8 42 84 55 84 27 0 39 69 14 79 -21 8 -45 -3 -45 -21 0 -10 -9 -14
-32 -12 -22 2 -32 -1 -31 -9 6 -25 -13 -11 -24 18 l-12 31 -115 -7 c-115 -7
-115 -7 -124 17 -9 23 -37 215 -45 312 l-5 47 283 0 c155 0 303 -3 328 -6 43
-6 47 -9 53 -40 7 -41 24 -55 24 -21 0 20 5 24 33 24 17 0 59 7 92 15 33 7 72
13 87 13 24 -1 26 2 21 26 -3 15 0 35 6 46 9 15 10 11 11 -23 0 -33 4 -43 20
-47 17 -4 20 0 20 33 0 71 -1 70 134 69 66 0 144 -4 171 -7z m-845 -32 c0 -6
-40 -10 -100 -10 -60 0 -100 4 -100 10 0 6 40 10 100 10 60 0 100 -4 100 -10z
m75 0 c3 -5 1 -10 -4 -10 -6 0 -11 5 -11 10 0 6 2 10 4 10 3 0 8 -4 11 -10z
m-646 -141 c-7 -35 -14 -58 -17 -51 -4 14 18 125 25 119 2 -3 -1 -34 -8 -68z
m-1079 56 c0 -15 -51 -36 -72 -29 -20 7 -18 9 22 20 25 7 46 12 48 13 1 1 2
-1 2 -4z m-199 -14 c-7 -5 -17 -15 -22 -22 -6 -10 -9 -8 -9 9 0 16 6 22 23 22
16 0 18 -3 8 -9z m2649 -79 c-12 -4 -70 20 -70 30 0 3 18 -1 40 -10 21 -9 35
-19 30 -20z m85 -67 c65 -27 63 -34 -4 -10 -23 8 -39 10 -36 6 3 -5 30 -17 60
-26 52 -17 55 -19 55 -51 0 -49 17 -51 25 -3 5 28 10 37 15 28 7 -10 12 -10
22 -1 9 7 33 9 67 5 32 -4 47 -9 39 -14 -26 -16 0 -19 31 -3 25 13 30 19 20
26 -10 6 -7 8 11 6 33 -4 43 -48 10 -48 -12 0 -41 -5 -66 -11 -44 -11 -45 -13
-38 -43 3 -17 10 -35 15 -41 15 -15 43 8 49 41 3 20 12 30 26 32 17 2 26 -10
54 -72 28 -65 40 -80 84 -110 61 -41 63 -42 195 -60 92 -13 107 -18 135 -45
18 -17 42 -31 53 -31 12 0 25 -4 28 -10 4 -7 -71 -10 -219 -10 l-225 0 -53 32
c-29 17 -89 55 -133 83 -80 52 -225 128 -232 122 -2 -2 10 -22 26 -44 34 -47
176 -151 226 -164 19 -6 35 -13 35 -17 0 -4 -69 -9 -153 -10 -124 -3 -150 -1
-139 9 21 22 14 121 -15 211 -23 73 -47 248 -33 248 3 0 32 -11 65 -25z
m-1985 -353 c0 -8 10 -22 23 -32 22 -19 21 -19 -27 -5 -27 8 -60 15 -73 15
-27 0 -29 18 -12 118 l11 65 39 -74 c22 -41 39 -80 39 -87z m830 85 c0 -7 -6
-21 -13 -31 -12 -16 -13 -16 -13 3 0 11 4 17 8 15 4 -3 8 2 8 10 0 9 2 16 5
16 3 0 5 -6 5 -13z m-977 -104 c-7 -2 -19 -2 -25 0 -7 3 -2 5 12 5 14 0 19 -2
13 -5z m1817 -3 c-96 -4 -176 -8 -177 -9 -2 0 -22 -18 -45 -38 -24 -22 -37
-30 -31 -18 17 31 56 63 83 68 14 2 97 4 185 4 l160 -1 -175 -6z m1635 1 c34
-7 26 -9 -47 -10 -88 -1 -120 -9 -170 -44 -16 -10 -28 -14 -28 -8 0 5 5 13 10
16 6 4 8 11 4 16 -3 5 -2 9 3 8 4 -1 19 2 33 8 55 23 125 28 195 14z m-2005
-41 c0 -34 -3 -40 -20 -40 -31 0 -36 28 -9 54 13 13 25 24 27 25 1 1 2 -17 2
-39z m1700 5 c0 -28 -4 -35 -20 -35 -23 0 -25 9 -8 45 16 35 28 31 28 -10z
m-1702 -142 c-1 -49 -3 -69 -5 -47 -4 41 -4 41 -56 52 l-52 11 53 -2 52 -2 0
38 c0 20 2 37 5 37 3 0 4 -39 3 -87z m-1635 23 c3 -8 -2 -16 -14 -19 -11 -3
-19 0 -19 7 0 26 24 35 33 12z m1895 2 c-7 -19 -38 -22 -38 -4 0 10 9 16 21
16 12 0 19 -5 17 -12z m280 0 c-3 -7 -13 -13 -23 -13 -10 0 -20 6 -22 13 -3 7
5 12 22 12 17 0 25 -5 23 -12z m-1883 -8 c8 -13 -25 -13 -45 0 -12 8 -9 10 12
10 15 0 30 -4 33 -10z m1725 0 c0 -5 -14 -10 -31 -10 -17 0 -28 4 -24 10 3 6
17 10 31 10 13 0 24 -4 24 -10z m78 3 c-10 -2 -28 -2 -40 0 -13 2 -5 4 17 4
22 1 32 -1 23 -4z m1452 -2 c0 -18 -18 -21 -30 -6 -10 13 -9 15 9 15 11 0 21
-4 21 -9z m-3432 -8 c-10 -2 -28 -2 -40 0 -13 2 -5 4 17 4 22 1 32 -1 23 -4z
m1728 -235 c-14 -82 -42 -158 -58 -158 -4 0 -8 5 -8 10 0 6 4 10 9 10 5 0 22
52 36 116 15 63 29 113 32 111 2 -3 -3 -43 -11 -89z m284 -102 c0 -2 -7 -9
-15 -16 -13 -11 -14 -10 -9 4 5 14 24 23 24 12z m1317 -41 c-4 -8 -11 -15 -17
-15 -6 0 -6 7 2 20 14 22 24 19 15 -5z m-1680 -1 c-3 -3 -12 -4 -19 -1 -8 3
-5 6 6 6 11 1 17 -2 13 -5z m412 -43 c10 -10 26 -39 36 -65 10 -25 21 -46 25
-46 4 0 5 -11 2 -25 -3 -18 0 -25 11 -25 17 0 29 -51 22 -91 -4 -23 44 -244
59 -267 3 -5 9 -34 14 -65 15 -92 7 -89 -201 93 -68 59 -90 89 -62 83 8 -2 9
21 4 75 -13 125 -10 335 4 344 22 14 67 8 86 -11z m37 -5 c8 -14 17 -40 20
-58 2 -18 1 -26 -2 -18 -4 8 -15 34 -25 58 -20 47 -18 54 7 18z m-1471 -16
l16 -30 -58 6 c-32 4 -59 8 -60 8 -2 1 4 12 13 24 23 34 70 30 89 -8z m785
-77 c-11 -17 -11 -17 -6 0 3 10 7 28 7 40 2 22 2 22 6 0 2 -12 -1 -30 -7 -40z
m-694 -21 l1 -42 -4 40 -4 39 -87 4 -87 3 90 0 90 -1 1 -43z m-1089 -84 c-2
-13 -4 -5 -4 17 -1 22 1 32 4 23 2 -10 2 -28 0 -40z m1727 -89 c-4 -35 -9 -58
-12 -51 -5 16 8 126 14 119 3 -3 2 -33 -2 -68z m1671 -29 c-10 -11 -23 -20
-29 -20 -6 0 0 9 14 20 32 25 38 25 15 0z m-828 -62 c-3 -7 -5 -2 -5 12 0 14
2 19 5 13 2 -7 2 -19 0 -25z m-1810 -10 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3
-3 4 -12 1 -19z m0 -170 c-3 -7 -5 -2 -5 12 0 14 2 19 5 13 2 -7 2 -19 0 -25z
m226 -115 c-7 -2 -19 -2 -25 0 -7 3 -2 5 12 5 14 0 19 -2 13 -5z"/>
<path d="M9936 3737 c-30 -28 -25 -37 18 -37 39 1 68 22 60 44 -9 23 -49 20
-78 -7z"/>
<path d="M9698 2343 c23 -2 61 -2 85 0 23 2 4 4 -43 4 -47 0 -66 -2 -42 -4z"/>
<path d="M9578 2333 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M9570 2288 c0 -23 3 -29 9 -19 8 12 4 51 -5 51 -2 0 -4 -15 -4 -32z"/>
<path d="M9488 2242 c1 -32 5 -73 8 -92 5 -33 4 -34 -10 -15 -8 11 -19 25 -24
30 -4 6 -11 17 -14 26 -5 12 -14 15 -32 12 -23 -5 -26 -10 -26 -44 0 -21 4
-40 9 -44 6 -3 8 10 6 32 -3 21 -2 29 1 18 8 -26 26 -46 24 -25 -4 26 0 44 7
36 14 -14 12 -41 -4 -53 -15 -12 -15 -13 -1 -13 9 0 20 5 23 10 9 15 25 12 25
-5 0 -8 6 -15 14 -15 16 0 28 79 15 95 -5 5 -9 25 -9 45 0 19 -4 40 -8 47 -4
6 -6 -14 -4 -45z"/>
<path d="M9664 2286 c-3 -8 -4 -29 -1 -48 l4 -33 1 38 c2 33 10 42 35 38 4 0
7 4 7 9 0 15 -40 12 -46 -4z"/>
<path d="M9403 2279 c-30 -11 -29 -17 2 -11 20 3 25 0 25 -17 0 -11 5 -21 10
-21 14 0 12 36 -2 48 -8 6 -22 6 -35 1z"/>
<path d="M9597 2277 c-3 -8 -1 -20 4 -28 7 -11 9 -9 9 8 0 12 8 24 18 26 13 4
12 5 -4 6 -12 0 -24 -5 -27 -12z"/>
<path d="M9511 2224 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M9585 2205 c8 -37 25 -57 25 -29 0 11 -7 29 -16 40 -15 18 -15 18 -9
-11z"/>
<path d="M9665 2110 c-21 -5 -9 -7 42 -7 40 -1 75 3 79 8 6 10 -76 10 -121 -1z"/>
<path d="M9668 1988 c-7 -21 4 -58 16 -58 16 0 56 42 56 58 0 16 -67 16 -72 0z"/>
<path d="M8028 2333 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M8465 2313 c-16 -3 -34 -9 -39 -14 -6 -5 -33 -10 -60 -10 -46 -2 -44
-3 24 -10 89 -10 116 -6 130 21 12 22 10 22 -55 13z"/>
<path d="M7728 2283 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M7660 2260 c0 -12 54 -12 90 0 19 6 11 8 -32 9 -33 1 -58 -3 -58 -9z"/>
<path d="M8932 2035 c0 -16 2 -22 5 -12 2 9 2 23 0 30 -3 6 -5 -1 -5 -18z"/>
<path d="M1040 4600 c0 -5 6 -10 14 -10 8 0 18 5 21 10 3 6 -3 10 -14 10 -12
0 -21 -4 -21 -10z"/>
<path d="M1164 4594 c19 -19 20 -26 4 -42 -9 -9 -9 -12 1 -12 9 0 8 -5 -3 -16
-9 -8 -16 -25 -15 -37 1 -20 2 -20 9 3 l8 25 1 -27 c1 -16 6 -28 11 -28 6 0
10 32 10 75 0 69 -2 75 -21 75 -19 0 -19 -1 -5 -16z"/>
<path d="M8892 4402 c-4 -197 6 -527 15 -518 3 2 4 53 3 113 -2 142 -2 169 -1
226 l1 47 45 0 45 0 0 -224 c0 -170 -3 -226 -12 -229 -10 -4 -10 -6 0 -6 9 -1
12 -46 12 -190 0 -177 6 -219 28 -197 13 14 17 94 7 141 -8 42 -5 231 4 200 2
-5 2 -22 1 -37 -1 -22 3 -28 19 -28 31 0 34 -17 4 -25 -21 -5 -24 -8 -13 -15
9 -5 19 -5 27 2 10 8 13 7 14 -3 1 -8 5 4 9 26 4 25 8 -22 9 -122 1 -157 2
-163 22 -163 11 0 18 4 14 10 -3 5 -2 95 1 200 l7 190 41 0 c65 0 67 -4 72
-136 2 -65 6 -161 8 -213 l5 -93 -42 5 c-23 4 -55 9 -72 12 -16 3 -1 -4 35
-15 36 -11 75 -25 86 -31 12 -6 30 -9 40 -6 16 4 15 5 -3 6 -23 1 -23 3 -21
111 3 108 9 125 36 98 9 -9 16 -8 30 5 10 9 22 17 25 17 11 0 4 -81 -8 -93 -6
-7 -16 -27 -23 -44 -9 -26 -8 -33 2 -33 9 0 12 -9 8 -26 -3 -17 -1 -25 6 -21
5 4 12 0 16 -8 4 -11 -2 -15 -22 -16 -52 -2 93 -27 159 -28 55 0 68 3 71 17 7
24 0 919 -8 1110 l-6 152 -89 0 c-49 0 -88 -3 -88 -7 3 -21 -3 -76 -8 -65 -12
31 -20 6 -17 -55 13 -204 13 -194 -5 -191 -9 2 -15 11 -15 21 1 9 -2 14 -7 12
-4 -3 -13 3 -19 12 -11 17 -11 17 -6 -1 7 -21 -9 -46 -30 -46 -20 0 -18 60 2
75 13 9 14 16 6 31 -6 10 -12 13 -12 7 0 -7 -3 -13 -7 -13 -5 0 -8 30 -7 67 1
82 -6 153 -15 153 -4 0 -5 -77 -4 -171 2 -99 0 -168 -5 -165 -5 3 -32 6 -61 7
l-51 2 0 159 0 158 34 0 c50 0 53 16 4 19 -23 1 -45 4 -49 7 -4 2 -10 -4 -12
-13 -4 -17 -5 -17 -6 0 -1 14 -11 17 -61 17 l-60 0 0 -155 0 -155 -45 0 -45 0
0 160 c0 88 -3 160 -7 160 -5 0 -9 -89 -11 -198z m670 5 c3 -93 10 -163 18
-177 l12 -23 -58 8 c-33 4 -61 8 -62 10 -2 2 -1 23 3 47 5 24 10 36 13 28 3
-8 11 -20 18 -28 26 -25 34 20 28 157 -5 110 -3 131 9 131 11 0 15 -29 19
-153z m-433 -30 c-2 -124 -7 -111 -11 30 -2 50 0 89 5 86 4 -2 6 -55 6 -116z
m371 82 c0 -5 -7 -9 -15 -9 -8 0 -15 7 -15 15 0 9 6 12 15 9 8 -4 15 -10 15
-15z m-429 -90 c11 -5 19 -17 19 -27 0 -15 2 -15 10 -2 8 12 10 11 10 -7 0
-16 -6 -23 -19 -23 -11 0 -26 -7 -35 -15 -8 -8 -17 -15 -20 -15 -3 0 -5 44 -5
98 1 91 2 94 11 49 6 -29 18 -51 29 -58z m4 31 c3 -5 1 -10 -4 -10 -6 0 -11 5
-11 10 0 6 2 10 4 10 3 0 8 -4 11 -10z m-8 -136 c13 -4 20 -11 16 -20 -3 -8 1
-15 11 -15 28 -2 34 -4 40 -9 3 -3 -8 -7 -25 -8 -19 -2 -32 3 -35 13 -4 8 -14
15 -24 15 -10 0 -20 7 -24 15 -6 16 5 18 41 9z m-3 -50 c3 -9 2 -12 -4 -9 -7
4 -10 -6 -9 -27 1 -18 -2 -41 -6 -50 -5 -13 -3 -18 8 -18 24 0 30 -31 7 -37
-18 -5 -20 -14 -20 -79 0 -67 2 -74 20 -74 11 0 20 -5 20 -11 0 -6 9 -8 20 -4
11 4 20 2 20 -4 0 -6 -7 -11 -15 -11 -8 0 -15 -5 -15 -11 0 -5 5 -7 11 -3 6 3
15 0 20 -7 11 -19 -8 -29 -59 -29 l-43 0 6 173 c3 94 5 182 5 195 0 25 25 30
34 6z m346 6 c19 -12 -72 -12 -110 0 -19 6 -10 8 35 9 33 0 67 -4 75 -9z
m-138 -192 c3 -106 2 -199 0 -206 -4 -10 -16 -12 -50 -7 -77 11 -72 -3 -72
211 l0 194 59 0 59 0 4 -192z m113 125 c5 -40 7 -256 3 -328 0 -11 2 -28 7
-37 5 -13 3 -18 -9 -18 -24 0 -86 32 -80 42 3 4 0 8 -5 8 -7 0 -11 63 -11 190
l0 190 44 0 44 0 7 -47z m-248 -40 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2
-21 0 -30z m-17 -31 l0 -59 -30 5 c-16 2 -30 8 -30 13 0 5 3 8 8 8 35 -6 42 2
42 46 0 25 2 45 5 45 3 0 5 -26 5 -58z m417 1 c-3 -10 -5 -4 -5 12 0 17 2 24
5 18 2 -7 2 -21 0 -30z m-400 -100 c-2 -21 -4 -4 -4 37 0 41 2 58 4 38 2 -21
2 -55 0 -75z m418 -103 c3 -107 6 -122 20 -132 16 -12 -27 -8 -70 7 l-40 14
35 -4 c19 -3 29 -2 22 1 -10 5 -10 9 0 22 11 13 11 14 0 8 -11 -7 -12 -4 -4
11 6 10 11 57 11 103 0 114 1 119 13 90 5 -14 11 -68 13 -120z m-437 -96 c-8
-18 -14 -22 -18 -12 -6 15 -19 17 -40 3 -13 -7 -13 -6 -2 7 12 15 22 19 64 27
4 0 2 -11 -4 -25z m215 -67 c-3 -6 -1 -7 5 -3 6 3 16 -3 22 -14 6 -11 7 -20 3
-19 -19 3 -57 -4 -42 -8 16 -4 24 -73 8 -73 -5 0 -9 -9 -9 -21 0 -12 -5 -19
-12 -16 -15 4 -18 27 -5 44 5 7 6 25 2 40 -12 41 -13 63 -3 57 4 -3 8 7 8 22
0 22 2 25 15 14 8 -7 12 -17 8 -23z m62 23 c3 -5 -1 -10 -10 -10 -9 0 -13 5
-10 10 3 6 8 10 10 10 2 0 7 -4 10 -10z m-308 -26 c-3 -3 -12 -4 -19 -1 -8 3
-5 6 6 6 11 1 17 -2 13 -5z m453 -63 c0 -22 3 -46 6 -55 3 -9 2 -16 -4 -16 -6
0 -12 25 -14 55 -1 30 0 55 5 55 4 0 7 -18 7 -39z m20 -125 c0 -34 -18 -74
-21 -46 -4 37 -7 56 -14 72 -5 13 -2 15 14 11 16 -4 21 -13 21 -37z m0 -98 c0
-30 -1 -31 -16 -16 -9 9 -14 24 -11 32 11 27 27 17 27 -16z m-20 -49 c0 -4 -7
-6 -15 -3 -8 4 -15 10 -15 15 0 4 7 6 15 3 8 -4 15 -10 15 -15z m28 -41 c3
-14 -3 -18 -27 -18 -31 0 -47 13 -36 31 11 16 59 6 63 -13z"/>
<path d="M9048 4083 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M8920 4586 c0 -2 14 -6 30 -8 17 -3 30 -1 30 4 0 4 -13 8 -30 8 -16
0 -30 -2 -30 -4z"/>
<path d="M5758 4573 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M1881 4554 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M740 4545 c0 -5 5 -17 10 -25 5 -8 10 -10 10 -5 0 6 -5 17 -10 25 -5
8 -10 11 -10 5z"/>
<path d="M436 4523 c-8 -8 -8 -133 0 -133 21 0 62 45 74 79 7 23 11 43 9 45
-8 7 -77 14 -83 9z"/>
<path d="M1280 4520 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z"/>
<path d="M2124 4522 c5 -8 76 -4 76 4 0 2 -18 4 -41 4 -22 0 -38 -4 -35 -8z"/>
<path d="M200 4508 c0 -6 3 -8 7 -5 3 4 16 -1 27 -10 21 -18 21 -18 2 5 -21
24 -36 29 -36 10z"/>
<path d="M7 4493 c-10 -10 -8 -46 3 -63 7 -11 9 -3 8 27 -2 24 -3 43 -4 43 0
0 -4 -3 -7 -7z"/>
<path d="M3845 4486 c-64 -20 -90 -43 -122 -104 -22 -42 -28 -63 -23 -82 5
-14 8 -19 9 -12 1 6 6 12 12 12 7 0 9 -11 6 -30 -4 -17 -2 -30 3 -30 6 0 10
11 10 24 0 46 70 173 89 161 12 -7 72 34 66 45 -3 6 1 10 9 10 8 0 18 5 21 10
8 13 -31 12 -80 -4z"/>
<path d="M536 4461 c-15 -16 -28 -33 -28 -38 0 -4 -11 -32 -24 -61 -13 -29
-24 -62 -24 -73 0 -11 -7 -22 -15 -25 -8 -4 -15 -18 -15 -32 l0 -26 17 24 c24
35 33 43 76 68 37 21 38 22 32 2 -4 -11 -2 -20 4 -20 6 0 11 6 11 14 0 8 29
26 64 41 59 25 86 49 71 63 -3 3 -5 0 -5 -6 0 -7 -7 -12 -15 -12 -8 0 -15 -4
-15 -9 0 -5 -7 -12 -16 -15 -14 -5 -15 -4 -4 9 11 14 7 19 -12 16 -12 -2 -10
27 2 34 6 3 10 11 10 17 0 6 -11 1 -25 -12 -14 -13 -25 -18 -25 -12 0 6 4 14
10 17 5 3 14 14 20 24 7 15 5 18 -11 17 -13 -1 -27 -15 -40 -41 -11 -22 -18
-30 -16 -18 3 13 1 26 -4 29 -13 8 -11 21 7 38 8 9 11 16 7 16 -5 0 -22 -13
-37 -29z"/>
<path d="M4034 4453 c11 -14 20 -43 22 -70 2 -27 6 -61 8 -78 3 -16 5 -47 5
-68 1 -24 5 -36 12 -32 27 17 49 135 30 159 -6 7 -8 16 -5 19 4 4 -3 5 -14 2
-20 -3 -37 18 -27 34 2 5 -8 19 -23 32 -24 22 -25 22 -8 2z"/>
<path d="M1155 4429 c-22 -8 -20 -10 13 -14 12 -1 22 1 22 6 0 13 -14 17 -35
8z"/>
<path d="M8330 4370 c0 -11 4 -20 9 -20 11 0 22 26 14 34 -12 12 -23 5 -23
-14z"/>
<path d="M5007 4359 c-11 -6 -32 -9 -47 -7 -16 2 -27 1 -24 -4 8 -13 59 -9 80
7 22 17 17 19 -9 4z"/>
<path d="M3805 4330 c3 -5 12 -10 20 -10 7 0 21 -7 30 -16 11 -12 25 -14 48
-9 18 3 42 7 54 8 14 1 21 8 20 20 -1 15 -13 17 -90 17 -56 0 -86 -4 -82 -10z"/>
<path d="M7693 4275 c0 -38 2 -53 4 -32 2 20 2 52 0 70 -2 17 -4 1 -4 -38z"/>
<path d="M187 4316 c-8 -19 -46 -21 -48 -3 -1 6 -5 -6 -8 -28 -4 -24 -3 -44 4
-50 21 -21 46 -82 40 -100 -7 -20 -6 -20 9 -1 9 11 16 29 17 40 0 21 1 21 8 1
5 -11 6 -25 4 -31 -2 -6 3 -17 12 -24 8 -7 15 -19 15 -26 0 -8 3 -14 8 -14 4
0 7 11 7 24 0 13 -2 23 -5 21 -3 -2 -10 7 -17 20 -14 31 2 54 40 57 15 1 27 8
27 16 0 7 14 -2 30 -20 27 -30 36 -58 31 -98 -1 -8 -3 -63 -5 -123 -2 -59 -8
-113 -14 -120 -6 -6 -11 -16 -12 -22 -3 -15 -10 -20 -10 -7 0 7 -7 12 -15 12
-8 0 -15 -5 -15 -11 0 -5 -5 -7 -12 -3 -12 8 65 -140 87 -166 28 -33 45 -111
45 -210 0 -55 4 -100 8 -100 11 0 93 60 116 85 41 45 49 64 35 81 -12 15 -11
16 9 10 15 -5 30 -3 40 6 17 14 70 41 107 54 16 5 10 9 -24 15 -57 11 -77 29
-33 29 l32 0 -32 30 c-17 17 -42 30 -55 30 -13 0 -33 5 -44 11 -12 6 -28 7
-37 3 -9 -4 -25 -6 -34 -5 -9 1 -24 -9 -32 -23 -9 -15 -23 -38 -32 -52 -9 -14
-19 -22 -24 -18 -8 9 -19 273 -20 454 l-1 95 -55 60 c-43 48 -57 57 -64 45 -7
-11 -11 -9 -19 13 -6 16 -11 33 -11 38 0 5 -4 9 -9 9 -5 0 -16 3 -24 6 -8 3
-17 -2 -20 -10z"/>
<path d="M1181 4314 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M11 4298 c-1 -24 2 -34 11 -31 4 2 10 -14 14 -35 7 -39 24 -58 35
-40 10 15 -9 65 -27 72 -8 3 -19 16 -24 28 -7 18 -9 19 -9 6z"/>
<path d="M3763 4291 c0 -11 5 -18 9 -15 4 3 5 11 1 19 -7 21 -12 19 -10 -4z"/>
<path d="M7502 4230 c1 -22 5 -40 10 -40 4 0 8 18 8 40 0 22 -4 40 -10 40 -5
0 -9 -18 -8 -40z"/>
<path d="M0 4181 c0 -20 11 -48 28 -72 32 -45 47 -50 37 -11 -4 15 -8 36 -10
47 -1 11 -3 24 -4 28 0 5 -5 6 -10 2 -5 -3 -17 5 -25 17 -16 22 -16 22 -16
-11z"/>
<path d="M3132 4157 c-33 -34 -105 -184 -96 -199 3 -4 0 -8 -5 -8 -6 0 -11
-10 -11 -22 0 -13 -7 -41 -15 -63 -19 -55 -19 -101 3 -123 15 -15 17 -29 11
-92 -4 -57 -2 -82 10 -105 8 -16 15 -39 15 -50 0 -11 3 -22 8 -26 4 -3 -3 -54
-17 -113 -13 -60 -27 -140 -30 -180 -3 -39 -8 -81 -11 -94 -4 -18 2 -25 30
-37 19 -8 36 -20 39 -27 4 -10 6 -10 6 0 1 6 9 12 19 12 13 0 14 -2 4 -9 -11
-6 -9 -9 7 -14 11 -2 28 1 38 8 23 17 53 2 53 -25 0 -26 5 -25 45 6 19 14 39
23 45 19 5 -3 10 -2 10 4 0 5 14 13 31 16 21 5 27 10 19 15 -9 6 -14 44 -15
132 -1 67 -7 135 -13 149 -5 14 -13 50 -17 80 l-6 54 42 20 c51 24 89 53 89
67 0 6 -11 3 -25 -6 -24 -16 -55 -22 -55 -10 0 15 22 44 34 44 7 0 21 9 32 21
22 24 86 59 108 59 8 0 18 5 22 11 5 9 -7 10 -43 7 -44 -4 -57 -11 -90 -46
-43 -45 -73 -54 -73 -23 0 11 -6 22 -12 24 -10 4 -10 6 -1 6 15 1 4 38 -38
123 -5 10 -9 25 -9 35 0 9 -3 13 -7 10 -3 -4 -13 -1 -21 6 -13 10 -15 9 -8 -8
4 -11 3 -16 -1 -11 -10 9 -11 66 -1 66 3 0 4 9 1 20 -3 11 4 40 16 65 25 53
26 62 6 45 -20 -17 -29 -7 -30 36 -1 26 6 43 27 66 32 34 38 64 11 54 -16 -5
-15 -4 1 9 18 14 18 15 -8 25 -52 19 -90 12 -124 -23z"/>
<path d="M10230 4161 c0 -29 -21 -57 -33 -44 -4 3 -7 -4 -7 -17 0 -22 1 -22
18 -7 10 10 22 14 25 10 4 -3 7 15 7 40 0 26 -2 47 -5 47 -3 0 -5 -13 -5 -29z"/>
<path d="M1619 4165 c-1 -3 -2 -8 -3 -12 -2 -5 -8 -19 -14 -33 -15 -31 -32
-141 -21 -134 5 3 11 -7 15 -21 5 -21 12 -25 42 -25 25 0 44 -8 64 -27 24 -23
30 -25 39 -13 5 8 7 34 4 58 -5 32 -3 42 8 42 9 0 12 9 9 30 -3 22 0 30 11 30
23 0 31 37 14 64 -24 35 -69 50 -117 38 -22 -5 -37 -6 -34 -1 3 5 0 9 -5 9 -6
0 -12 -2 -12 -5z"/>
<path d="M2403 4160 c-14 -6 -29 -29 -44 -70 -12 -33 -39 -80 -60 -104 -27
-30 -39 -53 -39 -74 0 -42 9 -62 29 -62 17 1 101 75 101 90 0 14 14 12 28 -2
19 -19 49 17 67 78 12 40 20 54 34 54 10 0 22 -8 26 -17 7 -17 8 -16 15 2 16
38 9 60 -27 88 -38 28 -86 35 -130 17z"/>
<path d="M7687 4146 c-12 -30 -17 -154 -8 -206 7 -45 9 -49 10 -20 3 58 6 240
5 240 -1 0 -4 -6 -7 -14z"/>
<path d="M7933 4124 c-17 -18 -2 -25 20 -9 13 9 14 14 5 18 -7 2 -19 -1 -25
-9z"/>
<path d="M8452 4120 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M0 3952 l0 -158 52 -19 c29 -11 73 -20 97 -21 41 -1 109 -18 140 -33
29 -14 20 -26 -20 -29 -26 -2 -64 -17 -105 -41 l-64 -39 20 -25 c11 -14 20
-30 20 -36 0 -15 34 -31 66 -31 15 0 25 -3 21 -6 -9 -10 37 -96 72 -133 26
-28 36 -32 58 -26 16 4 29 8 31 9 1 2 3 52 5 112 2 117 3 113 -64 215 -67 102
-114 168 -186 261 -88 113 -103 129 -114 122 -5 -3 -6 1 -3 9 3 8 -2 17 -10
20 -14 6 -16 -13 -16 -151z m85 38 c8 -13 -15 -13 -35 0 -12 8 -11 10 7 10 12
0 25 -4 28 -10z m105 -136 c0 -8 -4 -14 -10 -14 -5 0 -10 6 -10 13 0 8 -4 7
-10 -3 -8 -13 -10 -12 -11 5 -1 11 -3 25 -3 32 -1 7 -7 18 -14 25 -6 6 -12 16
-12 21 0 6 16 -7 35 -27 19 -21 35 -44 35 -52z"/>
<path d="M7095 4080 c-3 -6 -3 -16 2 -22 4 -7 8 -42 9 -77 1 -38 7 -67 14 -71
8 -5 11 -19 7 -39 -10 -51 -48 -131 -62 -131 -20 0 -11 43 15 79 33 48 17 48
-23 0 -34 -39 -49 -73 -82 -177 -12 -39 -12 -43 7 -56 30 -21 7 -27 -32 -8
-41 20 -82 64 -70 75 4 5 5 17 3 28 -4 15 -8 17 -19 8 -11 -9 -14 -9 -14 0 0
8 -10 6 -30 -6 -34 -20 -38 -36 -12 -55 10 -7 31 -30 47 -51 16 -21 45 -46 64
-55 22 -10 43 -31 53 -52 25 -49 54 -70 99 -70 24 0 39 -5 39 -12 0 -9 2 -10
8 -2 4 6 22 15 40 19 28 6 33 11 28 28 -3 15 3 29 18 44 50 48 61 204 21 309
-18 47 -23 77 -19 101 12 62 -4 119 -44 160 -39 40 -57 49 -67 33z"/>
<path d="M7551 4074 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M7650 4025 c0 -38 2 -66 4 -64 8 7 10 118 3 126 -4 3 -7 -24 -7 -62z"/>
<path d="M8142 4060 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M4800 4053 c-31 -12 -50 -37 -49 -67 0 -34 17 -83 18 -55 1 9 10 28
22 43 18 22 28 26 75 26 47 0 54 3 54 20 0 10 -9 24 -19 30 -21 11 -75 12
-101 3z"/>
<path d="M7551 4034 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M10160 3972 c0 -5 14 -21 30 -37 23 -22 30 -25 30 -12 0 9 -6 17 -14
17 -7 0 -16 9 -19 20 -5 19 -27 29 -27 12z"/>
<path d="M1518 3873 c-43 -47 -61 -94 -69 -183 -3 -47 -10 -110 -14 -141 -8
-61 -8 -61 59 -117 26 -22 27 -27 20 -75 -4 -29 -7 -114 -6 -189 l2 -138 -159
0 c-88 0 -166 3 -175 6 -9 3 -16 15 -16 26 0 36 -19 60 -43 52 -20 -6 -21 -5
-7 11 14 17 13 18 -4 12 -10 -4 -24 -2 -32 4 -17 14 -74 -12 -93 -43 -50 -79
-85 -148 -90 -178 -5 -24 -12 -34 -22 -32 -25 4 -54 -79 -83 -237 -7 -40 -17
-66 -26 -69 -8 -2 -25 -16 -37 -30 -22 -27 -25 -27 -178 -32 -101 -3 -154 -2
-152 5 2 6 32 29 68 52 90 59 115 80 106 89 -16 16 -182 -80 -170 -99 3 -6 1
-7 -6 -3 -6 4 -19 2 -27 -5 -26 -22 -44 -19 -44 6 0 12 -7 39 -15 59 -14 32
-14 36 0 36 17 0 21 55 5 65 -15 9 -12 59 10 174 11 57 19 105 18 106 -2 2
-78 5 -170 7 -157 4 -168 3 -168 -14 0 -17 12 -18 156 -18 121 0 155 -3 151
-12 -2 -7 -12 -56 -22 -108 l-18 -95 -52 -1 c-46 -1 -93 -11 -145 -31 -8 -3
-27 -5 -42 -4 -24 2 -28 -1 -28 -23 0 -27 15 -36 23 -13 9 25 12 -1 9 -75 -3
-59 -7 -78 -18 -78 -10 0 -14 -12 -14 -39 0 -38 1 -39 33 -37 28 1 32 -2 32
-24 0 -19 -8 -29 -32 -39 l-33 -15 0 -281 0 -282 103 -5 c127 -6 150 -17 176
-79 27 -62 26 -87 -1 -32 -31 66 -74 86 -185 91 l-92 4 -1 -300 0 -301 30 4
c20 3 33 -1 36 -10 5 -12 11 -10 34 7 26 19 33 20 73 8 25 -6 53 -9 64 -6 17
5 19 -1 21 -62 1 -37 5 -79 8 -94 3 -14 -4 -55 -15 -91 -20 -67 -17 -120 10
-153 7 -9 8 -18 3 -23 -35 -33 -213 -175 -236 -189 -23 -13 -28 -23 -28 -55 0
-42 -3 -43 70 8 25 17 68 44 95 60 28 15 67 39 88 53 36 24 56 25 42 3 -3 -6
-41 -34 -83 -63 -42 -28 -107 -75 -144 -105 -60 -47 -68 -58 -68 -88 0 -43 13
-52 34 -21 8 14 25 27 36 31 11 3 20 13 20 21 0 7 9 19 20 26 11 7 20 18 20
25 0 7 6 13 14 13 8 0 22 7 30 16 9 8 16 12 16 7 0 -4 7 0 14 10 12 15 18 17
35 7 17 -8 21 -8 19 2 -2 7 -7 16 -13 20 -6 5 -3 8 7 8 9 0 24 3 34 7 13 5 15
3 9 -8 -4 -8 4 -2 19 12 20 18 25 30 19 45 -6 16 -8 15 -13 -11 -3 -16 -10
-30 -15 -30 -14 0 -19 44 -6 59 5 6 11 29 13 49 1 20 6 37 10 37 4 0 8 7 8 15
0 8 9 15 20 15 11 0 20 -7 20 -15 0 -8 7 -15 15 -15 8 0 15 -4 15 -9 0 -18 38
-4 103 39 37 24 67 48 67 52 0 4 -22 8 -50 8 -27 0 -50 5 -50 10 0 6 23 10 50
10 47 0 50 1 50 26 0 21 -4 25 -18 19 -37 -14 -72 -17 -72 -6 0 6 4 11 8 11 4
0 9 11 10 24 1 17 -5 27 -18 31 -11 4 -20 10 -20 14 0 5 21 46 46 92 57 102
157 310 173 361 16 49 17 128 2 155 -21 40 -64 53 -186 60 -93 5 -115 9 -115
21 0 13 14 14 92 8 50 -3 144 -6 209 -6 l119 0 0 -342 c0 -189 4 -397 8 -463
l8 -120 -36 -35 c-49 -49 -191 -176 -214 -193 -10 -8 -17 -19 -15 -25 5 -13
46 18 216 163 64 55 128 108 142 118 27 19 26 19 -29 6 -13 -3 -16 26 -22 196
-4 110 -10 216 -12 235 -11 89 -13 254 -3 345 l10 100 51 38 51 37 3 -27 c2
-17 6 -22 11 -14 4 7 10 -41 13 -106 7 -155 1 -727 -7 -754 -10 -32 17 -19 35
17 14 28 20 263 20 795 l0 126 58 36 c71 44 177 128 203 161 16 20 19 38 17
108 l-2 83 -3 -76 -4 -75 -50 -18 c-28 -10 -85 -43 -127 -74 -42 -30 -113 -77
-156 -104 l-79 -48 -96 0 c-53 0 -106 -3 -118 -6 -16 -4 -23 -2 -23 7 1 26 38
58 111 96 63 33 80 48 116 100 31 47 43 77 48 118 11 81 19 80 54 -7 6 -16 17
-28 26 -28 17 0 21 25 5 35 -14 9 -12 65 3 66 6 0 3 4 -8 9 -12 5 7 7 52 5 63
-2 75 -6 92 -26 l20 -24 1 37 c0 35 1 36 50 48 28 7 53 16 56 21 3 5 14 9 24
9 15 0 20 -10 24 -57 4 -32 10 -87 14 -123 4 -36 4 -103 0 -150 -5 -47 -6 -95
-3 -107 5 -23 5 -23 -130 -23 -135 0 -135 0 -135 -23 0 -40 31 -58 97 -58 71
0 94 -6 87 -24 -3 -8 -1 -22 4 -32 12 -20 10 -21 27 32 6 21 75 21 75 0 0 -34
34 -85 64 -95 l31 -10 2 -105 c1 -58 4 -113 7 -122 4 -13 -5 -25 -29 -40 -45
-30 -67 -76 -95 -198 -29 -130 -34 -164 -14 -95 55 186 68 224 72 201 4 -23 5
-22 25 14 30 52 44 59 94 46 48 -13 54 -29 42 -118 -4 -32 -10 -109 -13 -170
-4 -80 -10 -120 -22 -138 l-16 -24 30 14 c28 14 30 20 36 93 4 42 10 101 13
130 l6 52 56 2 56 2 -52 3 c-59 4 -59 5 -47 97 l7 46 71 0 c39 0 94 -3 122 -6
l52 -7 7 -66 c3 -36 9 -81 12 -99 5 -31 -1 -39 -111 -150 -64 -65 -116 -121
-116 -124 0 -9 -178 -180 -253 -243 -38 -32 -64 -61 -61 -67 4 -6 3 -8 -2 -5
-5 3 -21 -4 -34 -15 -14 -11 -19 -17 -11 -13 7 4 18 1 23 -6 8 -11 9 -10 4 4
-3 11 0 17 10 17 8 0 12 -4 9 -10 -3 -5 3 -10 14 -10 11 0 23 -5 26 -10 4 -6
11 -7 17 -4 6 4 14 0 19 -7 6 -10 9 -2 9 22 0 36 23 61 34 36 2 -7 5 -3 5 8 1
16 3 17 10 6 8 -12 12 -12 26 2 9 10 21 14 27 11 6 -4 16 -1 22 7 24 31 306
259 320 259 10 0 16 -9 16 -25 0 -18 -16 -37 -59 -72 -196 -160 -339 -286
-344 -302 -4 -17 -1 -18 26 -10 16 4 32 10 34 13 2 2 20 0 39 -4 20 -5 37 -4
40 2 4 5 15 7 26 4 12 -2 27 2 35 10 8 8 19 12 24 9 5 -4 9 1 9 9 0 9 4 15 9
13 5 -1 49 37 99 85 89 86 118 106 105 71 -4 -10 -2 -14 4 -10 5 3 10 23 11
44 1 32 10 46 60 95 44 43 64 56 79 52 16 -4 23 0 28 16 6 20 8 20 24 6 32
-29 47 -19 66 47 10 34 23 68 28 75 7 8 5 27 -3 55 -8 23 -12 47 -11 52 2 6 4
19 6 30 1 11 10 43 19 70 28 79 77 304 83 376 4 49 1 74 -11 100 -26 55 -47
63 -181 67 -222 7 -139 19 122 18 l258 -1 7 -80 c3 -44 4 -117 1 -161 l-6 -81
49 -8 c27 -4 66 -13 87 -20 20 -7 37 -9 37 -4 0 11 -52 35 -92 44 l-28 5 4 93
c6 125 17 209 29 225 14 18 45 15 50 -5 3 -11 5 -7 6 10 1 39 23 76 67 117 20
19 33 28 29 20 -8 -13 -7 -13 8 -1 10 7 38 47 63 87 43 70 63 93 50 59 -4 -12
10 -23 15 -12 1 1 4 123 8 270 6 274 8 286 46 287 6 0 9 -60 7 -167 -4 -187 5
-356 19 -348 4 3 8 18 8 33 0 15 1 119 3 232 2 113 1 222 -3 243 -6 34 -3 43
23 73 30 34 57 44 59 22 0 -7 7 9 14 37 8 27 12 51 10 54 -7 6 -54 -27 -119
-83 l-58 -51 -117 3 c-138 3 -151 7 -151 35 0 20 -53 129 -128 266 -12 22 -29
41 -38 41 -9 0 -14 5 -12 11 2 6 7 10 12 9 15 -3 26 24 21 51 -6 25 -4 26 47
32 29 4 102 7 161 7 l109 0 -7 -92 c-3 -51 -8 -112 -11 -136 l-5 -43 -96 7
c-93 7 -95 6 -85 -13 15 -27 39 -46 46 -35 4 7 17 8 58 3 13 -2 -5 -40 -21
-44 -9 -3 -4 -5 12 -6 15 0 27 -6 27 -11 0 -20 56 18 69 47 14 29 52 332 44
346 -3 5 -29 5 -59 1 -30 -3 -73 -3 -97 0 l-42 7 -3 67 c-3 67 -37 321 -48
355 -5 17 -7 17 -23 3 -10 -9 -24 -16 -32 -16 -31 0 -80 56 -110 125 -17 39
-28 57 -25 40 5 -29 5 -29 -11 5 -9 19 -18 71 -21 116 -4 80 -4 80 27 107 32
26 54 26 96 -1 6 -4 -1 3 -15 15 -35 32 -87 48 -105 33 -50 -42 -57 -173 -15
-308 22 -72 22 -75 7 -185 -24 -170 -27 -218 -11 -224 23 -9 16 -26 -8 -20
-31 8 -92 -38 -85 -64 3 -11 1 -19 -4 -19 -18 0 -41 -75 -36 -117 3 -32 0 -46
-14 -59 -30 -27 -82 -114 -100 -167 -17 -49 -16 -50 7 -84 13 -20 22 -39 19
-43 -9 -15 28 -20 153 -21 158 0 190 -10 217 -66 l20 -42 60 7 c33 4 105 7
160 7 l100 0 3 -230 c2 -168 6 -231 15 -237 8 -5 -13 -31 -68 -80 -43 -40
-101 -94 -127 -120 -26 -26 -58 -50 -70 -52 -32 -7 -258 -14 -258 -9 0 16 49
63 93 89 34 20 52 37 52 50 0 10 17 36 37 57 40 41 58 88 58 153 0 44 23 75
41 57 5 -5 12 -39 16 -76 5 -57 9 -67 25 -67 14 0 18 5 14 18 -19 65 -46 185
-46 206 0 13 -4 28 -10 31 -5 3 -10 39 -10 80 l0 74 -35 7 c-19 3 -44 4 -55 1
-20 -5 -25 9 -23 61 1 7 -1 11 -4 8 -3 -2 -15 6 -27 20 -11 14 -39 29 -61 34
-97 23 -421 1 -419 -28 1 -7 2 -18 3 -26 0 -10 11 -14 28 -13 22 2 29 -3 31
-20 3 -19 -4 -24 -42 -34 -25 -6 -50 -17 -56 -24 -15 -19 -26 -155 -12 -155 9
0 22 46 34 125 2 12 11 20 21 19 9 0 140 -1 290 -2 226 -2 277 -5 293 -17 18
-14 18 -16 2 -29 -10 -7 -18 -22 -19 -32 0 -14 -2 -15 -6 -4 -3 8 -12 21 -21
28 -19 14 -72 16 -72 2 0 -5 -6 -10 -14 -10 -8 0 -17 -12 -19 -27 l-4 -28 -2
26 c-1 18 -8 28 -22 32 -35 9 -82 -4 -101 -27 -17 -21 -18 -21 -18 -1 0 16 -6
20 -30 19 -56 -3 -61 -4 -67 -21 -3 -10 -12 -25 -19 -33 -7 -8 -15 -36 -19
-62 -6 -40 -5 -48 9 -48 12 0 16 10 16 40 0 24 5 42 13 44 58 15 72 23 69 39
-2 9 2 17 8 17 5 0 10 -9 10 -20 0 -18 7 -19 138 -17 l137 2 -3 -115 c-2 -63
-6 -118 -9 -122 -2 -5 -92 -8 -199 -8 -149 0 -194 -3 -194 -12 1 -28 47 -92
82 -112 34 -20 38 -20 71 -4 21 10 39 13 48 8 16 -10 9 -20 -18 -24 -10 -2
-17 -7 -15 -12 16 -58 14 -76 -13 -104 -15 -15 -40 -30 -56 -32 -16 -3 -27 -2
-24 0 9 9 -59 52 -98 63 -50 13 -101 68 -136 145 -16 34 -38 68 -50 76 -11 8
-18 17 -15 21 3 3 1 14 -5 24 -10 17 -11 17 -17 -4 -8 -28 -32 -29 -79 -3 -19
11 -37 20 -40 20 -30 2 -64 14 -59 21 2 5 -8 11 -23 15 -15 4 -32 10 -38 14
-5 3 -30 12 -55 19 -25 8 -61 19 -80 26 -19 7 -44 9 -55 5 -11 -4 -23 -6 -26
-4 -9 5 -48 -114 -51 -154 -1 -19 -6 -36 -11 -39 -5 -3 -6 11 -3 33 4 22 8 98
10 171 5 161 2 165 -105 171 -57 4 -69 7 -65 19 3 8 6 34 6 57 l0 43 73 5 c39
3 108 3 152 -1 63 -5 79 -9 77 -21 -2 -8 -1 -45 3 -81 6 -59 9 -66 26 -62 16
4 19 17 21 85 l3 81 43 12 c23 7 42 10 43 6 7 -45 -18 -181 -34 -182 -17 -1
33 -21 62 -25 13 -2 27 -8 31 -14 4 -6 13 -11 21 -10 8 1 34 2 59 1 36 -2 41
-4 24 -11 -17 -7 -142 -8 -176 -1 -5 0 -17 10 -28 21 -15 15 -20 16 -20 6 0
-16 22 -41 48 -55 22 -12 89 -6 175 15 44 10 64 20 56 24 -8 5 -61 18 -119 30
-58 12 -107 24 -110 27 -7 7 31 33 49 33 9 0 27 9 41 20 14 11 35 20 48 20 12
0 22 4 22 8 0 5 11 22 25 38 14 16 28 39 31 52 7 25 8 26 35 12 15 -8 19 -7
19 4 0 8 11 28 25 44 24 29 36 80 15 67 -5 -3 -10 -2 -10 4 0 5 4 12 9 15 17
11 0 42 -32 61 -37 22 -57 27 -57 14 0 -5 -13 -6 -30 -3 -47 10 -75 -3 -147
-66 -98 -87 -129 -100 -244 -99 -53 0 -109 6 -129 14 -31 12 -27 20 8 16 6 -1
12 3 12 9 0 6 4 9 9 5 5 -3 12 -2 15 3 2 4 -5 9 -17 9 -43 4 -67 14 -67 28 0
8 -5 14 -12 12 -17 -3 -40 48 -42 95 -1 22 -7 43 -13 46 -17 11 -35 133 -22
149 6 7 8 13 3 13 -5 0 -10 16 -11 35 l-2 35 186 0 c172 0 185 -1 178 -17 -4
-10 -8 -31 -11 -48 -2 -16 -9 -70 -15 -118 l-11 -89 -119 4 c-66 2 -119 0
-119 -3 0 -3 5 -20 10 -36 9 -23 16 -29 33 -26 12 2 50 -3 85 -11 l63 -15 30
27 c33 30 40 53 64 214 9 56 20 107 25 112 12 12 11 15 10 -155 -1 -107 2
-127 15 -133 18 -7 158 4 174 13 6 4 13 76 17 179 7 173 23 244 25 115 2 -61
3 -58 10 37 5 61 5 164 -1 244 -9 138 -10 140 -40 167 -34 32 -74 114 -67 141
4 12 -1 18 -13 18 -20 0 -43 51 -34 74 3 8 1 17 -4 20 -13 8 -4 45 17 71 15
19 15 19 -4 5 -33 -25 -35 -32 -34 -109 2 -49 -2 -76 -9 -79 -7 -2 -12 5 -12
17 0 11 -5 23 -11 27 -8 4 -7 9 2 16 11 7 11 11 2 15 -7 2 -13 10 -13 16 0 7
-11 35 -25 62 -31 64 -31 89 1 114 18 14 22 21 11 21 -8 0 -22 2 -29 5 -8 3
-25 -7 -40 -22z m265 -443 c4 0 5 5 1 12 -5 7 -3 8 5 3 9 -5 10 -10 2 -18 -8
-8 -15 -6 -26 6 -8 9 -10 12 -3 7 7 -6 16 -10 21 -10z m-626 -839 c0 -11 -5
-18 -9 -15 -4 3 -5 11 -1 19 7 21 12 19 10 -4z m-80 -7 c51 -7 52 -7 68 -52
17 -50 20 -118 6 -126 -5 -4 -7 3 -4 14 3 10 0 42 -7 70 -17 71 -37 82 -173
90 l-112 7 85 1 c47 1 108 -1 137 -4z m-808 -76 c-5 -9 -9 -29 -8 -45 l1 -28
8 25 c4 14 9 18 9 10 1 -13 2 -13 11 0 9 13 10 13 11 0 1 -8 1 -18 0 -22 0 -3
13 1 30 9 36 18 34 18 222 8 81 -4 147 -11 147 -16 0 -4 3 -14 6 -23 5 -14
-14 -16 -179 -16 -162 0 -187 -2 -205 -17 -31 -27 -37 -60 -14 -72 17 -9 20
-6 25 18 5 22 13 30 38 35 17 3 155 6 306 6 220 0 274 -3 270 -13 -3 -7 -17
-82 -32 -167 -14 -85 -28 -165 -31 -177 -4 -23 -6 -23 -165 -22 -88 0 -162 -1
-165 -3 -2 -2 4 -20 14 -39 15 -30 23 -35 70 -43 28 -5 52 -13 52 -17 0 -5 12
-3 26 3 21 10 27 9 35 -3 5 -8 9 -9 9 -4 0 6 4 3 9 -5 12 -18 5 -29 -27 -41
-21 -8 -29 -7 -39 7 -7 10 -13 13 -13 8 0 -6 5 -15 11 -21 12 -12 4 -33 -12
-33 -6 0 -7 5 -4 10 3 6 1 10 -5 10 -6 0 -22 12 -36 28 l-24 27 25 -49 c18
-36 22 -53 14 -60 -7 -8 -17 -2 -35 19 -33 40 -87 138 -109 198 -10 26 -24 47
-31 47 -8 0 -14 6 -15 13 0 9 -2 9 -6 0 -3 -10 -9 -10 -26 0 -12 7 -24 14 -27
17 -10 10 -135 50 -156 50 -12 0 -27 7 -34 15 -7 8 -18 14 -24 14 -16 -3 -65
18 -81 35 -24 24 -10 50 41 78 65 35 76 46 72 71 -3 19 -14 24 -88 38 -77 14
-83 16 -62 28 13 7 33 11 45 10 18 -2 98 31 117 48 2 2 5 20 6 41 4 93 3 91
18 57 8 -19 10 -36 5 -47z m2227 45 c-10 -10 -19 5 -10 18 6 11 8 11 12 0 2
-7 1 -15 -2 -18z m-2164 -55 c-7 -7 -12 -8 -12 -2 0 14 12 26 19 19 2 -3 -1
-11 -7 -17z m718 -44 c0 -8 -4 -14 -10 -14 -5 0 -10 2 -10 4 0 2 -3 12 -6 20
-5 12 -2 15 10 10 9 -3 16 -12 16 -20z m-163 0 c-3 -3 -12 -4 -19 -1 -8 3 -5
6 6 6 11 1 17 -2 13 -5z m100 0 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17
-2 13 -5z m1244 -12 c-7 -2 -18 1 -23 6 -8 8 -4 9 13 5 13 -4 18 -8 10 -11z
m-41 -2 c11 -7 5 -8 -20 -4 -43 8 -51 14 -19 14 13 0 31 -5 39 -10z m215 -1
c10 -15 6 -16 -65 -3 l-65 12 62 1 c34 1 65 -4 68 -10z m-1117 -126 c-16 -2
-40 -2 -55 0 -16 2 -3 4 27 4 30 0 43 -2 28 -4z m1239 -25 c-3 -8 -6 -5 -6 6
-1 11 2 17 5 13 3 -3 4 -12 1 -19z m-1192 -28 c-3 -5 -12 -10 -18 -10 -7 0 -6
4 3 10 19 12 23 12 15 0z m-84 -30 c-51 -23 -51 -23 -51 -8 0 6 3 9 6 6 3 -4
17 0 32 8 15 8 34 14 42 14 8 0 -5 -9 -29 -20z m-74 -36 c-3 -3 -12 -4 -19 -1
-8 3 -5 6 6 6 11 1 17 -2 13 -5z m-62 -14 c3 -5 1 -10 -4 -10 -6 0 -11 5 -11
10 0 6 2 10 4 10 3 0 8 -4 11 -10z m-295 -279 c0 -5 -7 -11 -15 -15 -9 -3 -15
0 -15 9 0 8 7 15 15 15 8 0 15 -4 15 -9z m1030 -100 c52 -25 113 -158 108
-232 -3 -43 -4 -41 -25 44 -13 49 -32 104 -44 123 -35 57 -63 65 -253 74
l-171 8 180 -2 c118 -2 189 -7 205 -15z m-1460 -22 c0 -11 4 -18 9 -15 5 3 14
0 19 -7 9 -10 4 -16 -18 -24 l-30 -11 0 44 c0 28 4 43 10 39 6 -3 10 -15 10
-26z m1589 -174 c0 -49 -3 -95 -7 -101 -4 -7 -8 45 -8 115 -1 72 2 115 6 101
5 -14 8 -65 9 -115z m-471 55 c7 0 10 -4 7 -10 -11 -17 -65 -12 -65 6 0 12 6
15 23 10 12 -3 28 -6 35 -6z m277 -10 c3 -5 1 -10 -4 -10 -6 0 -12 -12 -12
-27 -1 -21 -2 -23 -6 -8 -3 11 -9 24 -14 30 -5 5 -9 13 -9 17 0 12 38 10 45
-2z m-8 -117 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z m-1610
-55 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z m1320 -50 c-2 -13
-4 -3 -4 22 0 25 2 35 4 23 2 -13 2 -33 0 -45z m-1261 -150 c3 -5 13 -7 21 -3
13 4 14 3 3 -10 -18 -21 -50 -1 -50 31 0 14 -4 33 -9 42 -4 9 -11 42 -14 72
-6 50 -4 47 18 -33 14 -49 28 -93 31 -99z m1571 150 c-3 -8 -6 -5 -6 6 -1 11
2 17 5 13 3 -3 4 -12 1 -19z m16 -63 c5 -28 4 -34 -3 -20 -8 19 -14 73 -6 64
2 -2 6 -22 9 -44z m-309 -20 c4 -34 3 -43 -3 -30 -9 19 -15 93 -7 84 2 -2 6
-26 10 -54z m592 -20 c-6 -19 -14 -35 -18 -35 -4 0 -5 8 -1 18 4 11 3 14 -4 7
-7 -6 -8 -30 -4 -62 4 -29 5 -53 1 -53 -9 0 -40 68 -40 88 0 12 55 64 76 72 1
0 -4 -16 -10 -35z m-1697 -42 c-37 -116 -65 -192 -81 -215 -10 -14 -18 -34
-18 -45 -1 -17 -1 -17 -11 1 -6 10 -14 56 -17 102 -6 100 5 121 76 158 60 32
62 32 51 -1z m1585 -65 c-8 -34 -25 -82 -38 -107 -13 -25 -27 -55 -32 -66 -6
-18 -8 -17 -14 10 -4 17 -8 60 -9 98 -1 61 1 68 22 77 12 5 33 18 47 29 14 11
28 21 32 21 3 0 0 -28 -8 -62z m-85 -270 c-2 -58 -3 -65 -8 -33 -6 39 -3 105
5 105 2 0 3 -33 3 -72z m18 -320 c-2 -18 -4 -6 -4 27 0 33 2 48 4 33 2 -15 2
-42 0 -60z"/>
<path d="M269 2413 c-13 -16 -12 -17 4 -4 9 7 17 15 17 17 0 8 -8 3 -21 -13z"/>
<path d="M525 2338 c-12 -34 -9 -149 4 -129 5 7 7 21 4 30 -2 9 1 30 8 46 l12
30 7 -25 c7 -21 8 -18 9 18 1 36 -2 42 -19 42 -11 0 -23 -6 -25 -12z"/>
<path d="M1668 3873 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M8890 3862 c0 -5 23 -12 50 -14 28 -1 50 0 50 5 0 4 -12 7 -27 7 -16
0 -38 3 -50 6 -13 4 -23 2 -23 -4z"/>
<path d="M7695 3850 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0
-7 -4 -4 -10z"/>
<path d="M7606 3828 c-18 -10 -17 -12 15 -29 19 -10 37 -18 42 -19 14 0 7 27
-11 43 -22 20 -21 20 -46 5z"/>
<path d="M7735 3810 c-15 -24 -23 -70 -13 -70 5 0 8 -6 5 -14 -6 -14 48 -44
59 -33 3 3 18 1 34 -3 20 -6 28 -5 25 3 -2 7 -6 24 -9 40 -7 30 -31 36 -68 16
-16 -8 -22 -8 -28 2 -11 17 19 61 37 55 8 -3 11 -1 8 4 -8 13 -42 13 -50 0z"/>
<path d="M7800 3809 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
-5 -10 -11z"/>
<path d="M2511 3780 c14 -31 19 -36 19 -24 0 6 -7 19 -16 30 -14 18 -14 18 -3
-6z"/>
<path d="M4757 3779 c4 -13 8 -18 11 -10 2 7 -1 18 -6 23 -8 8 -9 4 -5 -13z"/>
<path d="M6776 3783 c-6 -14 -5 -15 5 -6 7 7 10 15 7 18 -3 3 -9 -2 -12 -12z"/>
<path d="M4895 3644 c0 -125 -7 -164 -23 -137 -5 9 -12 6 -20 -8 -12 -19 -11
-20 15 -17 26 3 28 0 31 -32 l3 -35 157 3 c86 2 162 8 168 13 6 5 16 28 24 51
7 24 23 64 36 90 13 26 24 52 24 58 0 8 -53 10 -170 8 -94 -2 -170 0 -170 4 0
4 17 8 37 10 72 6 44 73 -40 97 -23 7 -49 16 -57 20 -13 7 -15 -10 -15 -125z
m218 -91 c8 -7 -41 -63 -55 -63 -13 0 -9 24 8 48 15 22 35 28 47 15z"/>
<path d="M7760 3771 c0 -7 -5 -9 -12 -5 -7 5 -8 3 -3 -5 5 -9 10 -10 18 -2 6
6 8 14 4 18 -4 3 -7 1 -7 -6z"/>
<path d="M4708 3741 c-63 -59 -65 -60 -81 -44 -13 13 -17 12 -36 -8 -11 -13
-21 -28 -21 -33 0 -6 -6 -22 -13 -37 -39 -74 -59 -184 -39 -216 4 -6 26 -19
50 -28 47 -19 45 -15 42 -104 -1 -35 3 -98 9 -140 7 -42 15 -251 19 -464 6
-276 11 -390 19 -395 9 -6 9 -24 -1 -72 -8 -36 -10 -69 -6 -75 4 -5 10 -19 13
-30 4 -18 5 -17 6 3 0 13 5 21 9 18 4 -2 29 0 54 5 38 8 48 16 56 38 8 22 6
35 -10 60 -18 28 -19 38 -10 69 6 20 14 84 17 142 4 58 13 179 21 270 7 91 15
267 16 392 2 151 6 223 13 217 7 -7 9 -235 7 -658 l-4 -648 221 -8 c121 -4
229 -4 240 0 21 6 21 8 21 660 l0 653 22 5 c12 4 20 9 17 12 -4 4 -448 16
-552 15 -4 0 -1 16 7 35 l15 35 -48 0 c-46 0 -49 1 -55 32 -7 37 -6 38 36 47
29 6 33 11 36 41 3 30 -8 120 -23 195 -2 11 -12 25 -22 31 -14 8 -23 5 -45
-15z m595 -936 c3 -264 2 -500 -2 -525 -4 -25 -9 193 -10 484 0 291 0 528 3
525 2 -2 6 -220 9 -484z m-436 322 c-2 -23 -3 -1 -3 48 0 50 1 68 3 42 2 -26
2 -67 0 -90z m267 21 c-6 -10 -4 -10 7 -2 8 6 28 10 44 10 27 -1 30 -4 33 -38
l3 -38 -141 0 c-126 0 -141 2 -136 16 3 9 6 18 6 20 0 2 10 4 23 4 13 0 29 6
35 12 7 7 39 16 70 19 31 3 58 7 60 8 2 0 0 -5 -4 -11z m34 -170 c21 -17 13
-45 -20 -73 -30 -25 -37 -27 -91 -20 -90 10 -109 21 -105 64 l3 36 55 3 c30 1
62 4 70 5 25 4 74 -5 88 -15z m47 -161 l0 -28 -137 -4 -138 -4 0 35 0 35 138
-3 137 -3 0 -28z m-328 -129 c-3 -7 -5 -2 -5 12 0 14 2 19 5 13 2 -7 2 -19 0
-25z m0 -125 c-2 -21 -4 -4 -4 37 0 41 2 58 4 38 2 -21 2 -55 0 -75z m127 95
c13 -43 16 -47 31 -42 9 4 14 12 11 19 -7 18 12 43 22 28 10 -16 86 -48 77
-33 -4 6 -19 16 -33 22 l-27 12 23 4 c30 5 74 -34 70 -62 -2 -15 -13 -22 -40
-27 -35 -5 -38 -4 -38 18 0 12 -4 23 -10 23 -5 0 -10 -6 -10 -14 0 -16 -41
-29 -64 -20 -9 3 -16 2 -16 -4 0 -6 6 -13 13 -15 7 -4 6 -6 -5 -6 -11 -1 -15
-7 -11 -21 3 -11 9 -20 13 -20 5 0 10 -8 13 -17 3 -14 6 -12 15 10 11 25 14
26 34 15 13 -7 26 -17 30 -23 4 -5 11 -6 15 -1 4 4 -1 14 -11 22 -20 14 -19
14 1 14 11 0 28 -9 38 -20 16 -18 16 -20 2 -20 -11 0 -17 -8 -17 -21 0 -18 -5
-20 -35 -16 -19 3 -32 1 -29 -4 3 -5 -18 -9 -46 -9 -51 0 -52 1 -46 25 4 14 2
25 -4 25 -5 0 -10 -9 -10 -20 0 -11 -4 -20 -10 -20 -15 0 -12 58 4 67 27 16
47 70 36 98 -14 37 -33 20 -28 -26 3 -32 0 -39 -14 -39 -15 0 -18 8 -18 43 0
38 3 44 28 54 37 15 42 15 46 1z m-147 -110 c-3 -8 -6 -5 -6 6 -1 11 2 17 5
13 3 -3 4 -12 1 -19z m261 -125 c7 -7 19 -10 25 -6 7 4 6 -1 -2 -10 -18 -22
-27 -21 -49 3 l-17 21 -6 -23 c-3 -15 -12 -22 -25 -21 -44 5 -73 -8 -77 -35
-3 -21 -4 -18 -6 11 0 21 -5 46 -10 55 -8 15 -1 17 72 18 57 1 86 -3 95 -13z
m-251 -205 c-2 -13 -4 -5 -4 17 -1 22 1 32 4 23 2 -10 2 -28 0 -40z m420 -155
c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z"/>
<path d="M5155 3129 c-4 -6 -4 -13 -1 -16 3 -4 6 -1 6 6 0 7 5 9 12 5 7 -4 8
-3 4 4 -9 15 -13 15 -21 1z"/>
<path d="M4980 2957 c0 -14 4 -28 9 -32 5 -3 8 6 7 20 -4 35 -16 44 -16 12z"/>
<path d="M5040 2951 c0 -42 17 -47 18 -6 1 19 -3 35 -8 35 -6 0 -10 -13 -10
-29z"/>
<path d="M5110 2936 c0 -22 3 -27 11 -19 8 8 8 16 0 30 -9 16 -10 14 -11 -11z"/>
<path d="M5070 2499 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
-5 -10 -11z"/>
<path d="M2613 3730 c-30 -13 -43 -25 -43 -40 0 -21 33 -29 45 -10 4 6 22 17
42 25 19 8 33 20 31 27 -7 20 -29 19 -75 -2z"/>
<path d="M6 3705 c4 -8 11 -15 16 -15 6 0 5 6 -2 15 -7 8 -14 15 -16 15 -2 0
-1 -7 2 -15z"/>
<path d="M2715 3706 c-10 -7 -20 -26 -22 -42 -2 -16 -6 -45 -9 -64 l-5 -35 22
33 c13 20 27 31 36 28 8 -3 11 -2 8 4 -3 5 4 14 16 21 12 6 17 14 12 18 -6 3
-12 15 -14 25 -5 25 -20 30 -44 12z"/>
<path d="M3898 3704 c-15 -8 -32 -24 -38 -37 -9 -19 -9 -20 2 -6 35 42 92 50
151 20 28 -14 35 -15 26 -5 -18 22 -64 44 -91 44 -13 -1 -35 -7 -50 -16z"/>
<path d="M1908 3703 c-10 -2 -18 -11 -18 -20 0 -10 6 -14 20 -10 22 6 38 -9
18 -16 -8 -2 -7 -4 2 -3 8 1 14 11 14 25 0 26 -8 31 -36 24z"/>
<path d="M10 3666 c0 -8 5 -18 10 -21 6 -3 10 1 10 9 0 8 -4 18 -10 21 -5 3
-10 -1 -10 -9z"/>
<path d="M7868 3675 c-3 -3 -3 -19 1 -33 4 -15 4 -39 0 -54 -4 -16 -3 -28 2
-28 5 0 9 9 9 20 0 11 5 20 10 20 6 0 10 9 10 20 0 11 7 20 15 20 8 0 15 4 15
9 0 5 -7 11 -15 15 -9 3 -15 0 -15 -9 0 -23 -18 -18 -22 6 -2 11 -6 18 -10 14z"/>
<path d="M887 3653 c-4 -3 -7 -11 -7 -17 0 -6 5 -5 12 2 6 6 9 14 7 17 -3 3
-9 2 -12 -2z"/>
<path d="M6925 3640 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0
-8 -4 -11 -10z"/>
<path d="M7970 3625 c7 -9 15 -13 17 -11 7 7 -7 26 -19 26 -6 0 -6 -6 2 -15z"/>
<path d="M9041 3624 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M1916 3612 c-4 -7 -23 -12 -42 -12 -24 0 -34 -5 -34 -15 0 -13 7 -15
38 -9 43 7 56 17 50 35 -3 10 -6 10 -12 1z"/>
<path d="M4862 3570 c0 -19 2 -27 5 -17 2 9 2 25 0 35 -3 9 -5 1 -5 -18z"/>
<path d="M3892 3560 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M9050 3552 c0 -17 5 -34 11 -37 14 -9 18 -4 25 33 4 22 3 32 -5 32
-7 0 -9 -5 -5 -12 5 -9 2 -9 -9 1 -15 12 -17 10 -17 -17z"/>
<path d="M4091 3538 c0 -9 -4 -25 -7 -35 -5 -17 -5 -17 6 0 6 10 9 25 7 35 -4
15 -5 15 -6 0z"/>
<path d="M36 3473 c6 -65 5 -72 -15 -85 -19 -12 -21 -22 -21 -120 0 -68 4
-108 10 -108 6 0 24 10 40 22 28 20 29 23 15 45 -14 21 -14 25 0 47 16 24 14
71 -6 107 -7 14 -5 21 12 30 17 9 19 13 8 20 -10 6 -11 9 -1 9 6 0 12 5 12 10
0 12 -22 9 -32 -5 -4 -5 -8 6 -9 25 0 19 -4 44 -9 55 -6 13 -7 -6 -4 -52z"/>
<path d="M3979 3513 c-13 -16 -12 -17 4 -4 16 13 21 21 13 21 -2 0 -10 -8 -17
-17z"/>
<path d="M665 3510 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0
-8 -4 -11 -10z"/>
<path d="M3800 3513 c0 -16 67 -83 83 -83 6 0 0 8 -13 17 -14 9 -28 22 -32 27
-20 32 -37 50 -38 39z"/>
<path d="M9865 3500 c-11 -18 24 -38 99 -55 52 -12 71 -13 82 -4 24 20 15 27
-26 19 -23 -4 -40 -3 -40 2 0 5 -4 7 -9 3 -5 -3 -12 -1 -16 5 -3 5 -16 10 -27
10 -12 0 -29 7 -39 16 -12 11 -19 12 -24 4z"/>
<path d="M8910 3470 c0 -15 45 -34 64 -27 9 4 16 12 15 19 0 10 -2 10 -6 1 -7
-18 -38 -16 -57 3 -9 8 -16 11 -16 4z"/>
<path d="M8905 3420 c3 -5 18 -10 32 -10 32 0 28 5 -10 14 -19 4 -26 3 -22 -4z"/>
<path d="M9053 3393 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z"/>
<path d="M185 3380 c-7 -11 -8 -11 22 -14 14 -2 19 2 16 11 -6 15 -29 17 -38
3z"/>
<path d="M9108 3383 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M9295 3293 c127 -41 165 -55 165 -65 0 -3 9 -4 20 -1 13 3 20 0 20
-8 0 -12 2 -12 9 0 7 11 15 11 40 3 17 -6 31 -7 31 -2 0 4 -18 11 -40 15 -22
4 -38 10 -35 14 2 5 -8 6 -23 4 -23 -3 -24 -2 -7 6 18 9 18 10 -6 10 -14 1
-79 14 -145 31 -155 39 -165 37 -29 -7z"/>
<path d="M10224 3274 c-4 -14 -2 -30 5 -37 8 -8 11 -1 11 26 0 43 -7 48 -16
11z"/>
<path d="M9162 3220 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M151 3221 c-10 -7 -7 -9 12 -8 14 1 23 5 20 10 -6 9 -15 9 -32 -2z"/>
<path d="M3793 3133 c4 -6 -10 -8 -41 -5 -58 5 -69 -5 -79 -79 l-8 -54 -74 -7
c-40 -3 -77 -10 -81 -15 -11 -12 -22 -273 -12 -273 11 0 18 46 28 171 6 87 6
87 36 93 17 3 46 6 65 6 31 0 35 -3 30 -22 -3 -13 -11 -53 -18 -90 -13 -68
-25 -86 -31 -46 -2 12 -8 23 -14 25 -14 5 -44 -61 -44 -96 0 -16 -7 -34 -15
-41 -22 -18 -15 -55 10 -55 32 -1 72 -25 84 -52 19 -40 12 -48 -17 -20 -15 14
-46 33 -70 41 -35 13 -48 13 -79 2 -26 -9 -37 -19 -35 -30 2 -9 -2 -16 -8 -16
-5 0 -10 -7 -10 -16 0 -8 -4 -12 -10 -9 -5 3 -10 2 -10 -4 0 -7 -53 -11 -142
-13 -133 -3 -143 -4 -143 -22 0 -13 11 -23 35 -31 46 -16 53 -49 46 -245 -6
-202 -20 -282 -62 -347 -32 -51 -8 -116 49 -129 31 -7 32 -8 7 -15 -14 -4
-111 -7 -217 -8 -173 -1 -193 -3 -202 -19 -13 -24 4 -52 33 -52 24 0 24 -1 30
-152 3 -84 5 -310 3 -503 l-2 -350 -53 -134 c-54 -138 -65 -182 -37 -145 15
19 15 19 9 -1 -15 -44 14 2 31 50 21 62 24 70 72 175 l38 85 5 480 5 480 43 3
42 3 0 -46 c0 -28 4 -44 10 -40 6 3 10 21 10 40 0 42 9 45 120 45 78 0 91 -2
100 -19 8 -17 30 -204 30 -269 0 -12 5 -21 11 -20 6 2 14 -3 17 -11 3 -10 0
-12 -12 -8 -9 4 -16 3 -17 -1 -3 -25 -4 -93 -1 -84 4 14 28 16 36 3 3 -5 -2
-46 -12 -92 -12 -57 -14 -83 -6 -86 7 -2 8 -16 3 -41 -10 -44 -41 -354 -35
-359 9 -9 36 165 41 267 4 63 10 116 14 118 4 1 5 18 3 37 -3 21 2 42 13 57
17 23 17 22 11 -22 -4 -37 -3 -41 5 -20 6 14 8 45 4 70 -6 45 -6 45 29 -28 35
-71 76 -217 76 -270 0 -15 -18 -63 -40 -107 -102 -206 -167 -355 -144 -332 4
3 15 -4 25 -16 12 -15 18 -17 19 -8 0 11 5 10 20 -4 11 -10 20 -13 20 -7 0 6
6 9 14 6 8 -3 25 2 38 10 14 9 27 14 30 11 2 -3 13 23 22 57 26 93 101 281
130 325 24 35 25 43 16 95 -5 31 -16 70 -25 87 -21 42 -28 105 -18 171 l9 55
62 -1 c34 -1 65 -4 69 -7 3 -4 10 -37 14 -74 5 -38 11 -88 14 -113 3 -25 15
-133 26 -240 11 -107 22 -202 25 -211 2 -9 -2 -29 -10 -45 -21 -39 -12 -42 18
-8 30 35 29 19 12 229 -22 248 -23 431 -3 476 9 19 22 41 30 48 13 10 16 0 22
-71 16 -208 44 -359 73 -406 10 -15 13 -37 9 -65 -7 -53 8 -27 18 30 5 33 4
43 -7 43 -10 0 -13 10 -10 33 2 19 -1 51 -7 73 -6 21 -16 102 -22 179 -7 77
-18 152 -25 167 -15 28 -9 88 9 88 15 0 2 127 -22 199 -12 35 -21 74 -21 87
l0 24 133 0 c72 0 137 -4 143 -8 14 -9 23 -258 25 -637 0 -259 -1 -274 -25
-369 -30 -112 -32 -136 -12 -136 10 0 12 -7 8 -22 -4 -15 -2 -19 7 -14 7 5 10
10 7 14 -3 3 1 10 8 16 8 6 28 80 47 171 l32 160 -7 411 c-7 381 -6 412 10
425 16 13 66 112 105 209 l18 45 2 -90 1 -90 14 100 c17 115 19 662 4 680 -5
6 -6 16 -1 21 8 9 31 85 31 100 -1 5 -13 -13 -27 -41 -14 -27 -31 -53 -37 -58
-10 -7 -186 0 -213 8 -7 3 -10 11 -7 18 6 17 52 39 65 32 5 -4 9 3 9 14 0 25
-12 26 -43 6 -25 -16 -28 -14 -111 40 -41 27 -46 34 -46 67 0 26 -6 41 -20 51
-11 8 -22 28 -24 46 -2 17 -18 55 -35 83 -18 28 -29 53 -26 57 9 8 209 15 238
7 23 -5 23 -6 19 -128 -5 -128 -8 -138 -50 -138 -26 0 -26 -17 0 -34 12 -7 24
-6 41 3 30 16 37 57 37 212 l0 109 -145 0 c-130 0 -165 6 -136 24 15 9 -12
116 -29 116 -5 0 -16 3 -26 7 -11 4 -15 2 -11 -4z m-143 -384 c0 -5 -4 -9 -10
-9 -5 0 -10 7 -10 16 0 8 5 12 10 9 6 -3 10 -10 10 -16z m345 -191 c19 -17 19
-17 -22 -15 -42 2 -43 2 -41 40 l1 38 21 -23 c12 -13 30 -31 41 -40z m333
-388 l-3 -195 -60 -118 c-41 -81 -66 -119 -80 -123 -30 -7 -302 0 -285 8 8 3
27 9 43 12 32 8 70 42 64 59 -2 7 2 18 10 25 7 7 13 23 13 34 0 16 -5 19 -24
14 -14 -3 -28 -2 -31 4 -3 5 -11 10 -17 10 -7 0 -7 -4 0 -13 6 -7 8 -24 5 -38
l-7 -24 -7 25 c-12 41 -10 72 3 64 13 -8 4 10 -21 41 -15 18 -15 19 0 7 9 -7
40 -15 67 -19 l51 -6 5 34 c3 19 10 96 16 171 6 76 13 150 15 165 9 47 -6 58
-83 58 l-68 0 9 46 9 46 76 7 c41 3 106 6 144 6 l68 0 0 -235 0 -235 25 0 25
0 0 245 c0 222 2 245 18 254 15 9 17 3 20 -62 2 -40 2 -160 0 -267z m-900 282
c2 -24 -1 -32 -12 -32 -12 0 -16 10 -16 36 0 45 24 42 28 -4z m242 28 c0 -5
-5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4 -4 4 -10z m88 3 c-10 -2
-28 -2 -40 0 -13 2 -5 4 17 4 22 1 32 -1 23 -4z m122 -14 c11 -7 4 -8 -25 -3
-50 8 -58 14 -19 14 16 0 36 -5 44 -11z m-564 -9 c21 0 24 -5 26 -42 l1 -43 4
43 c3 33 8 42 23 42 11 0 19 -7 19 -17 1 -10 4 -34 7 -54 6 -35 8 -37 42 -36
21 0 66 -2 102 -6 36 -3 68 -6 73 -7 4 0 7 -6 7 -14 0 -8 9 -17 20 -21 21 -7
235 11 314 26 86 16 96 13 96 -23 -1 -18 -7 -62 -15 -98 -8 -36 -14 -95 -15
-132 0 -67 0 -68 -27 -70 -79 -4 -105 9 -131 65 -7 17 -17 25 -24 21 -8 -5 -9
-1 -5 12 7 18 6 18 -7 1 -10 -12 -16 -15 -21 -7 -5 8 -13 6 -26 -6 -24 -21
-48 -24 -234 -25 -105 -1 -166 4 -202 14 -28 8 -54 12 -57 9 -3 -3 -6 2 -6 11
0 10 -8 17 -18 17 -10 0 -23 5 -30 12 -9 9 -12 9 -13 0 -2 -14 -4 -22 -12 -42
-3 -8 -8 -22 -10 -30 -4 -10 -6 -9 -6 5 0 11 8 49 19 83 16 50 20 92 20 194
l0 131 31 -7 c17 -3 42 -6 55 -6z m377 -127 c-7 -2 -21 -2 -30 0 -10 3 -4 5
12 5 17 0 24 -2 18 -5z m103 -522 c-3 -4 6 -14 20 -22 14 -7 30 -21 35 -30 7
-14 3 -18 -25 -21 -32 -4 -34 -2 -40 32 -8 50 -7 62 4 55 6 -4 8 -10 6 -14z
m-88 -10 c19 -10 52 -58 52 -75 0 -3 -15 11 -34 32 l-34 37 -209 5 c-173 4
-191 5 -108 10 155 8 309 4 333 -9z m-313 -141 c3 -5 1 -20 -6 -32 -12 -22
-12 -22 -20 -3 -4 11 -8 26 -8 33 -1 14 25 16 34 2z m255 -10 c0 -5 -11 -10
-25 -10 -14 0 -25 5 -25 10 0 6 11 10 25 10 14 0 25 -4 25 -10z m-127 -7 c-13
-2 -33 -2 -45 0 -13 2 -3 4 22 4 25 0 35 -2 23 -4z m124 -220 c-3 -10 -5 -4
-5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z m200 -60 c-9 -15 -27 -39 -42 -53 -27
-25 -27 -25 3 20 17 25 34 59 39 75 6 26 8 27 11 8 2 -12 -3 -34 -11 -50z
m-190 0 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z m220 -470 c-3
-10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z"/>
<path d="M3360 2251 c0 -19 81 -49 151 -57 73 -7 118 3 159 37 l25 21 -25 -7
c-14 -3 -30 -7 -37 -7 -7 -1 -10 -5 -8 -8 6 -9 -45 -20 -92 -20 -45 0 -122 19
-150 38 -16 10 -23 11 -23 3z"/>
<path d="M3885 2190 c3 -5 13 -10 21 -10 8 0 12 5 9 10 -3 6 -13 10 -21 10 -8
0 -12 -4 -9 -10z"/>
<path d="M3856 2154 c12 -18 19 -22 25 -13 8 13 -12 39 -31 39 -6 0 -4 -11 6
-26z"/>
<path d="M7026 3104 c-3 -9 -6 -33 -6 -55 0 -33 -3 -39 -21 -39 -18 0 -21 -5
-17 -32 3 -18 13 -91 23 -161 11 -82 23 -131 31 -134 7 -2 11 -10 8 -18 -3 -7
6 -25 20 -41 15 -17 24 -22 20 -11 -5 13 -1 17 19 17 36 0 79 18 72 30 -3 5
-2 10 4 10 15 0 41 30 41 47 0 13 -12 14 -84 8 l-83 -7 -7 103 c-4 56 -10 115
-13 131 l-5 28 166 0 c141 0 166 2 166 15 0 13 -23 15 -149 15 l-148 0 -7 50
c-7 52 -20 71 -30 44z"/>
<path d="M5754 2870 c7 -143 16 -172 53 -189 46 -21 83 -8 83 31 0 15 -8 18
-49 18 l-49 0 -6 93 c-4 50 -9 104 -12 118 l-5 26 150 8 c83 4 151 11 151 16
0 5 -72 9 -161 9 l-162 0 7 -130z"/>
<path d="M1363 2973 c15 -2 39 -2 55 0 15 2 2 4 -28 4 -30 0 -43 -2 -27 -4z"/>
<path d="M1315 2930 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0
-7 -4 -4 -10z"/>
<path d="M7110 2930 c0 -6 5 -10 10 -10 6 0 10 -9 10 -20 0 -13 7 -20 20 -20
11 0 20 4 20 10 0 5 7 7 15 4 9 -4 15 0 15 10 0 10 -6 13 -15 10 -8 -4 -21 -2
-28 3 -20 16 -47 23 -47 13z"/>
<path d="M8630 2920 c-10 -7 -11 -10 -2 -10 6 0 12 -8 12 -17 1 -17 1 -17 11
0 13 23 0 40 -21 27z"/>
<path d="M3132 2895 c0 -16 2 -22 5 -12 2 9 2 23 0 30 -3 6 -5 -1 -5 -18z"/>
<path d="M8543 2913 c9 -2 25 -2 35 0 9 3 1 5 -18 5 -19 0 -27 -2 -17 -5z"/>
<path d="M8696 2907 c3 -10 9 -15 12 -12 3 3 0 11 -7 18 -10 9 -11 8 -5 -6z"/>
<path d="M9938 2913 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
<path d="M2569 2893 c-13 -16 -12 -17 4 -4 16 13 21 21 13 21 -2 0 -10 -8 -17
-17z"/>
<path d="M3910 2899 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
-5 -10 -11z"/>
<path d="M7220 2901 c0 -6 5 -13 10 -16 6 -3 10 1 10 9 0 9 -4 16 -10 16 -5 0
-10 -4 -10 -9z"/>
<path d="M3191 2884 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M9955 2880 c-18 -8 -17 -9 8 -9 16 -1 26 3 22 9 -3 6 -7 10 -8 9 -1
0 -11 -4 -22 -9z"/>
<path d="M8630 2841 c6 -12 18 -21 26 -21 19 0 10 16 -17 31 -19 10 -20 9 -9
-10z"/>
<path d="M2555 2840 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0
-8 -4 -11 -10z"/>
<path d="M8709 2829 c-22 -13 -3 -20 25 -9 15 5 38 7 52 4 13 -3 24 -2 24 3 0
12 -83 13 -101 2z"/>
<path d="M7211 2814 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M9952 2808 c7 -19 35 -21 41 -3 5 11 0 15 -19 15 -16 0 -24 -5 -22
-12z"/>
<path d="M7140 2800 c0 -13 20 -13 40 0 12 8 9 10 -12 10 -16 0 -28 -4 -28
-10z"/>
<path d="M8720 2725 c0 -33 25 -42 50 -20 31 28 25 45 -15 45 -31 0 -35 -3
-35 -25z"/>
<path d="M1886 2334 c-4 -15 -2 -32 3 -37 8 -8 11 0 11 26 0 44 -5 47 -14 11z"/>
<path d="M2065 2340 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0
-8 -4 -11 -10z"/>
<path d="M2027 2220 c-3 -11 -1 -20 4 -20 5 0 9 7 9 15 0 9 6 12 15 9 8 -4 15
-1 15 5 0 20 -37 12 -43 -9z"/>
<path d="M2040 2184 c0 -3 12 -29 28 -56 l27 -50 100 7 c55 3 111 7 124 8 28
2 40 25 20 38 -11 7 -10 9 4 9 9 0 17 -5 17 -10 0 -7 7 -7 21 0 27 15 31 10
19 -31 -16 -54 -14 -63 12 -45 12 9 37 16 55 16 29 0 33 3 33 25 0 25 -8 29
-42 26 -10 -1 -18 2 -18 8 0 18 -142 34 -177 20 -16 -6 -23 -17 -23 -36 0 -20
-3 -24 -9 -14 -7 11 -9 11 -14 0 -3 -8 -6 -2 -6 14 -1 34 -21 36 -21 2 0 -14
-4 -25 -10 -25 -5 0 -10 10 -10 22 0 21 0 21 -16 2 -13 -16 -15 -16 -10 -1 7
23 1 22 -23 -5 l-21 -21 -22 51 c-20 44 -38 66 -38 46z m277 -66 c-3 -8 -6 -5
-6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z m-17 -3 c0 -8 -9 -15 -20 -15 -11 0
-20 5 -20 11 0 6 7 9 15 5 8 -3 15 -1 15 4 0 6 2 10 5 10 3 0 5 -7 5 -15z"/>
<path d="M1081 2084 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M7433 2083 c-24 -3 -33 -9 -33 -23 0 -34 12 -50 36 -50 23 0 28 10
27 48 -1 6 5 12 13 12 8 0 14 -5 14 -12 0 -6 3 -8 6 -5 7 7 -15 38 -25 35 -3
0 -21 -3 -38 -5z"/>
<path d="M5923 2035 c0 -22 2 -30 4 -17 2 12 2 30 0 40 -3 9 -5 -1 -4 -23z"/>
<path d="M6034 2008 c-4 -6 -8 -25 -10 -41 -1 -20 1 -25 7 -16 5 8 9 24 9 36
0 16 4 21 15 17 8 -4 15 -1 15 5 0 15 -27 14 -36 -1z"/>
<path d="M6150 1985 c-30 -7 -47 -14 -36 -14 12 -1 16 -6 12 -16 -8 -22 4 -45
23 -44 10 0 11 2 4 6 -23 9 -14 43 13 53 31 12 44 13 25 1 -7 -5 -10 -14 -6
-20 5 -9 11 -7 21 6 15 20 19 44 7 42 -5 -1 -33 -7 -63 -14z"/>
<path d="M6047 1968 c-6 -22 1 -48 13 -48 4 0 5 11 3 24 -4 18 0 25 14 28 16
3 16 4 -4 10 -16 4 -23 1 -26 -14z"/>
<path d="M4260 1703 c-13 -60 -28 -623 -16 -612 4 4 8 19 10 35 12 92 32 634
24 634 -3 0 -11 -26 -18 -57z"/>
<path d="M7451 1644 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M950 1641 c0 -6 4 -13 10 -16 6 -3 7 1 4 9 -7 18 -14 21 -14 7z"/>
<path d="M5760 1431 c0 -6 4 -13 10 -16 6 -3 7 1 4 9 -7 18 -14 21 -14 7z"/>
<path d="M2465 1302 c-15 -11 -18 -27 -24 -152 l-6 -115 -8 95 c-4 52 -10 96
-12 98 -11 12 -53 -11 -63 -34 -21 -44 -32 -153 -32 -316 l0 -157 -45 -65
c-25 -37 -45 -70 -45 -74 0 -4 14 -6 30 -6 17 1 44 2 61 3 21 1 28 5 23 14 -5
8 -3 8 9 -2 9 -7 28 -11 41 -9 14 3 24 1 23 -5 -1 -5 4 -12 11 -14 6 -3 12 2
12 10 0 10 7 13 19 10 10 -3 22 0 25 6 4 5 13 8 21 5 7 -3 25 2 39 11 14 10
26 13 26 9 0 -5 5 -1 11 9 5 9 14 17 20 17 5 0 27 17 49 38 39 36 40 39 42
107 l2 70 3 -62 c4 -65 11 -75 34 -46 11 12 15 66 17 222 3 177 1 209 -13 226
-15 19 -16 17 -9 -33 3 -29 3 -90 -2 -135 -6 -68 -9 -76 -15 -49 -3 18 -10 77
-14 130 -7 94 -22 153 -43 166 -6 4 -41 10 -79 15 -37 5 -75 12 -83 15 -8 3
-19 2 -25 -2z m27 -34 c-7 -7 -12 -8 -12 -2 0 14 12 26 19 19 2 -3 -1 -11 -7
-17z m166 -44 c-2 -11 -20 -16 -73 -19 -49 -3 -65 -1 -55 6 12 8 10 9 -7 4
-26 -7 -46 2 -38 16 4 5 44 9 91 9 72 0 85 -2 82 -16z"/>
<path d="M6750 1086 c0 -38 2 -67 4 -65 9 9 13 108 5 121 -5 8 -9 -15 -9 -56z"/>
<path d="M3216 1109 c-4 -14 -6 -29 -5 -35 1 -5 0 -16 -3 -24 -3 -8 -15 -77
-27 -152 -13 -83 -32 -160 -47 -194 -14 -31 -22 -59 -20 -62 3 -3 13 12 21 34
8 21 24 57 35 79 23 43 64 293 58 348 -4 31 -4 32 -12 6z"/>
<path d="M12 1082 c-23 -15 14 -18 128 -12 85 5 92 7 39 8 -36 1 -86 4 -110 7
-24 3 -50 2 -57 -3z"/>
<path d="M1357 1024 c-9 -33 -17 -69 -16 -80 0 -10 9 13 20 51 10 39 17 74 16
79 -2 6 -11 -17 -20 -50z"/>
<path d="M1793 1073 c15 -2 37 -2 50 0 12 2 0 4 -28 4 -27 0 -38 -2 -22 -4z"/>
<path d="M6370 990 c-1 -41 -4 -91 -6 -110 -1 -19 -7 -93 -12 -165 -5 -71 -11
-137 -13 -145 -3 -9 4 -16 17 -18 19 -3 21 3 23 65 3 96 4 103 13 103 4 0 8
23 8 50 l0 51 30 -22 c16 -13 42 -41 57 -63 16 -23 31 -43 34 -46 10 -9 117
-189 136 -230 13 -29 24 -40 41 -40 12 0 22 -4 22 -8 0 -4 14 -13 30 -19 17
-6 30 -7 30 -2 0 5 24 9 54 9 30 0 58 5 61 10 4 6 -7 27 -23 48 -42 54 -144
208 -181 274 -24 42 -32 69 -33 110 -1 76 -5 85 -41 93 -18 4 -34 8 -37 9 -3
1 -11 5 -18 10 -8 4 -23 1 -37 -8 -17 -11 -22 -21 -17 -38 5 -22 5 -22 -12 -5
-22 21 -40 22 -61 1 -14 -15 -14 -18 0 -34 17 -18 11 -30 -16 -30 -21 0 -29
30 -38 140 l-8 85 -3 -75z"/>
<path d="M6681 1046 c-7 -8 -19 -12 -27 -9 -8 3 -14 0 -14 -7 0 -9 -11 -11
-37 -7 -26 5 -33 3 -23 -3 27 -17 86 -12 105 10 10 11 16 22 13 25 -3 3 -11
-1 -17 -9z"/>
<path d="M8251 1044 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M0 1029 c0 -5 5 -7 10 -4 5 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10 -5
-10 -11z"/>
<path d="M8279 998 c-3 -22 -1 -34 4 -29 5 5 7 21 5 37 -3 27 -4 26 -9 -8z"/>
<path d="M1332 900 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M6682 895 c0 -16 2 -22 5 -12 2 9 2 23 0 30 -3 6 -5 -1 -5 -18z"/>
<path d="M221 840 c0 -15 -6 -31 -13 -38 -9 -9 -9 -12 0 -12 16 0 25 23 19 52
-4 22 -4 22 -6 -2z"/>
<path d="M1272 783 c-6 -26 -16 -77 -22 -113 -13 -72 -33 -118 -56 -127 -9 -3
-20 -16 -25 -29 -5 -13 -12 -23 -17 -22 -11 4 -114 -94 -107 -100 3 -3 -2 -14
-12 -24 -9 -10 -13 -18 -10 -18 9 0 252 233 251 239 -1 4 -4 24 -7 46 l-6 40
13 -35 c12 -33 13 -34 19 -10 9 34 7 61 -3 30 -7 -24 -7 -23 -14 11 -4 20 -3
62 3 94 13 71 7 86 -7 18z"/>
<path d="M8296 805 c4 -8 11 -15 16 -15 6 0 5 6 -2 15 -7 8 -14 15 -16 15 -2
0 -1 -7 2 -15z"/>
<path d="M7520 690 c0 -47 4 -80 10 -80 6 0 10 33 10 80 0 47 -4 80 -10 80 -6
0 -10 -33 -10 -80z"/>
<path d="M8360 760 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
-4 -4 -4 -10z"/>
<path d="M1301 724 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
<path d="M1398 697 c-15 -12 -40 -32 -55 -44 -16 -11 -26 -23 -23 -26 3 -3 30
17 60 44 56 49 67 67 18 26z"/>
<path d="M6230 706 c0 -10 60 -126 65 -126 3 0 -9 28 -26 63 -33 65 -39 75
-39 63z"/>
<path d="M583 658 c-18 -11 -33 -24 -33 -29 0 -6 16 2 35 17 19 14 35 28 35
30 0 5 -1 5 -37 -18z"/>
<path d="M3887 666 c-4 -10 -7 -25 -6 -34 0 -11 4 -9 10 7 5 13 8 29 6 35 -2
5 -6 2 -10 -8z"/>
<path d="M6401 670 c0 -20 47 -119 48 -100 0 8 -10 38 -23 65 -14 28 -25 43
-25 35z"/>
<path d="M5 649 c-4 -6 -5 -12 -2 -15 2 -3 7 2 10 11 7 17 1 20 -8 4z"/>
<path d="M9920 630 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
-4 -4 -4 -10z"/>
<path d="M8550 595 c0 -9 89 -95 98 -95 4 0 18 -9 32 -20 29 -22 50 -26 50 -7
-1 6 -31 31 -68 55 -37 23 -77 50 -89 58 -13 9 -23 13 -23 9z"/>
<path d="M2486 573 c-6 -14 -5 -15 5 -6 7 7 10 15 7 18 -3 3 -9 -2 -12 -12z"/>
<path d="M9965 580 c-4 -6 -3 -10 2 -9 21 4 34 -2 27 -13 -4 -7 -3 -8 5 -4 9
6 9 11 0 22 -14 17 -25 18 -34 4z"/>
<path d="M2509 553 l-24 -28 28 24 c25 23 32 31 24 31 -2 0 -14 -12 -28 -27z"/>
<path d="M9477 573 c-4 -7 1 -14 13 -18 11 -3 20 -10 20 -15 0 -4 7 -10 15
-14 13 -4 14 -2 5 14 -6 11 -17 20 -25 20 -7 0 -15 5 -17 12 -3 9 -6 9 -11 1z"/>
<path d="M6306 557 c3 -10 9 -15 12 -12 3 3 0 11 -7 18 -10 9 -11 8 -5 -6z"/>
<path d="M7526 561 c9 -9 45 -11 39 -2 -3 6 -14 9 -25 8 -10 -1 -17 -3 -14 -6z"/>
<path d="M7499 533 c-13 -16 -12 -17 4 -4 9 7 17 15 17 17 0 8 -8 3 -21 -13z"/>
<path d="M10025 540 c3 -5 11 -10 16 -10 6 0 7 5 4 10 -3 6 -11 10 -16 10 -6
0 -7 -4 -4 -10z"/>
<path d="M7440 526 c0 -22 26 -26 27 -5 1 11 -5 19 -13 19 -8 0 -14 -6 -14
-14z"/>
<path d="M390 509 c-88 -71 -111 -92 -106 -96 2 -3 15 5 28 17 13 12 42 36 66
53 23 17 42 34 42 39 0 11 -1 10 -30 -13z"/>
<path d="M219 503 c-13 -16 -12 -17 4 -4 9 7 17 15 17 17 0 8 -8 3 -21 -13z"/>
<path d="M3122 459 c-12 -34 -20 -64 -18 -66 6 -6 47 108 44 119 -2 5 -14 -19
-26 -53z"/>
<path d="M10080 501 c0 -10 30 -24 37 -17 3 2 -5 9 -16 16 -12 6 -21 7 -21 1z"/>
<path d="M1904 448 l-29 -33 33 29 c30 28 37 36 29 36 -2 0 -16 -15 -33 -32z"/>
<path d="M9010 469 c0 -6 6 -9 14 -6 15 6 66 -41 66 -61 0 -7 11 -12 25 -12
24 0 22 4 -25 45 -49 44 -80 57 -80 34z"/>
<path d="M485 433 c-22 -20 -32 -30 -22 -23 9 7 17 9 17 4 1 -5 9 1 19 13 10
12 21 20 23 18 3 -3 5 2 5 10 0 8 -1 15 -1 15 -1 -1 -19 -17 -41 -37z"/>
<path d="M1256 405 c-3 -8 -1 -15 4 -15 6 0 10 7 10 15 0 8 -2 15 -4 15 -2 0
-6 -7 -10 -15z"/>
<path d="M216 365 c-26 -24 -53 -46 -59 -48 -6 -2 -7 -6 -2 -9 12 -7 128 89
116 96 -4 3 -29 -15 -55 -39z"/>
<path d="M6380 395 c0 -5 5 -17 10 -25 5 -8 10 -10 10 -5 0 6 -5 17 -10 25 -5
8 -10 11 -10 5z"/>
<path d="M404 365 c-9 -22 1 -29 15 -11 8 10 9 16 1 21 -5 3 -13 -1 -16 -10z"/>
<path d="M129 283 c-13 -16 -12 -17 4 -4 9 7 17 15 17 17 0 8 -8 3 -21 -13z"/>
<path d="M90 255 c-8 -9 -8 -15 -2 -15 12 0 26 19 19 26 -2 2 -10 -2 -17 -11z"/>
</g>
</svg>
```

---

