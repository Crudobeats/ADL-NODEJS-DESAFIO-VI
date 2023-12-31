const jwt = require('jsonwebtoken');

const generateToken = (email) => {
    const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return token;
};

module.exports = { generateToken };