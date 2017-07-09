const passport = require('passport');
const config = require('../config');
const FacebookStrategy = require('passport-faceboook').Strategy;

module.exports = () => {

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        //find a user in the local db using profile
        //when the user is found, return the user data using the done()
        //if the user is not found, create in the local db 
        
    }
    passport.use(new FacebookStrategy(config.fb, authProcessor));
}