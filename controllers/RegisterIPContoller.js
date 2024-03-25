const RegisteredIP = require('../models/RegisteredIP'); // Assuming you have a RegisteredIP model defined
const BlacklistedIP = require('../models/BlacklistedIP');
// const { sendOtp } = require("../utilities/Otp");
const otpGenerator = require('otp-generator');
const { LocalStorage } = require("node-localstorage");
const logger = require('../utilities/Logger');
const { verifyDigitalSignature } = require('../key_auth/digitalsignature');
// constructor function to create a storage directory inside our project for all our localStorage setItem.
var localStorage = new LocalStorage('./scratch');
class IPController {
    async registerIP(req, res) {
        const { ip } = req.body;

        try {
            // Check if the IP address is already registered
            const existingIP = await RegisteredIP.findOne({ where: { ip } });
            const blacklistedIP = await BlacklistedIP.findOne({ where: { ip } });
            if (blacklistedIP) {
                return res.status(400).json({ error: 'IP is Blacklisted, Please revoke it..'});
            }
            if (existingIP) {
                return res.status(400).json({ error: 'IP address already registered' });
            }

            // If the IP is not already registered, create a new record in the database
            const newIP = await RegisteredIP.create({
                ip: ip
            });

            res.status(201).json(newIP); // Respond with the registered IP data
        } catch (error) {
            logger.error('Error registering IP address:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async checkIP(req, res) {
        const ip = req.params.ip;
        try {
            // Check if the IP address is registered
            const existingIP = await RegisteredIP.findOne({ where: { ip } });
            const blacklistedIP = await BlacklistedIP.findOne({ where: { ip } });
            // const spoofyes = verifyDigitalSignature()
            // Send true if the IP address is registered, otherwise send false
            res.json({ regyes: existingIP ? true : false, blockyes: blacklistedIP ? true : false });
        } catch (error) {
            logger.error('Error checking IP address:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async blacklistIP(req, res) {
        try {
            const { ip } = req.body;

            // Check if IP already exists
            const existingIP = await BlacklistedIP.findOne({ where: { ip } });
            if (existingIP) {
                return res.status(400).json({ error: 'IP already blacklisted' });
            }

            // Create new blacklisted IP
            const newIP = await BlacklistedIP.create({ ip });
            const regIP = await RegisteredIP.findOne({ ip });
            await regIP.destroy();
            return res.status(201).json(newIP);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async whitelistIP(req, res) {
        try {
            const { email, ip } = req.body;
            const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
            localStorage.setItem(ip, otp);
            // sendOtp(email, otp);
            return res.status(200).json({message:'OTP generation successful'});
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async verifyOTP(req, res) {
        try {
            const { otp,ip } = req.body;
            if (!otp === localStorage.getItem(ip)) {
                const blockIP = await BlacklistedIP.findOne({ ip });
                const regIP = await RegisteredIP.create({ ip });
                await blockIP.destroy();
            }
            return res.status(200).json({ message: 'IP whitelisting succesfull' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}


module.exports = IPController;
