const MyCustomerSchema = require('../models/customerSchema')

const moment = require('moment')
const getAllData = (req, res) => {
    MyCustomerSchema.find()
        .then((result) => {
            console.log(result)
            res.render('home', { myTitle: 'Home Page', data: result, moment: moment }) // Render the home page
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })
    // res.sendFile(__dirname + '/views/home.ejs')

}

module.exports = { getAllData }