const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');

const User = require('../models/userSchema');

// Google OAuth strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('✅ Google OAuth credentials found');
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists by Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Create new user if doesn't exist
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                profilePicture: profile.photos[0].value,
                role: 'user',
                isActive: true
            });

            await user.save();
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
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
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    console.log('✅ Facebook OAuth credentials found');
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:3000/auth/facebook/callback",
        profileFields: ['displayName', 'emails'] // get email & name
    }, (accessToken, refreshToken, profile, done) => {
        // Here you can store the user in your DB
        console.log('Facebook profile:', profile);

        // For now, just return the profile to avoid serialization error
        // TODO: Implement proper user creation
        return done(null, { _id: 'temp', name: profile.displayName, displayName: profile.displayName });
    }));

} else {
    console.log('⚠️  Facebook OAuth credentials not configured. Facebook authentication will be disabled.');
    // Register a dummy strategy to prevent "Unknown authentication strategy" error
    passport.use('facebook', new (class {
        constructor() {
            this.name = 'facebook';
        }

        authenticate(req, options) {
            return (req, res, next) => {
                res.status(400).json({
                    error: 'Facebook OAuth not configured. Please set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in config.env'
                });
            };
        }
    })());
}

// Serialize and deserialize user (moved outside the Facebook block)
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user._id);
    done(null, user._id); // Use MongoDB _id instead of Google ID
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user with ID:', id, 'Type:', typeof id);

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid ObjectId, clearing session');
            return done(null, false);
        }

        const user = await User.findById(id);
        if (!user) {
            console.log('User not found, clearing session');
            return done(null, false);
        }

        done(null, user);
    } catch (err) {
        console.log('Error deserializing user:', err.message);
        done(err, null);
    }
});

module.exports = passport;
