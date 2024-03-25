const e = require('express');
const User = require('../models/User'); // Assuming you have a User model defined
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        const { username, password } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Check if the provided password matches the hashed password in the database
            // const passwordMatch = await bcrypt.compare(password, user.password);

            if (!(password == user.password)) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            else {
                const message = "Login Successfull";
                res.status(200).json({ message });
            }

        } catch (error) {
            logger.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = AuthController;
