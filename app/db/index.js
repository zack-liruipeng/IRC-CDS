const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

//check whether connected or not
Mongoose.connection.on('error', error => {
    console.log('MongoDB Error: ', error);
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