const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const authController = require('../controllers/authController')

const authMiddleware = async (req, res, next) => {
    console.log('session ', req.session)
    console.log('accessToken ', req.session.accessToken)
    console.log('user ', req.session.user)

    if (!req.session.accessToken) {
        return res.render('../views/auth/login')
    }

    jwt.verify(req.session.accessToken, process.env.AccessTokenSecret, async (err, user) => {
        if (err) {
            // Access token is invalid, try to refresh using refresh token
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.render('../views/auth/login')
            }

            jwt.verify(refreshToken, process.env.RefreshToken, async (err, decoded) => {
                console.log('decoded ', decoded)
                if (err) {
                    return res.render('../views/auth/login')
                }

                const user = await User.findById(decoded.id).exec();
                if (!user) {
                    return res.status(401).json({ message: "المستخدم غير موجود" });
                }

                const accessToken = authController.getAccessToken(user);
                req.session.accessToken = accessToken;
                req.user = user;

                if (req.session.accessToken) {
                    req.headers['Authorization'] = `Bearer ${req.session.accessToken}`;
                }
                next();
            });
        } else {
            // Access token is valid
            req.user = user;
            if (req.session.accessToken) {
                req.headers['Authorization'] = `Bearer ${req.session.accessToken}`;
            }
            next();
        }
    });
}

module.exports = authMiddleware