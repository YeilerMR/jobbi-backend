const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.AES_SECRET_KEY;
const iv = process.env.AES_IV;

// Validate key and IV lengths
if (!secretKey || secretKey.length !== 32) {
  throw new Error('There was an error, please check your password is correct.');
}
if (!iv || iv.length !== 16) {
  throw new Error('There was an error, please check your password is correct.');
}

exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

exports.decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
