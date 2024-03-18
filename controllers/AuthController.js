const  User  = require('../models/User'); // Assuming you have a User model defined
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        const { username, password } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Check if the provided password matches the hashed password in the database
            // const passwordMatch = await bcrypt.compare(password, user.password);

            if (!password===user.password) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // If the credentials are valid, generate a JWT token
            const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = AuthController;
