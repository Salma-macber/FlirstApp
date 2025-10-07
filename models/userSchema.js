const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: 3,
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    gender: {
        type: String,
        lowercase: true,
    },
    country: {
        type: String,
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: String,
    profilePicture: String,
    googleId: {
        type: String,
        unique: true,
        sparse: true, // allows multiple null values
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true, // allows multiple null values
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId && !this.facebookId; // password required only if not OAuth user
        },
        minlength: [8, 'password must be at least 8 characters long'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User