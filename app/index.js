const router = require('express').Router();

module.exports = {
    router: require('./routes')(),
    session: require('./session')
};