const dgram = require('dgram');
const WeatherData = require('../models/WeatherData');
const { validateIpAddress } = require('./ips');
const logger = require('./Logger');
const udpServer = dgram.createSocket('udp4');
const UDP_PORT = process.env.UDP_PORT;
const axios = require('axios');

udpServer.on('error', (err) => {
    logger.error(`UDP Server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('message',async (msg, rinfo) => {
    const data = JSON.parse(msg.toString());
    // console.log(data);
    const validIP = await validateIpAddress(rinfo.address,data,data.sign);
    if (!validIP.regyes) {
        try {
            const response = await axios.post('http://localhost:3000/manage/blacklistip', { ip: rinfo.address });
            if (validIP.blockyes) {
                logger.info(` Blacklisted IP address detected: ${rinfo.address} \n Please revoke it to process requests.`)
                return;
            }
            if (validIP.spoofyes) {
                logger.info(` Spoofed IP address detected: ${rinfo.address} \n Further Requests are blocked`)
                return;
            }
            logger.error(`Unauthorised IP address detected: ${rinfo.address}`);
            return;
        } catch (error) {
            logger.error(error)
        }
    }
    else {
        WeatherData.create({
            temperature: data.temperature,
            humidity: data.humidity,
            pressure: data.pressure
        }).then(() => {
            logger.info(`Weather data saved from ${rinfo.address}:`, data);
        }).catch((err) => {
            logger.error('Error saving weather data:', err);
        });
    }

    
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    logger.info(`UDP Server listening on ${address.address}:${address.port}`);
});

udpServer.bind(UDP_PORT);