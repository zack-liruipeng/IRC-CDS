const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

//check whether connected or not
Mongoose.connection.on('error', error => {
    console.log('MongoDB Error: ', error);
}); 

module.exports = {
    Mongoose
};