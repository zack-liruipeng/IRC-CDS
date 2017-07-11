const passport = require('passport');
const config = require('../config');
const helper = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;


module.exports = () => {

    passport.serializeUser((user, done) => {　
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        helper.findById(id)
            .then(user => done(null, user))
            .catch(error => console.error("error when deserializing the user"));
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
                    // create a new user and return 
                    helper.createNewUser(profile)
                        .then(newChatUser => done(null, newChatUser))
                        .catch(error => console.error('error occured when create the new user!'));
                }
            });
    }
    passport.use(new FacebookStrategy(config.fb, authProcessor));
    passport.use(new TwitterStrategy(config.twitter, authProcessor));
}