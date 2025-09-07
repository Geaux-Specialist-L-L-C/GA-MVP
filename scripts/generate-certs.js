// File: /scripts/generate-certs.js
// Description: Generates self-signed SSL certificates for local development
// Author: GitHub Copilot
// Created: 2023-10-10

import mkcert from 'mkcert';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateCerts() {
  // Use existing certs in project root
  const certPath = join(process.cwd(), 'localhost.pem');
  const keyPath = join(process.cwd(), 'localhost-key.pem');

  console.log('Using existing SSL certificate and key:');
  console.log('Certificate:', certPath);
  console.log('Key:', keyPath);
}

generateCerts().catch(err => {
  console.error('Failed to generate certificates:', err);
  process.exit(1);
});