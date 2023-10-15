var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const passport = require("passport");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://transparent-potent-typhoon.glitch.me/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {

        cb(null, profile)
    }
));



module.exports = passport;