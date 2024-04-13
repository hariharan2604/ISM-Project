const e = require('express');
const User = require('../models/User'); // Assuming you have a User model defined
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ code:400,error: 'User not found' });
            }

            
            if (!(password == user.password)) {
                return res.status(401).json({ code:401,error: 'Invalid password' });
            }
            else {
                const message = "Login Successfull";
                return res.status(200).json({ code:200,message:message });
            }

        } catch (error) {
            logger.error('Error logging in:', error);
            res.status(500).json({ code:500,error: 'Internal server error' });
        }
    }
}

module.exports = AuthController;
