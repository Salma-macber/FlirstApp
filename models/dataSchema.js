const mongoose = require('mongoose')
const Schema = mongoose.Schema
// NOTE: this is the schema for the data
const dataSchema = new Schema({
    // NOTE: this is the schema for the data
    userName: String,
    userPassword: String
})

// NOTE: this is the model for the data
const MyData = mongoose.model('Data', dataSchema)
// Export the model
module.exports = MyData
