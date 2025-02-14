// File: /scripts/prepare-service-worker.js
// Description: Script to prepare service worker with proper configuration

// ES module syntax
import fs from 'fs';
const path = require('path');

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

// Read the template
const configTemplatePath = path.join(__dirname, '../public/firebase-config.js');
let configTemplate = fs.readFileSync(configTemplatePath, 'utf8');

// Replace placeholders with actual values
Object.entries(firebaseConfig).forEach(([key, value]) => {
  configTemplate = configTemplate.replace(
    `'__${key.toUpperCase()}__'`,
    `'${value}'`
  );
});

// Write the processed config
fs.writeFileSync(configTemplatePath, configTemplate);

console.log('✅ Service worker configuration updated successfully');