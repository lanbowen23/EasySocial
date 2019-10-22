const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function auth(req, res, next) {
    // get token from header
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('no token'); // special request error
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log('error in auth middleware');
        res.status(500).json({
            msg: "Server Error"
        })
    }

}