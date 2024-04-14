const { verifyAccessToken } = require('../utils/token');

function authMiddleware(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    try {
        const decodedToken = verifyAccessToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'User not authorized' });
    }
}

module.exports = authMiddleware;
