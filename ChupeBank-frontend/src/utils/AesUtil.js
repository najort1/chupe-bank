import CryptoJS from 'crypto-js';

// Chave e IV em hexadecimal
const encryptionKey = CryptoJS.enc.Hex.parse('ab2b51b572fdb87fb3d02bcab558cb18'); // 32 bytes
const iv = CryptoJS.enc.Hex.parse('a2f95da07f43fae5a1b2c3d4e5f67890'); // 16 bytes

export const encryptAES = (plainText) => {
  const encrypted = CryptoJS.AES.encrypt(
    plainText,
    encryptionKey,
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return encrypted.toString();
};

export const decryptAES = (encryptedText) => {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedText,
    encryptionKey,
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};