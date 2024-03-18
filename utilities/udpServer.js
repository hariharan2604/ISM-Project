const dgram = require('dgram');
const WeatherData = require('../models/WeatherData');
const { validateIpAddress } = require('./ips');
const logger = require('./Logger');

const udpServer = dgram.createSocket('udp4');
const UDP_PORT = process.env.UDP_PORT;

udpServer.on('error', (err) => {
    console.error(`UDP Server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
    const data = JSON.parse(msg.toString());

    if (!validateIpAddress(rinfo.address)) {
        logger.log(`Spoofed IP address detected: ${rinfo.address}`)
        // console.log(`Spoofed IP address detected: ${rinfo.address}`);
        return;
    }

    WeatherData.create({
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure
    }).then(() => {
        console.log(`Weather data saved from ${rinfo.address}:`, data);
    }).catch((err) => {
        console.error('Error saving weather data:', err);
    });
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

udpServer.bind(UDP_PORT);