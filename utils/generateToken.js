const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenSign = async(user) =>{
    return jwt.sign(
        {
            username: user.Usuario,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = {tokenSign, verifyToken }