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
    const { name, email, password, phone, gender, country, age } = req.body;
    console.log('req.body ', req.body)
    const profilePicture = req.file;

    // Validation errors - render signup page with error message and preserve form data
    if (!name || !email || !password || !phone || !profilePicture || !gender || !country || !age) {
        console.log('!name || !email || !password || !phone || !profilePicture || !gender || !country || !age ')
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "Please fill in all required fields and upload a profile picture" });
        }
        else return res.render('../views/auth/registration.ejs', {
            message: "Please fill in all required fields and upload a profile picture",
            formData: { name, email, password, phone, gender, country, age }
        });
    }
    if (password.length < 8) {
        console.log('password.length < 8 ', password.length < 8)
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        else return res.render('../views/auth/registration.ejs', {
            message: "Password must be at least 8 characters long",
            formData: { name, email, password, phone, gender, country, age }
        });
    }
    if (!email.includes('@')) {
        console.log('email.includes("@") ', email.includes('@'))
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        else return res.render('../views/auth/registration.ejs', {
            message: "Please enter a valid email address",
            formData: { name, email, password, phone, gender, country, age }
        });
    }

    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
        console.log('foundUser ', foundUser)
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "User already exists with this email" });
        }
        else return res.render('../views/auth/registration.ejs', {
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
                if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                    return res.status(500).json({ message: "Session save error during signup" });
                }
                else return res.render('../views/auth/registration.ejs', {
                    message: "Session save error during signup",
                    formData: { name, email, password, phone, gender, country, age }
                });
            }

            // res.redirect('/auth/login?message=Registration successful! Please log in ✅');
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(200).json({
                    message: "Registration successful! Please log in ✅",
                    user: newUser,
                    accessToken: accessToken
                });
            }
            else res.redirect('/success');

        });
    }).catch((err) => {
        console.log('Error creating user:', err)
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ message: "Error creating user" });
        }
        else return res.render('../views/auth/registration.ejs', {
            message: err,
            formData: { name, email, password, phone, gender, country, age }
        });
    });

}

const openSignupForm = async (req, res) => {
    const { message } = req.query;
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({ message: message });
    }
    else return res.render('../views/auth/registration.ejs', { message })
}

const openLoginForm = async (req, res) => {
    const { message } = req.query;
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({ message: message });
    }
    else return res.render('../views/auth/login.ejs', { message })
}

const getForgotPasswordForm = async (req, res) => {
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({ message: "Forgot password form" });
    }
    else return res.render('../views/auth/forgot-password.ejs')
}

const getResetPasswordForm = async (req, res) => {
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({ message: "Reset password form" });
    }
    else return res.render('../views/auth/reset-password.ejs')
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
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }
        else return res.render('../views/auth/login.ejs', {
            message: "Please fill in all required fields"
        });
    }
    if (password.length < 8) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        else return res.render('../views/auth/login.ejs', {
            message: "Password must be at least 8 characters long"
        });
    }
    if (!email.includes('@')) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        else return res.render('../views/auth/login.ejs', {
            message: "Please enter a valid email address"
        });
    }

    const user = await User.findOne({ email: email });
    console.log('user ', user)
    if (!user) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "User not found" });
        }
        else return res.render('../views/auth/login.ejs', {
            message: "User not found"
        });
    }

    // مقارنة كلمة السر
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch ', isMatch)
    if (!isMatch) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(400).json({ message: "Incorrect password" });
        }
        else return res.render('../views/auth/login.ejs', {
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
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(500).json({ message: "خطأ في حفظ الجلسة" });
            }
            else return res.render('../views/auth/login.ejs', {
                message: "خطأ في حفظ الجلسة"
            });
        }

        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({ message: "تم تسجيل الدخول ✅", accessToken, user: req.session.user });
        }
        else res.redirect('/chat');
    });
}

const refresh = async (req, res) => {
    console.log('refresh ')
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(401).json({ message: "مطلوب تسجيل الدخول" });
        }
        else return res.render('../views/auth/login.ejs', { message: "مطلوب تسجيل الدخول" });
    }
    console.log('refreshToken ', refreshToken)
    jwt.verify(refreshToken, process.env.RefreshToken, async (err, decoded) => {
        console.log('decoded ', decoded)
        if (err) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(403).json({ message: "التوكن غير صالح" });//403 Forbidden
            }
            else return res.render('../views/auth/login.ejs', { message: "التوكن غير صالح" });
        }

        const user = await User.findById(decoded.id).exec();
        if (!user) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(401).json({ message: "المستخدم غير موجود" });
            }
            else return res.render('../views/auth/login.ejs', { message: "المستخدم غير موجود" });
        }
        const accessToken = getAccessToken(user);
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({ message: "تم تسجيل الدخول ✅", accessToken, user: req.session.user });
        }
        else res.redirect('/chat');
    });
}

