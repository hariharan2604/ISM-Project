const axios = require('axios');
// const NodeRSA = require('node-rsa');
const crypto = require('crypto');

const logger = require('./Logger');


async function validateIpAddress(ip) {
    const response = await axios.post(`http://localhost:3000/manage/checkip`, {
        ip: ip
    });
    return response.data;
}
function decrypt(encryptedData, secretKey) {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}
function checkAuthenticity(msg) {
    try {

        const decryptedText = decrypt(msg, process.env.SECRET);

        const sensorData = JSON.parse(decryptedText);
        logger.info('Received sensor data:', sensorData);
        return { spoof: false, data: sensorData };
    } catch (error) {
        logger.error('Error decrypting message:', error);
        return { spoof: true, data: null };
    }
}

module.exports = { validateIpAddress, checkAuthenticity };
