const mongoose = require('mongoose') // for connecting to the database

// NOTE: and add all-data inside /?    AS a Collection Name
const connectDB = async () => {
    console.log('Connecting to MongoDB')
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch((err) => {
            console.log('Error connecting to MongoDB', err)
        })
}
//mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/
//mongodb+srv://salma_db_user:$SalmaAMKBEssam$@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://salma_db_user:<db_password>@cluster0.xl3c3oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
module.exports = connectDB