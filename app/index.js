const router = require('express').Router();

//apply the auth logic
require('./auth')();

module.exports = {
    router: require('./routes')(),
    session: require('./session')
};