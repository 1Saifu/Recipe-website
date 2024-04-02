function authenticate(req, res, next) {
    if(req.isAuthenticate()) {
        return next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = { authenticate };