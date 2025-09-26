
const express = require('express')
const router = express.Router()

const MyCustomerSchema = require('../models/customerSchema')

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
router.get('/user/add', (req, res) => { // Add page
    res.render('user/add')
})
router.get('/user/edit', (req, res) => { // Edit page
    res.render('user/edit', { myTitle: 'Edit User' })
})
router.get('/user/view', (req, res) => { // View page
    res.render('user/view', { myTitle: 'View User' })
})

router.delete('/user/delete/:id', (req, res) => {
    console.log('Data deleted successfully')
    const id = req.params.id
    MyCustomerSchema.findByIdAndDelete(id)
        .then(() => {
            console.log('Data deleted successfully')
            res.redirect('/') // Redirect back to home page after successful save
        })
        .catch((err) => {
            console.error('Error deleting data:', err)
            res.status(404).send('Error deleting data from database, user not found')
            // res.status(500).send('Error deleting data from database')
        })
    // res.render('user/delete', { myTitle: 'Delete User' })
    // res.redirect('/success') // Redirect back to home page after successful save
})

// View page with all data by id
router.get('/user/view/:id', (req, res) => {
    const id = req.params.id
    MyCustomerSchema.findById(id)
        .then((result) => {
            res.render('user/view', { myTitle: 'View User', data: result, moment: moment })
        })
})

// Edit page with all data by id
router.get('/user/edit/:id', (req, res) => {
    const id = req.params.id
    MyCustomerSchema.findById(id)
        .then((result) => {
            res.render('user/edit', { myTitle: 'Edit User', data: result, })
        })
})
router.put('/user/edit/:id', (req, res) => {
    const id = req.params.id
    MyCustomerSchema.findByIdAndUpdate(id, req.body)
        .then(() => {
            console.log('Data updated successfully')
            res.redirect('/success') // Redirect back to home page after successful update
        })
})
// Add data
router.post('/user/add', (req, res) => {
    // NOTE: this is the data that is sent to the database 

    MyCustomerSchema.create(req.body)
        .then(() => {
            console.log('Data saved successfully')
            res.redirect('/success') // Redirect back to home page after successful save
        })
        .catch((err) => {
            console.error('Error saving data:', err)
            res.status(500).send('Error saving data to database')
        })
})
router.post('/search', (req, res) => {
    const value = req.body.value.trim()
    MyCustomerSchema.find({
        // userAge: value
        // userAge: {$gt: value }
        $or: [{ userFirstName: value }, { userLastName: value }]
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

// // Update data by id
// app.put('/user/edit/:id', (req, res) => {
//     const id = req.params.id
//     MyCustomerSchema.findByIdAndUpdate(id, req.body)
//         .then(() => {
//             console.log('Data updated successfully')
//             res.redirect('/success') // Redirect back to home page after successful update
//         })
// })


module.exports = router