const RegisteredIP = require('../models/RegisteredIP');
const BlacklistedIP = require('../models/BlacklistedIP');
const User = require("../models/User");
const { sendOTP,sendAlert } = require("../utilities/Otp");
const otpGenerator = require('otp-generator');
const { LocalStorage } = require("node-localstorage");
const logger = require('../utilities/Logger');
const { where } = require('sequelize');
var localStorage = new LocalStorage('./scratch');
class IPController {
    async registerIP(req, res) {
        const { ip } = req.body;

        try {
            const existingIP = await RegisteredIP.findOne({ where: { ip } });
            const blacklistedIP = await BlacklistedIP.findOne({ where: { ip } });
            if (blacklistedIP) {
                return res.status(200).json({ code:200,message: 'IP is Blacklisted, Please revoke it..' });
            }
            if (existingIP) {
                return res.status(200).json({ code:200,message: 'IP address already registered' });
            }

            const newIP = await RegisteredIP.create({
                ip: ip
            });

            res.status(201).json({code:201,ip:newIP.ip});
        } catch (error) {
            logger.error('Error registering IP address:', error);
            res.status(500).json({ code:500,message: 'Internal server error' });
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
            res.status(500).json({ code:500,message: 'Internal server error' });
        }
    }
    async blacklistIP(req, res) {
        try {
            const { ip } = req.body;
            const email = localStorage.getItem('email');
            const existingIP = await BlacklistedIP.findOne({ where: { ip } });
            if (existingIP) {
                return res.status(201).json({ code:200,message: 'IP already blacklisted' });
            }

            const newIP = await BlacklistedIP.create({ ip });
            await RegisteredIP.destroy({ where: { ip } });
            sendAlert(email?email:"hariharanjayachandran04@gmail.com", ip);
            return res.status(201).json({code:200,ip:newIP.ip});
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ code:500,message: 'Internal server error' });
        }
    }
    async whitelistIP(req, res) {
        try {
            const { username, ip } = req.body;
            const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
            const email = await User.findOne({ attributes: ['email'], where: { username } });
            localStorage.setItem(ip, otp);
            sendOTP(email.email, otp, ip);
            return res.status(200).json({ code:200,message: 'OTP generation successful' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ code:500,message: 'Internal server error' });
        }
    }
    async verifyOTP(req, res) {
        try {
            const { otp, ip } = req.body;
            if (otp === localStorage.getItem(ip)) {
                await BlacklistedIP.destroy({ where: { ip } });
                await RegisteredIP.create({ ip });
                return res.status(200).json({ code:200,message: 'IP whitelisting successfull' });
            } else {
                return res.status(200).json({ code:500,message: 'IP whitelisting failed Retry again' });
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async registeredIP(req, res) {
        try {
            const existingIP = await RegisteredIP.findAll({attributes:['ip']});
            return res.status(200).json(existingIP);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async blacklistedIP(req, res) {
        try {
            const blacklisted = await BlacklistedIP.findAll({ attributes: ['ip']});
            return res.status(200).json(blacklisted);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}


module.exports = IPController;
