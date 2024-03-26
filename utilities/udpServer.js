const dgram = require('dgram');
const WeatherData = require('../models/WeatherData');
const { validateIpAddress,checkAuthenticity } = require('./ips');
const logger = require('./Logger');
const udpServer = dgram.createSocket('udp4');
const UDP_PORT = process.env.UDP_PORT;
const axios = require('axios');

udpServer.on('error', (err) => {
    logger.error(`UDP Server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('message', async (msg, rinfo) => {
    const validIP = await validateIpAddress(rinfo.address);
    const sp = checkAuthenticity(msg);
    try {
       
        if (validIP.blockyes) {
            logger.info(` Blacklisted IP address detected: ${rinfo.address} \n Please revoke it to process requests.`)
            return;
        }
        if (!validIP.regyes) {
            logger.error(`Unauthorised IP address detected: ${rinfo.address}`);
            return;
        }
        else if (sp.spoof) {
            logger.info(` Spoofed IP address detected: ${rinfo.address} \n Further Requests are blocked`);
            await axios.post('http://localhost:3000/manage/blacklistip', { ip: rinfo.address });
            return;
        }
        else {
            await WeatherData.create({
                temperature: sp.data.temperature,
                humidity: sp.data.humidity,
                pressure: sp.data.pressure
            });
            logger.info(`Sensor data saved from: ${rinfo.address}.`)
        }

    } catch (error) {
        logger.error(error)
    }
}
);

udpServer.on('listening', () => {
    const address = udpServer.address();
    logger.info(`UDP Server listening on ${address.address}:${address.port}`);
});

udpServer.bind(UDP_PORT);