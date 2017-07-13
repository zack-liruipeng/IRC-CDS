'use strict';

const config = require('../config');
const logger = require('../logger');
const Mongoose = require('mongoose').connect(config.dbURI);

//check whether connected or not
Mongoose.connection.on('error', error => {
	logger.log('error', 'Mongoose connection error: ' + error);
});

//create the schema
const chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

// turn to the usable model
let userModel = Mongoose.model('chatUser', chatUser);



module.exports = {
    Mongoose,
    userModel
};