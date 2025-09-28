const User = require('../models/userSchema')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')
const jwt = require('jsonwebtoken')


const getAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.AccessTokenSecret, { expiresIn: "1h" });
}
const getRefreshToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.RefreshToken, { expiresIn: "7d" });
}


const signup = async (req, res) => {
    const { name, email, password, phone, profilePicture } = req.body;
    if (!name || !email || !password || !phone || !profilePicture) return res.status(400).json({ message: "يجب أن يكون لديك كل البيانات ❌" });
    if (password.length < 8) return res.status(400).json({ message: "يجب أن يكون لديك كلمة مرور طويلة ❌" });
    if (!email.includes('@')) return res.status(400).json({ message: "يجب أن يكون لديك بريد إلكتروني صالح ❌" });
    const foundUser = await User.findOne({ email: email });
    if (foundUser) return res.status(400).json({ message: "المستخدم موجود ❌" });

    // تشفير كلمة السر
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name: name, email: email, password: hashedPassword, phone: phone, profilePicture: profilePicture, createdAt: new Date(), updatedAt: new Date(), slug: slugify(name) };
    await User.create(newUser);
    const accessToken = getAccessToken(newUser);
    const refreshToken = getRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,// accessToken is accessible only by web server not any script or code
        secure: true, // for security for to accessible by https not http
        sameSite: "strict", // for save cookie for to accessible by the same domain not any other site
        aggregate: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });


    res.status(200).json({
        message: "تم التسجيل بنجاح ✅",
        user: newUser,
        accessToken: accessToken
    });
    res.redirect('/success')
}

const login = async (req, res) => {
    console.log('login')
    const { email, password } = req.body;
    console.log('email ', email)
    console.log('password ', password)
    if (!email || !password) return res.status(400).json({ message: "يجب أن يكون لديك كل البيانات ❌" });
    if (password.length < 8) return res.status(400).json({ message: "يجب أن يكون لديك كلمة مرور طويلة ❌" });
    if (!email.includes('@')) return res.status(400).json({ message: "يجب أن يكون لديك بريد إلكتروني صالح ❌" });
    const user = await User.findOne({ email: email });
    console.log('user ', user)
    if (!user) return res.status(400).json({ message: "المستخدم غير موجود ❌" });

    // مقارنة كلمة السر
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch ', isMatch)
    if (!isMatch) return res.status(400).json({ message: "كلمة السر غير صحيحة ❌" });

    // إنشاء Token
    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,// accessToken is accessible only by web server not any script or code
        secure: true, // for security for to accessible by https not http
        sameSite: "strict", // for save cookie for to accessible by the same domain not any other site
        aggregate: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });


    // ✅ choose one response, not both
    res.json({ message: "تم تسجيل الدخول ✅", accessToken });
    // OR
    // res.redirect('/success');
}

const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "مطلوب تسجيل الدخول ❌" });
    console.log('refreshToken ', refreshToken)
    jwt.verify(refreshToken, process.env.RefreshToken, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "التوكن غير صالح ❌" });//403 Forbidden

        const user = await User.findById(decoded.id).exec();
        if (!user) return res.status(401).json({ message: "المستخدم غير موجود ❌" });
        const accessToken = getAccessToken(user);
        res.json({ message: "تم تسجيل الدخول ✅", accessToken });
    });
}

const logout = async (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "تم تسجيل الخروج ✅" });
    // res.redirect('/login')
}

module.exports = { signup, login, refresh, logout }




// ونستخدم JWT (JSON Web Token) للتحقق من المستخدم
//express → لإنشاء REST API.
//jsonwebtoken → للتعامل مع الـ JWT.
//bcryptjs → لتشفير كلمة السر.