const userSchema = require('../models/userSchema')

const moment = require('moment')

const getAllData = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) res.render('auth/login');

    userSchema.find().select('-password').lean()
        .then((result) => {
            console.log(result)
            res.render('home', { myTitle: 'Home Page', data: result, moment: moment }) // Render the home page
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })

}

module.exports = { getAllData }