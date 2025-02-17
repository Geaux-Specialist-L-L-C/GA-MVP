// File: /scripts/prepare-service-worker.js
// Description: Script to build and prepare the Firebase messaging service worker for production
// Author: GitHub Copilot
// Created: 2024-02-17

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

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

    // Add proper cache headers
    const cacheHeaders = `
// Cache-Control: no-cache
// Content-Type: application/javascript
// Service-Worker-Allowed: /
`;

    // Prepend headers to the service worker content
    swContent = cacheHeaders + swContent;

    // Write back the modified service worker
    fs.writeFileSync(swPath, swContent);

    console.log('✅ Service worker prepared successfully');
  } catch (error) {
    console.error('❌ Error preparing service worker:', error);
    process.exit(1);
  }
}

buildServiceWorker();