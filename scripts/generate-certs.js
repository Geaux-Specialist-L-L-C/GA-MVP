// File: /scripts/generate-certs.js
// Description: Generates self-signed SSL certificates for local development
// Author: GitHub Copilot
// Created: 2023-10-10

const mkcert = require('mkcert');
const fs = require('fs');
const path = require('path');

async function generateCerts() {
  const certDir = path.join(process.cwd(), 'certificates');

  // Create certificates directory if it doesn't exist
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
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
  fs.writeFileSync(path.join(certDir, 'localhost.pem'), cert.cert);
  fs.writeFileSync(path.join(certDir, 'localhost-key.pem'), cert.key);

  console.log('SSL certificates generated successfully in the certificates directory.');
}

generateCerts().catch(console.error);