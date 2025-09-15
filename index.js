const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const MyData = require('./models/dataSchema')

// Start auto refresh the server
// NOTE: this is the livereload server
// NOTE: this is the connectLivereload server
const path = require('path')
const livereload = require('livereload')
const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'public'))
const connectLivereload = require('connect-livereload')
app.use(connectLivereload())
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/')
    }, 100)
})
// End auto refresh the server
// Middleware to parse JSON and URL-encoded data
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('view engine', 'ejs') // for rendering the views
app.set('views', __dirname + '/views') // for rendering the views

// Serve static files from the root directory
app.use(express.static(__dirname))

app.get('/', (req, res) => {
    MyData.find()
        .then((result) => {
            console.log(result)
            res.render('home', { myTitle: 'Home Page', data: result }) // Render the home page
        })
        .catch((err) => {
            console.log('Error fetching data', err)
            res.status(500).send('Error fetching data from database')
        })
    // res.sendFile(__dirname + '/views/home.html')

})

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/views/success.html')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}, open => http://localhost:${port} inside your browser to see the result`)
})
// NOTE: and add all-data inside /?    AS a Collection Name
mongoose.connect('mongodb+srv://salma_db_user:85wtDax!PL*jvrZ@cluster0.xl3c3oh.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })

app.post('/send-to-db', (req, res) => {
    // NOTE: this is the data that is sent to the database 
    console.log(`Data sent to MongoDB ${req.body}`)
    const { userName, userPassword } = req.body
    const newData = new MyData({ userName, userPassword })

    newData.save()
        .then(() => {
            console.log('Data saved successfully')
            res.redirect('/success') // Redirect back to home page after successful save
        })
        .catch((err) => {
            console.error('Error saving data:', err)
            res.status(500).send('Error saving data to database')
        })
})


//mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/
//mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://salma_db_user:<db_password>@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0