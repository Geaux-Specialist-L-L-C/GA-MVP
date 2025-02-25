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
  const certDir = join(process.cwd(), 'certificates');

  // Create certificates directory if it doesn't exist
  try {
    await mkdir(certDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  // Create CA
  const ca = await mkcert.createCA({
    organization: 'Geaux Academy Development CA',
    countryCode: 'US',
    state: 'LA',
    locality: 'Local',
    validityDays: 365
  });

  // Create certificate
  const cert = await mkcert.createCert({
    domains: ['127.0.0.1', 'localhost'],
    validityDays: 365,
    caKey: ca.key,
    caCert: ca.cert
  });

  // Save the certificates
  await Promise.all([
    writeFile(join(certDir, 'localhost.pem'), cert.cert),
    writeFile(join(certDir, 'localhost-key.pem'), cert.key)
  ]);

  console.log('SSL certificates generated successfully in the certificates directory.');
}

generateCerts().catch(err => {
  console.error('Failed to generate certificates:', err);
  process.exit(1);
});