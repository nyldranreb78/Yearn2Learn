const jwt = require('jsonwebtoken')

exports.requireLogin = (req, res, next) => {
    const token = verifyToken(req);
    if (!token) {
        return res.status(401).send({ message: "Unauthorized! You must be logged in." });
    }
    next();
}

const verifyToken = (req) => {
    const token = req.header.authorization || req.headers["authorization"];
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}

exports.getUserID = (req) => {
    const token = verifyToken(req);
    if (!token) {
        return null;
    }
    return token.id;
}