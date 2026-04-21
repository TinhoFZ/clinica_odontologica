const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'extremely_long_and_secure_super_secret_key';

function generateToken(payload) {
    return jwt.sign(
        payload,
        SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
}

module.exports = { generateToken };