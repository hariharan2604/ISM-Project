const dgram = require('dgram');
const WeatherData = require('../models/WeatherData');
const { validateIpAddress } = require('./ips');
const logger = require('./Logger');

const udpServer = dgram.createSocket('udp4');
const UDP_PORT = process.env.UDP_PORT;

udpServer.on('error', (err) => {
    logger.error(`UDP Server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('message',async (msg, rinfo) => {
    const data = JSON.parse(msg.toString());
    const validIP = await validateIpAddress(rinfo.address);

    if (!validIP.regyes) {
        const response = await axios.post('http://localhost:3000/manage/blacklistip', { ip: ipAddress });
        if (validIP.blockyes) {
            logger.info(` Request from Blacklisted IP address detected: ${rinfo.address} \n Please revoke it to process requests.`)
            return;
        }
        logger.error(`Spoofed IP address detected: ${rinfo.address}`);
        return;
    }

    WeatherData.create({
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure
    }).then(() => {
        logger.info(`Weather data saved from ${rinfo.address}:`, data);
    }).catch((err) => {
        logger.error('Error saving weather data:', err);
    });
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    logger.info(`UDP Server listening on ${address.address}:${address.port}`);
});

udpServer.bind(UDP_PORT);