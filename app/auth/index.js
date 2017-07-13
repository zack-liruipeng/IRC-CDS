const passport = require('passport');
const config = require('../config');
const helper = require('../helpers');
const logger = require('../logger');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;


module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // Find the user using the _id
        helper.findById(id)
            .then(user => done(null, user))
            .catch(error => logger.log('error', 'Error when deserializing the user: ' + error));
    });

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        //find a user in the local db using profile
        //when the user is found, return the user data using the done()
        //if the user is not found, create in the local db 
        helper.findOne(profile.id)
            .then(result => {
                if (result) {
                    done(null, result);
                } else {
                    // Create a new user and return
                    h.createNewUser(profile)
                        .then(newChatUser => done(null, newChatUser))
                        .catch(error => logger.log('error', 'Error when creating new user: ' + error));
                }
            });

    }
    passport.use(new FacebookStrategy(config.fb, authProcessor));
    passport.use(new TwitterStrategy(config.twitter, authProcessor));
}