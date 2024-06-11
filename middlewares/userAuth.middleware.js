const jwt = require('jsonwebtoken');
require("dotenv").config()

const authenticateToken = async (req, res, next) => {
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Invalid use of bearer auth token" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "Please provide a valid token" });
    }

    try {
        const user = jwt.verify(token, process.env.atSecretKey);
        if (!user) {
            return res.status(400).send({ message: "Token invalid, please try again with a valid token" });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).send({ message: "Error verifying token" });
    }
};

module.exports = authenticateToken;
