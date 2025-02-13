// File: /scripts/generate-certs.js
// Description: Generates self-signed SSL certificates for local development
// Author: GitHub Copilot
// Created: 2023-10-10

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import selfsigned from 'selfsigned';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certDir = path.resolve(__dirname, '..', '.cert');

async function generateCertificate() {
  // Ensure .cert directory exists
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  try {
    console.log('Generating SSL certificates...');
    console.log('Certificate directory:', certDir);

    // Generate a self-signed certificate for localhost using selfsigned package
    const attrs = [
      { name: 'commonName', value: 'localhost' },
      { name: 'countryName', value: 'US' },
      { name: 'organizationName', value: 'Geaux Academy Development' }
    ];
    const pems = selfsigned.generate(attrs, {
      algorithm: 'sha256',
      days: 365,
      keySize: 2048,
      extensions: [{
        name: 'basicConstraints',
        cA: true
      }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      }, {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true
      }, {
        name: 'subjectAltName',
        altNames: [{
          type: 2, // DNS
          value: 'localhost'
        }]
      }]
    });
    
    // Save the generated private key and certificate
    const keyPath = path.join(certDir, 'key.pem');
    const certPath = path.join(certDir, 'cert.pem');

    fs.writeFileSync(keyPath, pems.private);
    fs.writeFileSync(certPath, pems.cert);

    console.log('SSL certificates generated successfully!');
    console.log('Key:', keyPath);
    console.log('Certificate:', certPath);
    
    return true;
  } catch (error) {
    console.error('Failed to generate certificates:', error);
    return false;
  }
}

generateCertificate().then(success => {
  process.exit(success ? 0 : 1);
});