const jwt = require('jsonwebtoken');


async function generateToken(res, id, email) {
    const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.DB_ENV === 'development' ? '1d' : '7d'
    });

    return res.cookie('token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true
    })
}

module.exports = generateToken;