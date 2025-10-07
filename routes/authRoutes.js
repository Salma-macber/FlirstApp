
const express = require('express')
const router = express.Router()
const upload = require('../multerConfig')
const passport = require('../config/passport');
const authController = require('../controllers/authController')

router.get("/signup", authController.openSignupForm);
router.post("/signup", upload.single('profilePicture'), authController.signup);
router.get("/login", authController.openLoginForm);
router.post("/login", authController.login);
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/callback",
    passport.authenticate("google", {  scope: ['profile', 'email'],failureRedirect: "/" }),
    (req, res) => {
        console.log(req.user);
        res.send(`<h2>Welcome ${req.user.displayName} 🎉</h2>`);
    }
);
router.get("/refresh", authController.refresh);
router.get("/logout", authController.logout);
// router.post("/logout", authController.logout);
router.get("/forgot-password", authController.getForgotPasswordForm);
router.post("/forgot-password", authController.forgotPassword);
router.get("/reset-password", authController.getResetPasswordForm);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authController.changePassword);

module.exports = router