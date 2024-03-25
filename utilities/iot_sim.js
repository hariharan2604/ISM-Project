const dgram = require('dgram');
const logger = require('./Logger');

const PORT = 3001;
const HOST = 'localhost';

const client = dgram.createSocket('udp4');

const weatherData = {
    temperature: 25,
    humidity: 60,
    pressure: 1013
};

const message = Buffer.from(JSON.stringify(weatherData));

client.send(message, 0, message.length, PORT, HOST, (err) => {
    if (err) throw err;
    logger.info(`Weather data sent to ${HOST}:${PORT}`);
    client.close();
});
