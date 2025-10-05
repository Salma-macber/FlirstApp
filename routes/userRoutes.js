const express = require('express')
const router = express.Router()

const userSchema = require('../models/userSchema')
const moment = require('moment')

//Start authMiddleware
const authMiddleware = require('../middlewares/authMiddleware')
router.use(authMiddleware)
//End authMiddleware

router.get('/view', (req, res) => { // View page
    console.log('View page')
    userSchema.find().select('-password').lean()
        .then((result) => {
            console.log(result)
            res.status(200).json({
                message: "Data fetched successfully",
                data: result
            })
            // res.render('home', { myTitle: 'Home Page', data: result, moment: moment }) // Render the home page
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })

    // res.render('user/view', { myTitle: 'View User' })
})

router.delete('/delete/:id', (req, res) => {
    console.log('Data deleted successfully')

    const id = req.params.id
    userSchema.findByIdAndDelete({ _id: id })
        .then(() => {
            console.log('Data deleted successfully')
            res.status(200).json({
                message: "Data deleted successfully",
            })
            // res.redirect('/') // Redirect back to home page after successful save
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
router.get('/view/:id', (req, res) => {
    const id = req.params.id

    userSchema.findById({ _id: id })
        .then((result) => {
            // res.status(200).json({
            //     message: "Data fetched successfully",
            //     data: result
            // })
            res.render('user/view', { myTitle: 'View User', data: result, moment: moment })
        })
})

router.post('/add', (req, res) => {
    // NOTE: this is the data that is sent to the database 
    userSchema.create(req.body)
        .then((result) => {
            console.log('Data saved successfully')
            res.status(200).json({
                message: "Data saved successfully",
                data: result,
                user: req.session.user
            })
            // res.redirect('/success') // Redirect back to home page after successful save
        })
        .catch((err) => {
            console.error('Error saving data:', err)
            res.status(500).send('Error saving data to database')
        })
})
router.put('/edit/:id', (req, res) => {
    const id = req.params.id

    userSchema.findByIdAndUpdate({ _id: id }, req.body)
        .then((result) => {
            console.log('Data updated successfully')
            res.status(200).json({
                message: "Data updated successfully",
                oldData: result
            })
            // res.redirect('/success') // Redirect back to home page after successful update
        }).catch((err) => {
            console.error('Error updating data:', err.message)
            res.status(500).send('Error updating data to database', err.message)
        })
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
            // res.render('user/search', { myTitle: 'Search User', data: result, moment: moment })
            res.status(200).json({
                message: "Data fetched successfully",
                data: result
            })
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })
})
router.get('/add', (req, res) => { // Add page
    res.render('user/add', { user: req.session.user })
})
///////////////////////////////////////////////////////////////
// router.get('/edit', (req, res) => { // Edit page
//     res.render('user/edit', { myTitle: 'Edit User' })
// })
// Edit page with all data by id
// router.get('/edit/:id', (req, res) => {
//     const id = req.params.id
//     userSchema.findById(id)
//         .then((result) => {
//             res.render('user/edit', { myTitle: 'Edit User', data: result, })
//         })
// })
//router.get("/profile", authMiddleware.authMiddleware, (req, res) => {
//  res.json({ message: "مرحباً بك 🙌", user: req.user });
//res.render('profile', { myTitle: 'Profile', user: req.user })
//});
// // Update data by id
// app.put('/user/edit/:id', (req, res) => {
//     const id = req.params.id
//     userSchema.findByIdAndUpdate(id, req.body)
//         .then(() => {
//             console.log('Data updated successfully')
//             res.redirect('/success') // Redirect back to home page after successful update
//         })
// })

module.exports = router