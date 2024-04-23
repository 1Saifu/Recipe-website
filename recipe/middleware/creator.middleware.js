const { verifyAccessToken } = require("../utils/token");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization || "";
    const accessToken = token.split(" ")?.[1] || "";

    console.log("Authorization token:", accessToken);

    if (!accessToken) {
        return res.status(401).json({
            message: "Authorization token missing"
        });
    }

    try {
        const verifiedToken = verifyAccessToken(accessToken);
        console.log("Verified token:", verifiedToken);
        req.userId = verifiedToken.userId;
        return next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;

