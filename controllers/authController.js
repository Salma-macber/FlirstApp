const User = require('../models/userSchema')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')
const jwt = require('jsonwebtoken')
// const crypto = require('crypto')
// const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/emailService')

const getAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.AccessTokenSecret, { expiresIn: "1h" });
}
const getRefreshToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.RefreshToken, { expiresIn: "7d" });
}


const signup = async (req, res) => {
    const { name, email, password, phone, gender, country, age } = req.body;
    console.log('req.body ', req.body)
    const profilePicture = req.file;

    // Validation errors - render signup page with error message and preserve form data
    if (!name || !email || !password || !phone || !profilePicture || !gender || !country || !age) {
        console.log('!name || !email || !password || !phone || !profilePicture || !gender || !country || !age ')
        return res.render('../views/auth/registration.ejs', {
            message: "Please fill in all required fields and upload a profile picture",
            formData: { name, email, password, phone, gender, country, age }
        });
    }
    if (password.length < 8) {
        console.log('password.length < 8 ', password.length < 8)
        return res.render('../views/auth/registration.ejs', {
            message: "Password must be at least 8 characters long",
            formData: { name, email, password, phone, gender, country, age }
        });
    }
    if (!email.includes('@')) {
        console.log('email.includes("@") ', email.includes('@'))
        return res.render('../views/auth/registration.ejs', {
            message: "Please enter a valid email address",
            formData: { name, email, password, phone, gender, country, age }
        });
    }

    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
        console.log('foundUser ', foundUser)
        return res.render('../views/auth/registration.ejs', {
            message: "User already exists with this email",
            formData: { name, email, password, phone, gender, country, age }
        });
    }

    // تشفير كلمة السر
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword ', hashedPassword)
    const newUser = {
        name: name,
        email: email,
        gender: gender,
        country: country,
        age: age,
        password: hashedPassword,
        phone: phone,
        profilePicture:
            profilePicture ? `${req.protocol}://${req.get('host')}/uploads/${profilePicture.filename}` : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: slugify(name)
    };
    User.create(newUser).then((user) => {
        console.log('user ', user)
        const accessToken = getAccessToken(user);
        const refreshToken = getRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,// accessToken is accessible only by web server not any script or code
            secure: true, // for security for to accessible by https not http
            sameSite: "strict", // for save cookie for to accessible by the same domain not any other site
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        // save user in session after registration
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            country: user.country,
            age: user.age,
            profilePicture: user.profilePicture,
            slug: user.slug,
            createdAt: user.createdAt
        };
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;
        req.session.loginTime = new Date();
        req.session.isAuthenticated = true;

        // Save session explicitly to ensure it's persisted
        req.session.save((err) => {
            if (err) {
                return res.render('../views/auth/registration.ejs', {
                    message: "Session save error during signup",
                    formData: { name, email, password, phone, gender, country, age }
                });
            }

            // res.redirect('/auth/login?message=Registration successful! Please log in ✅');
            res.redirect('/success');
            // res.status(200).json({
            //     message: "تم التسجيل بنجاح ✅",
            //     user: newUser,
            //     accessToken: accessToken
            // });
        });
    }).catch((err) => {
        console.log('Error creating user:', err)
        return res.render('../views/auth/registration.ejs', {
            message: err,
            formData: { name, email, password, phone, gender, country, age }
        });
    });

}

const openSignupForm = async (req, res) => {
    const { message } = req.query;
    res.render('../views/auth/registration.ejs', { message })
}

const openLoginForm = async (req, res) => {
    const { message } = req.query;
    res.render('../views/auth/login.ejs', { message })
}

const getForgotPasswordForm = async (req, res) => {
    res.render('../views/auth/forgot-password.ejs')
}

const getResetPasswordForm = async (req, res) => {
    res.render('../views/auth/reset-password.ejs')
}

// const getResetPasswordForm = async (req, res) => {
//     const { token } = req.query;

//     if (!token) {
//         return res.status(400).render('../views/auth/reset-password.ejs', {
//             message: 'الرمز مطلوب',
//             token: null
//         });
//     }

//     // Verify token is valid and not expired
//     const user = await User.findOne({
//         resetPasswordToken: token,
//         resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//         return res.status(400).render('../views/auth/reset-password.ejs', {
//             message: 'الرمز غير صحيح أو منتهي الصلاحية',
//             token: null
//         });
//     }

//     res.render('../views/auth/reset-password.ejs', {
//         message: null,
//         token: token
//     });
// }

