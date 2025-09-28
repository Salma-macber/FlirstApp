
const express = require('express')
const router = express.Router()

const userSchema = require('../models/userSchema')

const moment = require('moment')

const userController = require('../controllers/userController')


// Home page with all data
router.get('/', userController.getAllData)

router.get('/success', (req, res, next) => { // middleware route
    console.log('Hello Middleware') // log the middleware
    next() // next middleware function to the next route or controller function or the next middleware function
    //If next() is not called, the next middleware function or the next route or controller function will not be called
    //next get/success route will not be called or the success page will not be rendered
})
router.get('/success', (req, res) => { // Success page
    res.render('success', { title: 'Success' })
})

router.post('/search', (req, res) => {
    const value = req.body.value.trim()
    userSchema.find({
        // userAge: value
        // userAge: {$gt: value }
        $or: [{ name: value }, { email: value }]
    })
        .then((result) => {
            console.log('Data fetched successfully', result)
            res.render('user/search', { myTitle: 'Search User', data: result, moment: moment })

        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })
})

module.exports = router