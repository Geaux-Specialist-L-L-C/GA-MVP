// File: /scripts/prepare-service-worker.js
// Description: Script to build and prepare the Firebase messaging service worker for production
// Author: GitHub Copilot
// Created: 2024-02-17

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildServiceWorker() {
  try {
    // Build the service worker with esbuild
    await esbuild.build({
      entryPoints: ['src/firebase/firebase-messaging-sw.ts'],
      bundle: true,
      outfile: 'public/firebase-messaging-sw.js',
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      minify: true,
      sourcemap: true,
      define: {
        'process.env.NODE_ENV': '"production"'
      },
    });

    // Read the built service worker
    const swPath = path.join(__dirname, '../public/firebase-messaging-sw.js');
    let swContent = fs.readFileSync(swPath, 'utf8');

    // Add proper cache headers and content type
    const headers = `
// Cache-Control: no-cache
// Content-Type: application/javascript
// Service-Worker-Allowed: /
`;
    
    // Add Firebase configuration
    const firebaseConfig = `
self.FIREBASE_CONFIG = {
  apiKey: '${process.env.VITE_FIREBASE_API_KEY}',
  authDomain: '${process.env.VITE_FIREBASE_AUTH_DOMAIN}',
  projectId: '${process.env.VITE_FIREBASE_PROJECT_ID}',
  messagingSenderId: '${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}',
  appId: '${process.env.VITE_FIREBASE_APP_ID}'
};
`;

    // Combine everything
    swContent = headers + firebaseConfig + swContent;

    // Write back the modified service worker
    fs.writeFileSync(swPath, swContent);
    
    console.log('✅ Service worker prepared successfully');
  } catch (error) {
    console.error('❌ Error preparing service worker:', error);
    process.exit(1);
  }
}

// Use top-level await since we're in an ES module
await buildServiceWorker();