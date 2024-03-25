const User = require('../models/User'); // Assuming you have a User model defined
const logger=require('../utilities/Logger')
class UserController {
    async createUser(req, res) {
        const { username, email, password } = req.body;

        try {
            // Create a new user record in the database
            // const hashedPassword = await bcrypt.hash(password, 10);
            const oldUser = await User.findOne({ where: { username, email } })
            if (!oldUser) {
                const newUser = await User.create({
                    username: username,
                    email: email,
                    password: password
                });
                res.status(201).json(newUser);
            }
            const message = "Username or email already exists";
            res.status(200).json({ message });
            // Respond with the created user data
        } catch (error) {
            logger.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;
