const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: "مطلوب تسجيل الدخول ❌" });
    console.log('authHeader ', authHeader)
    const token = authHeader.split(" ")[1]; // "Bearer TOKEN"
    console.log('token ', token)
    if (!token) return res.status(401).json({ message: "مطلوب تسجيل الدخول ❌" });//401 Unauthorized

    jwt.verify(token, process.env.AccessTokenSecret, (err, user) => {
        if (err) return res.status(403).json({ message: "التوكن غير صالح ❌" });//403 Forbidden
        req.user = user; // حفظ بيانات المستخدم
        next();
    });
}

module.exports = authMiddleware