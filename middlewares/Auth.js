const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); // Assuming you have a User model defined

// Middleware function for verifying JWT token
async function verifyToken(req, res, next) {
    // Get token from request headers
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_secret_key');

        // Check if the user exists in the database
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Attach the user object to the request for further use in the route handlers
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        logger.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = verifyToken;
