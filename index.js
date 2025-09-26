const express = require('express')
// const morgan = require('morgan') // for logging the requests middleware
const dotenv = require('dotenv') // for loading the environment variables
dotenv.config({ path: './config.env' }) // for loading the environment variables
// import express from 'express'
const app = express()
const port = process.env.PORT || 3000
app.use(express.json()) // for parsing application/json  middleware
const mongoose = require('mongoose') // for connecting to the database
const methodOverride = require('method-override') // for handling DELETE requests via POST
// Start auto refresh the server
// NOTE: this is the livereload server
// NOTE: this is the connectLivereload server
const path = require('path') // for serving static files from the root directory
const livereload = require('livereload') // for livereload server
const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'public'))

const connectLivereload = require('connect-livereload') // for connectLivereload server


const allRoutes = require('./routes/allRoutes') // for the routes
app.use(connectLivereload())
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/')
    }, 100)
})
// End auto refresh the server
// Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded middleware 
app.use(express.static('public')) // for serving static files from the public directory
app.use(methodOverride('_method')) // for handling DELETE requests via POST middleware
app.set('view engine', 'ejs') // for rendering the views by use ejs template engine
app.set('views', __dirname + '/views') //default views directory
// app.use(morgan('combined')) // for logging the requests middleware
// Serve static files from the root directory
app.use(express.static(__dirname)) // for serving static files from the root directory middleware
// Serve static files from the node_modules/bootstrap/dist directory
app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/")) // for serving static files from the node_modules/bootstrap/dist directory
);
// Serve static files from the node_modules/bootstrap-icons/font directory
app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap-icons/font")) // for serving static files from the node_modules/bootstrap-icons/font directory
);

// Routes
app.use(allRoutes)

// Error handling middleware (must come after routes)
const { notFound, errorHandler } = require('./middlewares/errorsMeddleWare')
app.use(notFound)
app.use(errorHandler)

// تشغيل السيرفر
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

//mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/
//mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://salma_db_user:<db_password>@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// app.use('/user', allRoutes) // if you want to use the routes in the user initial file
