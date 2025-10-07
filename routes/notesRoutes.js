
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
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman')
        return res.status(200).json({
            message: "Success page",
        })

    else return res.render('success', { title: 'Success' })

})
router.get('/error', (req, res) => { // Success page
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman')
        return res.status(200).json({ title: 'Error', message: req.query.message })
    else return res.render('error', { title: 'Error', message: req.query.message })
})
module.exports = router