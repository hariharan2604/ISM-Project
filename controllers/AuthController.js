const User = require('../models/User'); // Assuming you have a User model defined
// const bcrypt = require('bcrypt');
const { LocalStorage } = require("node-localstorage");
var localStorage = new LocalStorage('./scratch');


class AuthController {
    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(200).json({ code:400,message: 'User not found' });
            }

            
            if (!(password == user.password)) {
                return res.status(200).json({ code:401,message: 'Invalid password' });
            }
            else {
                const message = "Login Successfull";
                localStorage.setItem('email', user.email);
                return res.status(200).json({ code:200,message:message });
            }

        } catch (error) {
            logger.error('Error logging in:', error);
            res.status(200).json({ code:500,message: 'Internal server error' });
        }
    }
}

module.exports = AuthController;
