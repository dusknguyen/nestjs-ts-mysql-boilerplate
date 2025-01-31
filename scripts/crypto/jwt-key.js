const crypto = require('crypto');
const { generateKeyPairSync } = require('crypto');
// Generate keys for HMAC algorithms
const generateHMACKey = (algorithm) => {
  const key = crypto.randomBytes(32).toString('hex');
  console.log(`\n\n${algorithm} Key:\n`, key);
};
// Generate key pair for RSA (RS256, RS384, RS512, PS256, PS384, PS512)
const generateRSAKeyPair = (algorithm) => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // or 4096 for stronger security
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  console.log(`\n${algorithm} Public Key:\n\n`, `$${publicKey}$`);
  console.log(`\n${algorithm} Private Key:\n\n`, `$${privateKey}$`);
};
// Generate key pair for ECDSA (ES256, ES384, ES512)
const generateECDSAKeyPair = (algorithm, curve) => {
  const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: curve, // 'P-256', 'P-384', 'P-521'
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  console.log(`\n${algorithm} Public Key:\n\n`, publicKey);
  console.log(`\n${algorithm} Private Key:\n\n`, privateKey);
};
// // Generate HMAC keys
// ['HS256', 'HS384', 'HS512'].forEach(generateHMACKey);
// // Generate RSA keys
// ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'].forEach(generateRSAKeyPair);
// // Generate ECDSA keys
// generateECDSAKeyPair('ES256', 'P-256');
// generateECDSAKeyPair('ES384', 'P-384');
// generateECDSAKeyPair('ES512', 'P-521');
// Generate RSA keys
['PS512', 'PS384', 'PS256', 'RS512'].forEach(generateRSAKeyPair);
// generateECDSAKeyPair('ES384', 'P-384');
