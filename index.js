const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}, open => http://localhost:${port} inside your browser to see the result`)
})
