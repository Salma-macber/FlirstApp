const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')

// Serve static files from the root directory
app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}, open => http://localhost:${port} inside your browser to see the result`)
})
// NOTE: and add all-data inside /?
mongoose.connect('mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })



    //mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/
    //mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    //mongodb+srv://salma_db_user:<db_password>@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0