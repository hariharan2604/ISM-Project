const RegisteredIP = require('../models/RegisteredIP');
const BlacklistedIP = require('../models/BlacklistedIP');
const { sendOTP } = require("../utilities/Otp");
const otpGenerator = require('otp-generator');
const { LocalStorage } = require("node-localstorage");
const logger = require('../utilities/Logger');
var localStorage = new LocalStorage('./scratch');
class IPController {
    async registerIP(req, res) {
        const { ip } = req.body;

        try {
            const existingIP = await RegisteredIP.findOne({ where: { ip } });
            const blacklistedIP = await BlacklistedIP.findOne({ where: { ip } });
            if (blacklistedIP) {
                return res.status(200).json({ code:200,error: 'IP is Blacklisted, Please revoke it..' });
            }
            if (existingIP) {
                return res.status(200).json({ code:200,error: 'IP address already registered' });
            }

            const newIP = await RegisteredIP.create({
                ip: ip
            });

            res.status(201).json({code:201,ip:newIP.ip});
        } catch (error) {
            logger.error('Error registering IP address:', error);
            res.status(500).json({ code:500,error: 'Internal server error' });
        }
    }
    async checkIP(req, res) {
        const { ip } = req.body;
        try {
            const existingIP = await RegisteredIP.findOne({ where: { ip } });
            const blacklistedIP = await BlacklistedIP.findOne({ where: { ip } });
            res.json({ code:200,regyes: existingIP ? true : false, blockyes: blacklistedIP ? true : false });
        } catch (error) {
            logger.error('Error checking IP address:', error);
            res.status(500).json({ code:500,error: 'Internal server error' });
        }
    }
    async blacklistIP(req, res) {
        try {
            const { ip } = req.body;

            const existingIP = await BlacklistedIP.findOne({ where: { ip } });
            if (existingIP) {
                return res.status(201).json({ code:200,error: 'IP already blacklisted' });
            }

            const newIP = await BlacklistedIP.create({ ip });
            const regIP = await RegisteredIP.findOne({ ip });
            await regIP.destroy();
            return res.status(201).json({code:200,ip:newIP.ip});
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ code:500,error: 'Internal server error' });
        }
    }
    async whitelistIP(req, res) {
        try {
            const { email, ip } = req.body;
            const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
            localStorage.setItem(ip, otp);
            sendOTP(email, otp, ip);
            return res.status(200).json({ code:200,message: 'OTP generation successful' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ code:500,error: 'Internal server error' });
        }
    }
    async verifyOTP(req, res) {
        try {
            const { otp, ip } = req.body;
            if (otp === localStorage.getItem(ip)) {
                const blockIP = await BlacklistedIP.findOne({ ip });
                await RegisteredIP.create({ ip });
                await blockIP.destroy();
                return res.status(200).json({ code:200,message: 'IP whitelisting successfull' });
            } else {
                return res.status(200).json({ code:500,message: 'IP whitelisting failed Retry again' });
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async registeredIP(req, res) {
        try {
            const existingIP = await RegisteredIP.findAll({attributes:['ip']});
            return res.status(200).json({ RegisteredIPS: existingIP });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async blacklistedIP(req, res) {
        try {
            const blacklisted = await BlacklistedIP.findAll({ attributes: ['ip']});
            return res.status(200).json({BlacklistedIPS:blacklisted});
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}


module.exports = IPController;
