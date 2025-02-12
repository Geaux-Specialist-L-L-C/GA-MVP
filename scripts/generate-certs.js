import { generateKeyPairSync, X509Certificate } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const certDir = path.join(dirname(__dirname), '.cert');

// Create .cert directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

const generateCerts = () => {
  try {
    // Generate key pair
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    // Create a self-signed certificate
    const cert = new X509Certificate({
      subject: { CN: 'localhost' },
      issuer: { CN: 'localhost' },
      notBefore: new Date(),
      notAfter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      publicKey
    });

    // Save private key and certificate
    fs.writeFileSync(path.join(certDir, 'key.pem'), privateKey);
    fs.writeFileSync(path.join(certDir, 'cert.pem'), cert.toString());

    console.log('SSL certificates generated successfully!');
    console.log('Location:', certDir);
  } catch (error) {
    console.error('Failed to generate certificates:', error);
    process.exit(1);
  }
};

generateCerts();