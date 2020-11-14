const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({ message: 'You need to Login' })
        }
        const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = { ...decrypt };
        next();

    } catch (error) {
        return res.status(500).json({ message: error.toString() });
    }
}

module.exports = verifyToken;