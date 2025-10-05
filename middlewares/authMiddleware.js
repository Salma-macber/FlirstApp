const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    console.log('session ', req.session)
    console.log('accessToken ', req.session.accessToken)
    console.log('user ', req.session.user)

    // const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    // if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: "مطلوب تسجيل الدخول ❌" });
    // console.log('authHeader ', authHeader)
    // const token = authHeader.split(" ")[1]; // "Bearer TOKEN"
    // console.log('token ', token)
    // if (!token) return res.status(401).json({ message: "مطلوب تسجيل الدخول ❌" });//401 Unauthorized
    if (!req.session.accessToken) {
        return res.render('../views/auth/login')
        //  return res.status(401).json({ message: "مطلوب تسجيل الدخول ❌" });//401 Unauthorized
    }

    jwt.verify(req.session.accessToken, process.env.AccessTokenSecret, async (err, user) => {
        if (err) return res.status(403).json({ message: "التوكن غير صالح ❌" });//403 Forbidden
        req.user = user; // حفظ بيانات المستخدم
        if (req.session.accessToken) {
            req.headers['Authorization'] = `Bearer ${req.session.accessToken}`;

            // await res.setHeader('Authorization', `Bearer ${req.session.accessToken}`);

        }
        next();
    });
}
// function authMiddleware(req, res, next) {
//     if (!req.session.user) {
//       return res.redirect('/login');
//     }
//     next();
//   }

module.exports = authMiddleware