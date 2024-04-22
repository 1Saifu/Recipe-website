const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'recipeToken';

// Function to generate a JWT token
const generateToken = (userId) => {
    console.log('Generating token for userId:', userId);
    try {
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated successfully:', token);
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

// Function to verify an access token
const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyAccessToken
};
