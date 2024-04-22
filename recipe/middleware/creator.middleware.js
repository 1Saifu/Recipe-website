const jwt = require('jsonwebtoken');
const User = require('../models/user')
const { verifyAccessToken } = require('../utils/token');

const authMiddleware = (req, res, next) => {
    // Extract the authorization token from the request headers
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        // Verify the access token
        const decoded = verifyAccessToken(token);

        // Attach the user ID to the request for future use
        req.userId = decoded.userId;

        // Call next to proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token is invalid or expired, return an error
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};


module.exports = authMiddleware;