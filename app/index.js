const router = require('express').Router();
const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

//apply the auth logic
require('./auth')();

//create an Socket IO server
let ioServer = app => {
    //local
    app.locals.chatrooms = [];
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    //redis
    io.set('transports', ['websocket']);

    let pubClient = redis(config.redis.port, config.redis.host, {
        auth_pass: config.redis.password
    });

    let subClient = redis(config.redis.port, config.redis.host, {
        return_buffers: true,
        auth_pass: config.redis.password
    });


    io.adapter(adapter({
        pubClient,
        subClient
    }));
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
    ioServer,
    logger: require('./logger')
};