const userSchema = require('../models/userSchema')

const moment = require('moment')

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

module.exports = { getAllData }