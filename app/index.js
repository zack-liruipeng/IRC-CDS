const router = require('express').Router();

//apply the auth logic
require('./auth')();

//create an Socket IO server
let ioServer = app => {
    //local
    app.locals.chatrooms = [];
    //set up the server
    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    //socket middleware
    io.use((socket, next) => {
        //empty response
        require('./session')(socket.request, {}, next);
    });
    require('./socket')(io, app);
    return server;
}

module.exports = {
    router: require('./routes')(),
    session: require('./session'),
    ioServer
};