
const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

// Home page with all data
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, userController.getAllData)

router.get('/success', (req, res, next) => { // middleware route
    console.log('Hello Middleware') // log the middleware
    next() // next middleware function to the next route or controller function or the next middleware function
    //If next() is not called, the next middleware function or the next route or controller function will not be called
    //next get/success route will not be called or the success page will not be rendered
})
router.get('/success', (req, res) => { // Success page
    // res.render('success', { title: 'Success' })
    res.status(200).json({
        message: "Success page",
    })
})
// Chat
router.get('/demoChat', (req, res) => { // Success page
    res.render('../views/chat/demoChat', { title: 'Socket' })

})
router.get('/chat', (req, res) => { // Success page

    res.render('../views/chat/chatFriendWithGroup', { title: 'FriendWithGroup', tab: req.query.tab })

})

// Test route to verify session storage
router.get('/test-session', (req, res) => {
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views++;
    }

    res.json({
        message: 'Session test',
        views: req.session.views,
        sessionId: req.sessionID,
        user: req.session.user || 'No user in session',
        isAuthenticated: req.session.isAuthenticated || false,
        loginTime: req.session.loginTime || 'Not logged in',
        hasAccessToken: !!req.session.accessToken,
        hasRefreshToken: !!req.session.refreshToken,
        sessionData: {
            user: req.session.user,
            accessToken: req.session.accessToken ? 'Present' : 'Not present',
            refreshToken: req.session.refreshToken ? 'Present' : 'Not present',
            loginTime: req.session.loginTime,
            isAuthenticated: req.session.isAuthenticated
        }
    });
})

module.exports = router