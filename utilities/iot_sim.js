const dgram = require('dgram');
const logger = require('./Logger');
const { generateDigitalSignature } = require('../key_auth/digitalsignature');
const PORT = 3001;
const HOST = 'localhost';

const client = dgram.createSocket('udp4');

const weatherData = {
    temperature: 25,
    humidity: 60,
    pressure: 1013,
    // sign: 'HEllo123'
};

// generateDigitalSignature(JSON.stringify(weatherData),"key_auth\\key\\private.pem")
const message = Buffer.from(JSON.stringify(weatherData));

client.send(message, 0, message.length, PORT, HOST, (err) => {
    if (err) throw err;
    logger.info(`Weather data sent to ${HOST}:${PORT}`);
    client.close();
});