const logout = async (req, res) => {
    // Destroy session with callback to ensure it's properly removed from MongoDB
    req.session.destroy((err) => {
        if (err) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(500).json({ message: "خطأ في تسجيل الخروج" });
            }
            else return res.render('../views/error.ejs', { message: "خطأ في تسجيل الخروج" });
        }

        res.clearCookie("refreshToken");
        // res.json({ message: "تم تسجيل الخروج ✅" });
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({ message: "تم تسجيل الخروج ✅" });
        }
        else res.redirect('/auth/login');
    });
}

const forgotPassword = async (req, res) => {
    console.log('forgotPassword ')
    try {
        const { email } = req.body;
        if (!email) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
            }
            else return res.render('../views/auth/forgot-password.ejs', { message: "البريد الإلكتروني مطلوب" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "المستخدم غير موجود" });
            }
            else return res.render('../views/auth/forgot-password.ejs', { message: "المستخدم غير موجود" });
        }

        // For demo purposes, we'll just return a success message
        // In a real app, you would send an email with OTP
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({ message: "تم إرسال رمز OTP إلى بريدك الإلكتروني ✅ (استخدم 1234 للاختبار)", success: true });
        }
        else res.render('../views/auth/forgot-password.ejs', { message: "تم إرسال رمز OTP إلى بريدك الإلكتروني ✅ (استخدم 1234 للاختبار)", success: true });

    } catch (error) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ message: "خطأ في الخادم، حاول مرة أخرى لاحقاً" });
        }
        else return res.render('../views/error.ejs', { message: "خطأ في الخادم، حاول مرة أخرى لاحقاً" });

    }
}

const resetPassword = async (req, res) => {
    console.log('resetPassword ')
    try {
        const { email, password, otp } = req.body;
        if (!email || !password || !otp) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "جميع الحقول مطلوبة" });
            }
            else return res.render('../views/auth/reset-password.ejs', { message: "جميع الحقول مطلوبة" });
        }

        if (password.length < 8) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
            }
            else return res.render('../views/auth/reset-password.ejs', { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "المستخدم غير موجود" });
            }
            else return res.render('../views/auth/reset-password.ejs', { message: "المستخدم غير موجود" });
        }

        if (otp !== "1234") {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "الرمز غير صحيح" });
            }
            else return res.render('../views/auth/reset-password.ejs', { message: "الرمز غير صحيح" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        console.log(`Password reset successful for user: ${user.email}`);
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح ✅", success: true });
        }
        else res.render('../views/auth/reset-password.ejs', { message: "تم تغيير كلمة المرور بنجاح ✅", success: true });

    } catch (error) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ message: "خطأ في الخادم، حاول مرة أخرى لاحقاً" });
        }
        else return res.render('../views/error.ejs', { message: "خطأ في الخادم، حاول مرة أخرى لاحقاً" });
    }
}

// Change password
const changePassword = async (req, res) => {

    try {
        const { oldPassword, newPassword, userId } = req.body;

        if (!oldPassword || !newPassword) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "All fields are required" });
            }
            else return res.render('../views/auth/change-password.ejs', { message: "All fields are required" });
        }

        if (newPassword.length < 8) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "Password must be at least 8 characters" });
            }
            else return res.render('../views/auth/change-password.ejs', { message: "Password must be at least 8 characters" });
        }

        // Find user
        const user = await User.findById({ _id: userId });
        if (!user) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(404).json({ message: "User not found" });
            }
            else return res.render('../views/auth/change-password.ejs', { message: "User not found" });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "Old password is incorrect" });
            }
            else return res.render('../views/auth/change-password.ejs', { message: "Old password is incorrect" });
        }

        // Prevent same password reuse
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
                return res.status(400).json({ message: "New password cannot be the same as old password" });
            }
            else return res.render('../views/auth/change-password.ejs', { message: "New password cannot be the same as old password" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Save
        user.password = hashedPassword;
        await user.save();

        // (Optional) Generate a new token
        const token = jwt.sign({ id: user._id }, process.env.AccessTokenSecret, { expiresIn: "1h" });

        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(200).json({
                message: "Password changed successfully ✅",
                token, // send new token if needed
            });
        }
        else res.render('../views/auth/change-password.ejs', { message: "Password changed successfully ✅", token });

    } catch (error) {
        if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
            return res.status(500).json({ message: "Server error" });
        }
        else return res.render('../views/error.ejs', { message: "Server error" });
    }
}

module.exports = { signup, login, refresh, logout, forgotPassword, resetPassword, changePassword, openSignupForm, openLoginForm, getForgotPasswordForm, getResetPasswordForm, getAccessToken }

// ونستخدم JWT (JSON Web Token) للتحقق من المستخدم
//express → لإنشاء REST API.
//jsonwebtoken → للتعامل مع الـ JWT.
//bcryptjs → لتشفير كلمة السر.