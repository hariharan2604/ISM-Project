const crypto = require("crypto");
const fs = require("fs");

function readfile(pemFilePath) {
  try {
    const pemData = fs.readFileSync(pemFilePath, "utf8");
    return pemData;
  } catch (error) {
    console.error("Error reading PEM file:", error);
    throw error;
  }
}

function generateDigitalSignature(data, privateKeypath) {
  const privateKey = readfile(privateKeypath);
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(data);
  return sign.sign(privateKey, "base64");
}

function verifyDigitalSignature(data, signature, publicKeypath) {
  try {
    const publicKey = readfile(publicKeypath);
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(data);
    return verify.verify(publicKey, signature, "base64");
  } catch (error) {
    return false;
  }
}

async function encryptMessage(plaintext) {
  const pemKey = fs.readFileSync("key_authority/key/symmetric_key.pem", "utf8");
  const key = Buffer.from(pemKey.split("\n")[1], "base64");
  const iv = crypto.randomBytes(16); // Generate a 128-bit (16-byte) IV
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encryptedData = cipher.update(plaintext, "utf8");
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);

  return iv.toString("base64") + ":" + encryptedData.toString("base64");
}

async function decryptMessage(encryptedData) {
  const pemKey = fs.readFileSync("key_authority/key/symmetric_key.pem", "utf8");
  const key = Buffer.from(pemKey.split("\n")[1], "base64");
  const [ivText, encryptedText] = encryptedData.split(":");
  const iv = Buffer.from(ivText, "base64");
  const encryptedBuffer = Buffer.from(encryptedText, "base64");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decryptedData = decipher.update(encryptedBuffer);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);

  return decryptedData.toString("utf8");
}

module.exports = {
  verifyDigitalSignature,
  generateDigitalSignature,
  encryptMessage,
  decryptMessage,
  readfile,
};
