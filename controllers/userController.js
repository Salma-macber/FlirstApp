const userSchema = require('../models/userSchema')

const moment = require('moment')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')

const getAllData = (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) res.render('../views/auth/login');
    // If you need to send the token as a header to the client, you can set it in the response headers.
    // For example, if you have a token (e.g., refreshToken), you can do:

    userSchema.find().select('-password').lean()
        .then((result) => {
            console.log(result)
            // res.status(200).json({
            //     message: "Data fetched successfully",
            //     data: result
            // })
            res.render('../views/home', { myTitle: 'Home Page', data: result, moment: moment, user: req.session.user })

            // res.render('home', { myTitle: 'Home Page', data: result, moment: moment }) // Render the home page
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })

}
const getUserById = (req, res) => {
    const id = req.params.id

    userSchema.findById({ _id: id })
        .then((result) => {
            // res.status(200).json({
            //     message: "Data fetched successfully",
            //     data: result
            // })
            res.render('user/view', { myTitle: 'View User', data: result, moment: moment })
        })
}

const addUserView = (req, res) => { // Add page
    console.log('Add page')
    console.log('req.user ', req.user)
    res.render('user/add', { user: req.session.user })
}
const addUser = (req, res) => async (req, res) => {
    const { email, role, phone, name, gender, country, age } = req.body
    const profilePicture = req.file;
    const hashedPassword = await bcrypt.hash('1234567890', 10);
    const newUser = {
        name: name,
        email: email,
        role: role,
        phone: phone,
        country: country,
        gender: gender,
        age: age,
        password: hashedPassword,
        profilePicture: profilePicture ? `${req.protocol}://${req.get('host')}/uploads/${profilePicture.filename}` : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: slugify(name)
    };

    userSchema.create(newUser)
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
}
const updateUser = (req, res) => {
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
}
const deleteUser = (req, res) => {
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
}
const searchUser = (req, res) => {
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
}
const editUserView = (req, res) => {
    res.render('user/edit', { myTitle: 'Edit User' })
}
const editUser = (req, res) => {
    const id = req.params.id
    userSchema.findById(id)
        .then((result) => {
            res.render('user/edit', { myTitle: 'Edit User', data: result, })
        })
}
const viewHome = (req, res) => { // View page
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
}
const profile = (req, res) => {
    res.json({ message: "مرحباً بك 🙌", user: req.user });
    // res.render('profile', { myTitle: 'Profile', user: req.user })
}
module.exports = { profile, viewHome, getAllData, addUser, deleteUser, editUser, getUserById, addUserView, updateUser, searchUser, editUserView, profile }