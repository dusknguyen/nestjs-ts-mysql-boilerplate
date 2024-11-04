import CryptoJS from 'crypto-js';
/**
 * @param {string} data - The plain text to encrypt.
 * @param {string} key - The encryption key in hex format.
 * @returns {string} - The encrypted data as a base64 string.
 */
export function encryptData(data: string, key: string): string {
  // Encrypt using Rabbit cipher
  const encrypted = CryptoJS.Rabbit.encrypt(data, key);
  return encrypted.toString();
}
/**
 * @param {string} encryptedData - The encrypted data in base64 format.
 * @param {string} key - The encryption key in hex format.
 * @returns {string} - The decrypted plain text.
 */
export function decryptData(encryptedData: string, key: string): string {
  // Decrypt using Rabbit cipher
  const decrypted = CryptoJS.Rabbit.decrypt(encryptedData, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}