const login = async (req, res) => {
    console.log('login')
    const { email, password } = req.body;
    console.log('email ', email)
    console.log('password ', password)

    // Validation errors - render login page with error message
    if (!email || !password) {
        return res.render('../views/auth/login.ejs', {
            message: "Please fill in all required fields"
        });
    }
    if (password.length < 8) {
        return res.render('../views/auth/login.ejs', {
            message: "Password must be at least 8 characters long"
        });
    }
    if (!email.includes('@')) {
        return res.render('../views/auth/login.ejs', {
            message: "Please enter a valid email address"
        });
    }

    const user = await User.findOne({ email: email });
    console.log('user ', user)
    if (!user) {
        return res.render('../views/auth/login.ejs', {
            message: "User not found"
        });
    }

    // مقارنة كلمة السر
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch ', isMatch)
    if (!isMatch) {
        return res.render('../views/auth/login.ejs', {
            message: "Incorrect password"
        });
    }

    // إنشاء Token
    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,// accessToken is accessible only by web server not any script or code
        secure: true, // for security for to accessible by https not http
        sameSite: "strict", // for save cookie for to accessible by the same domain not any other site
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // save user in session
    req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        profilePicture: user.profilePicture,
        slug: user.slug,
        createdAt: user.createdAt
    };
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.loginTime = new Date();
    req.session.isAuthenticated = true;

    // Save session explicitly to ensure it's persisted
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: "خطأ في حفظ الجلسة" });
        }

        console.log('Session saved successfully for user:', user.email);
        // ✅ choose one response, not both
        // res.json({ message: "تم تسجيل الدخول ✅", accessToken });
        // OR
        // res.redirect('/success')
        // OR
        res.redirect('/chat');
    });
}

const refresh = async (req, res) => {
    console.log('refresh ')
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "مطلوب تسجيل الدخول" });
    console.log('refreshToken ', refreshToken)
    jwt.verify(refreshToken, process.env.RefreshToken, async (err, decoded) => {
        console.log('decoded ', decoded)
        if (err) return res.status(403).json({ message: "التوكن غير صالح" });//403 Forbidden

        const user = await User.findById(decoded.id).exec();
        if (!user) return res.status(401).json({ message: "المستخدم غير موجود" });
        const accessToken = getAccessToken(user);
        res.json({ message: "تم تسجيل الدخول ✅", accessToken });
    });
}

const logout = async (req, res) => {
    // Destroy session with callback to ensure it's properly removed from MongoDB
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ message: "خطأ في تسجيل الخروج" });
        }

        console.log('Session destroyed successfully');
        res.clearCookie("refreshToken");
        // res.json({ message: "تم تسجيل الخروج ✅" });
        res.redirect('/auth/login');
    });
}

const forgotPassword = async (req, res) => {
    console.log('forgotPassword ')
    try {
        const { email } = req.body;
        console.log('email ', email)
        console.log('req.body ', req.body)
        if (!email) {
            return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "المستخدم غير موجود" });
        }

        // For demo purposes, we'll just return a success message
        // In a real app, you would send an email with OTP
        res.json({
            message: "تم إرسال رمز OTP إلى بريدك الإلكتروني ✅ (استخدم 1234 للاختبار)",
            success: true
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            message: "خطأ في الخادم، حاول مرة أخرى لاحقاً"
        });
    }
}

const resetPassword = async (req, res) => {
    console.log('resetPassword ')
    try {
        const { email, password, otp } = req.body;
        console.log('email ', email)
        console.log('password ', password)
        console.log('otp ', otp)
        console.log('req.body ', req.body)
        if (!email || !password || !otp) {
            return res.status(400).json({ message: "جميع الحقول مطلوبة" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "المستخدم غير موجود" });
        }

        if (otp !== "1234") {
            return res.status(400).json({ message: "الرمز غير صحيح" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        console.log(`Password reset successful for user: ${user.email}`);
        res.json({
            message: "تم تغيير كلمة المرور بنجاح ✅",
            success: true
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            message: "خطأ في الخادم، حاول مرة أخرى لاحقاً"
        });
    }
}

// Change password
const changePassword = async (req, res) => {

    try {
        const { oldPassword, newPassword, userId } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // Find user
        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        // Prevent same password reuse
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) return res.status(400).json({ message: "New password cannot be the same as old password" });

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Save
        user.password = hashedPassword;
        await user.save();

        // (Optional) Generate a new token
        const token = jwt.sign({ id: user._id }, process.env.AccessTokenSecret, { expiresIn: "1h" });

        res.status(200).json({
            message: "Password changed successfully ✅",
            token, // send new token if needed
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { signup, login, refresh, logout, forgotPassword, resetPassword, changePassword, openSignupForm, openLoginForm, getForgotPasswordForm, getResetPasswordForm, getAccessToken }




// ونستخدم JWT (JSON Web Token) للتحقق من المستخدم
//express → لإنشاء REST API.
//jsonwebtoken → للتعامل مع الـ JWT.
//bcryptjs → لتشفير كلمة السر.