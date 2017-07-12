
module.exports = (io, app) => {
    let allrooms = app.locals.chatrooms;

    allrooms.push({
        room: 'CDS',
        roomID: '0001',
        users: []
    });

    allrooms.push({
        room: 'HCI',
        roomID: '0002',
        users: []
    });


    io.of('/roomslist').on('connection', socket => {
        console.log("socket connected to the clients");
        socket.on('getChatrooms', () => {
            socket.emit('chatRoomsList', JSON.stringify(allrooms));
        });
    });
};