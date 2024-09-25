const jwt = require('jsonwebtoken');
require("dotenv").config()

function createJwtToken(data) {
    return {
        accessToken: jwt.sign(data, process.env.atSecretKey, { expiresIn: "1w" }),
    };
}


module.exports = { createJwtToken };