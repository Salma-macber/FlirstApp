
const express = require('express')
const router = express.Router()
const upload = require('../multerConfig')

const authController = require('../controllers/authController')

router.post("/signup", upload.single('profilePicture'), authController.signup);

router.get("/login", authController.openLoginForm);

router.post("/login", authController.login);

router.get("/refresh", authController.refresh);

router.get("/logout", authController.logout);

router.post("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.post("/change-password", authController.changePassword);

module.exports = router