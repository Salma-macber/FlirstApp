const express = require('express')
const router = express.Router()
const upload = require('../multerConfig')
const hasRole = require('../middlewares/hasRoleMiddleware')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
router.use(authMiddleware) // for apply authMiddleware to all routes

//GET routes
router.get('/view', userController.viewHome)
router.get('/view/:id', userController.getUserById)
router.get('/add', hasRole(['admin']), userController.addUserView) // for apply hasRoleMiddleware to addUserView route
router.get('/edit', hasRole(['admin']), userController.editUserView);
router.get('/edit/:id', hasRole(['admin']), userController.editUser)
router.get("/profile", userController.profile);
router.get("/profile/edit", userController.editProfileView);
router.get("/settings", userController.settingsView);
router.get("/settings/export-data", userController.exportData);

//POST routes
router.post("/profile/edit", upload.single('profilePicture'), userController.updateProfile);
router.post("/settings/profile-picture", upload.single('profilePicture'), userController.updateProfilePicture);
router.post("/settings/password", userController.changePassword);
router.post('/add', hasRole(['admin']), upload.single('profilePicture'), userController.addUser)
router.post('/search', userController.searchUser)

//PUT routes
router.put('/edit/:id', hasRole(['admin']), userController.updateUser)

//DELETE routes
router.delete("/settings/delete-account", userController.deleteAccount);
router.delete('/delete/:id', hasRole(['admin']), userController.deleteUser)

module.exports = router