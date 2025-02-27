const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.requireLogin = (req, res, next) => {
    const token = verifyToken(req);
    if (!token) {
        return res.status(401).send({ message: "Unauthorized! You must be logged in." });
    }
    next();
}

exports.verifyToken = (req, res, next) => {
    const authHeader = req.header.authorization || req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Removing "Bearer "

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }

        req.user = decoded; // Storing user info in request
        next(); 
    });
}

exports.getUserID = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null; // No token found

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded.id; // user's ID
    } catch (err) {
        return null; // Invalid token
    }
};
