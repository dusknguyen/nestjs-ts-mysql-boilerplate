import configuration from 'config'; // Import configuration module to load configuration files
import forge from 'node-forge'; // Import the node-forge library for cryptographic functions

// Load configuration settings
const config = configuration();

/**
 * Encrypts a given string using the public key from configuration.
 *
 * @param data The string to be encrypted.
 * @returns The encrypted string, encoded in base64.
 */
export const encryptData = (data: string): string => {
  // Retrieve the public key from the configuration and convert it to a forge public key object
  const publicKey = forge.pki.publicKeyFromPem(config.crypto.publicKeyPem);

  // Encrypt the data using the public key
  const encrypted = publicKey.encrypt(data);

  // Return the encrypted data encoded in base64
  return forge.util.encode64(encrypted);
};

/**
 * Decrypts a given encrypted string using the private key from configuration.
 *
 * @param encryptedData The base64-encoded encrypted string to be decrypted.
 * @returns The decrypted string.
 */
export const decryptData = (encryptedData: string): string => {
  // Retrieve the private key from the configuration and convert it to a forge private key object
  const privateKey = forge.pki.privateKeyFromPem(config.crypto.privateKeyPem);

  // Decrypt the data using the private key
  const decrypted = privateKey.decrypt(forge.util.decode64(encryptedData));

  // Return the decrypted data
  return decrypted;
};
