const User = require('../models/User'); // Assuming you have a User model defined
const logger = require('../utilities/Logger');
const { Op } = require('sequelize');
class UserController {
    async createUser(req, res) {
        const { username, email, password } = req.body;

        try {
            const oldUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { username },
                        { email }
                    ]
                }
            });
            if (!oldUser) {
                await User.create({
                    username: username,
                    email: email,
                    password: password
                });
                res.status(201).json({ code: 201, message: "User created" });
            }
            else {
                const message = "Username or email already exists";
                res.status(200).json({ code: 200, message: message });
            }
        } catch (error) {
            logger.error('Error creating user:', error);
            res.status(500).json({ code: 500, error: 'Internal server error' });
        }
    }
}

module.exports = UserController;
