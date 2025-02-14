// File: /scripts/prepare-service-worker.js
// Description: Script to prepare service worker with proper configuration

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Validate required config
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  console.error('Missing required Firebase configuration');
  process.exit(1);
}

// Read SSL certificate for service worker
const sslConfig = {
  key: fs.readFileSync('.cert/key.pem', 'utf8'),
  cert: fs.readFileSync('.cert/cert.pem', 'utf8')
};

// Generate service worker config
const configTemplate = `
// This script injects Firebase configuration into the service worker
self.FIREBASE_CONFIG = ${JSON.stringify(firebaseConfig, null, 2)};
self.SSL_CONFIG = ${JSON.stringify(sslConfig, null, 2)};
`;

// Write the processed config
const configPath = path.join(__dirname, '../public/firebase-config.js');
fs.writeFileSync(configPath, configTemplate);

console.log('✅ Service worker and SSL configuration updated successfully');