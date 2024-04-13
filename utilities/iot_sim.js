const dgram = require('dgram');
const crypto = require('crypto');

// Function to encrypt plaintext using a secret key
function encrypt(text, secretKey) {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

const client = dgram.createSocket('udp4');
const secretKey = process.env.SECRET; // Same secret key used for encryption
const HOST = '127.0.0.1';
const PORT = process.env.UDP_PORT;

const sensorData = {
    temperature: 25,
    humidity: 60,
    pressure: 1013,
};

// Convert sensorData object to JSON string
const sensorDataString = JSON.stringify(sensorData);

// Encrypt sensorData JSON string
const encryptedText = encrypt(sensorDataString, secretKey);

// Send encrypted message to server
client.send(Buffer.from(encryptedText, 'hex'), PORT, HOST, (err) => {
    if (err) {
        console.log('Error sending message:', err);
    } else {
        console.log('Encrypted message sent to server');
    }
    client.close();
});

client.on('message', (msg, rinfo) => {
    console.log(`Received decrypted message from server: ${msg}`);
    client.close();
});

client.on('error', (err) => {
    console.log(`Client error:\n${err.stack}`);
    client.close();
});
