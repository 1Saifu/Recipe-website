const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'recipeToken';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshToken';

// Function to generate a JWT token
const generateToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated successfully:', token);
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

function generateRefreshToken(userId) {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '28d' });
}


// Function to verify an access token
const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

function verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}

module.exports = {
    generateToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};