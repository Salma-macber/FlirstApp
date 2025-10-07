const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/userSchema');

// Google OAuth strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('✅ Google OAuth credentials found');
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
    }, (request, accessToken, refreshToken, profile, done) => {
        // Save or find the user in DB
        return done(null, profile);
    }));
    console.log('✅ Google OAuth strategy registered successfully');
} else {
    console.log('⚠️  Google OAuth credentials not configured. Google authentication will be disabled.');
    console.warn('⚠️  Google OAuth credentials not configured. Google authentication will be disabled.');
    // Register a dummy strategy to prevent "Unknown authentication strategy" error
    passport.use('google', new (class {
        constructor() {
            this.name = 'google';
        }

        authenticate(req, options) {
            return (req, res, next) => {
                res.status(400).json({
                    error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in config.env'
                });
            };
        }
    })());
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
