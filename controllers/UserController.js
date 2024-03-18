const User  = require('../models/User'); // Assuming you have a User model defined

class UserController {
    async createUser(req, res) {
        const { username, email, password } = req.body;

        try {
            // Create a new user record in the database
            // const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username: username,
                email: email,
                password: password
            });

            res.status(201).json(newUser); // Respond with the created user data
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;
