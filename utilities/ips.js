const axios = require('axios');
// const NodeRSA = require('node-rsa');
const crypto = require('crypto');

const logger = require('./Logger');
var CryptoJS = require("crypto-js");


async function validateIpAddress(ip) {
    const response = await axios.post(`http://localhost:3000/manage/checkip`, {
        ip: ip
    });
    return response.data;
}

function decrypt(msg) {
    var esp8266_msg = msg.toString('hex');
    var esp8266_iv = process.env.IV;

    var AESKey = process.env.SECRET;

    var plain_iv = Buffer.from(esp8266_iv, 'base64').toString('hex');
    var iv = CryptoJS.enc.Hex.parse(plain_iv);
    var key = CryptoJS.enc.Hex.parse(AESKey);


    // Decrypt
    var bytes = CryptoJS.AES.decrypt(esp8266_msg, key, { iv: iv });
    var plaintext = bytes.toString(CryptoJS.enc.Base64);
    var decoded_b64msg = Buffer.from(plaintext, 'base64').toString('ascii');
    var decoded_msg = Buffer.from(decoded_b64msg, 'base64').toString('ascii');
    return decoded_msg;
}

function checkAuthenticity(msg) {
    try {
        const decryptedText = decrypt(Buffer.from(msg,'hex').toString());
        const sensorData = JSON.parse(decryptedText);
        logger.info('Received sensor data:', sensorData);
        return { spoof: false, data: sensorData };
    } catch (error) {
        logger.error('Error decrypting message:', error);
        return { spoof: true, data: null };
    }
}

module.exports = { validateIpAddress, checkAuthenticity };
