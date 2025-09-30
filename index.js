const express = require('express')
// const morgan = require('morgan') // for logging the requests middleware
const dotenv = require('dotenv') // for loading the environment variables
dotenv.config({ path: './config.env' }) // for loading the environment variables
const mongoose = require('mongoose') // for connecting to the database
// app.use(mongoose)
const connectDB = require('./controllers/dbController') // for connecting to the database
// import express from 'express'
const app = express()
const port = process.env.PORT || 3000
const port2 = process.env.PORT2 || 3001

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
// setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || process.env.BACKEND_URL, // you can change it to http://localhost:3000 for example
        methods: ['GET', 'POST'],
    },
});

// when a new client connects to the server
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);
    //socket is connection to the server with the specific client
    // receive message from the client
    socket.on('chatMessage', (msg) => {
        console.log(`💬 message from ${socket.id}: ${msg}`);
        socket.emit('chatMessage', msg);

        //io.emit because it is sending the message to all the clients (including the sender)
        // io.emit('chatMessage', msg);
        // io.to(socket.id).emit('chatMessage', msg);
        // but we want to send the message to all the clients except the sender
        // so we use socket.broadcast.emit
        // socket.broadcast.emit('chatMessage', msg);
    });
    socket.on('newChatMessageToRoom', (room, msg) => {
        console.log(`💬 message from ${socket.id}: ${msg}`);
        io.to(`${room}`).emit('newMsg', msg);

    });
    socket.on('sendMessageToRoomExceptSender', (room, msg) => {
        console.log(`💬 message from ${socket.id}: ${msg}`);
        socket.broadcast.to(`${room}`).emit('newMsg', msg);

    });

    socket.on('joinRoom', (room) => {
        console.log(`room: ${room}🔌 User joined room: ${socket.id} in room: ${room}`);
        socket.join(`${room}`);
    });
    socket.on('leaveRoom', (room) => {
        console.log(`room: ${room}❌ User left room: ${socket.id} in room: ${room}`);
        socket.leave(`${room}`);
    });

    // when the client disconnects from the server
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// start the http server 
// and the socket.io server is connected to the http server
server.listen(port2, () => {
    console.log(`🔥 Server running at http://localhost:${port2}`);
});

// Start auto refresh the server
const path = require('path') // for serving static files from the root directory
const livereload = require('livereload') // for livereload server
const liveReloadServer = livereload.createServer({
    port: 35729 // Use a different port to avoid conflicts
})
liveReloadServer.watch(path.join(__dirname, 'public'))

const connectLivereload = require('connect-livereload') // for connectLivereload server

app.use(express.json()) // for parsing application/json  middleware
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded middleware 
// Middleware to parse JSON and URL-encoded data
const methodOverride = require('method-override') // for handling DELETE requests via POST

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

//Start cors
const cors = require('cors')

app.use(cors(
    {
        origin: process.env.FRONTEND_URL || process.env.BACKEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200,
        credentials: true,
    }
))
//End cors
//Start cookieParser
const cookieParser = require('cookie-parser')
app.use(cookieParser())
//End cookieParser

app.use(connectLivereload({
    port: 35729 // Use the same port as livereload server
}))
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/')
    }, 100)
})
// End auto refresh the server

connectDB()

//Start authRoutes
const authRoutes = require('./routes/authRoutes') // for the Auth routes
app.use('/auth', authRoutes) // if you want to use the routes in the user initial file
//Start allRoutes
const allRoutes = require('./routes/allRoutes') // for the routes
app.use(allRoutes)
//End allRoutes
const userRoutes = require('./routes/userRoutes') // for the user routes
app.use('/user', userRoutes) // if you want to use the routes in the user initial file

mongoose.connection.once('open', (err) => {
    console.log('Connecting to mongoose server')
    // start the mongoose server 
    app.listen(port, () => {
        console.log(`App listening on port ${port}, open => http://localhost:${port} inside your browser to see the result`)
    })
})