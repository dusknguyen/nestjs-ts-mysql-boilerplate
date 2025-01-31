const forge = require('node-forge');
// Tạo cặp khóa công khai và khóa riêng RSA
const { privateKey, publicKey } = forge.rsa.generateKeyPair(2048);
// Chuyển khóa sang định dạng PEM (chuỗi ký tự)
const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
console.log('Private Key:\n');
console.log(privateKeyPem);
console.log('Public Key:\n');
console.log(publicKeyPem);
const encryptData = (data, publicKeyPem) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(data);
  return forge.util.encode64(encrypted);
};
// Ví dụ dữ liệu cần mã hóa
const dataToEncrypt = 'HelloWorld';
// Mã hóa dữ liệu bằng public key
const encryptedData = encryptData(dataToEncrypt, publicKeyPem);
console.log('\nEncrypted Data:\n\n', encryptedData);
const decryptData = (encryptedData, privateKeyPem) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const decrypted = privateKey.decrypt(forge.util.decode64(encryptedData));
  return decrypted;
};
// Giải mã dữ liệu bằng private key
const decryptedData = decryptData(encryptedData, privateKeyPem);
console.log('\nDecrypted Data:\n\n', decryptedData);
