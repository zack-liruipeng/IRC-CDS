if(process.env.NODE_ENV === 'production') {
    //offer production stage environment variables
    module.exports = {
        host: process.env.host || "" , 
        dbURI: process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        fb: {
            cliendID: process.env.fbClientId,
            clientSecret: process.env.fbClientSecret,
            callbackURL: process.env.host + "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos']
        }
    }
} else {
    module.exports = require('./development.json');
}