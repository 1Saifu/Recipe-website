const jwt = require('jsonwebtoken');

// Function to generate access token
function generateAccessToken(user) {
    return jwt.sign({ userId: user.id }, 'your-access-secret', { expiresIn: '12h' });
}

// Function to verify access token
function verifyAccessToken(token) {
    return jwt.verify(token, 'your-access-secret');
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
};
