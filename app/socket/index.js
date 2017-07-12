const helper = require('../helpers');

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


        socket.on('createNewRoom', newRoomInput => {
            console.log(newRoomInput);
            //check to see if a room with the same anme or not
            //if not, create one and broadcase it to everyone
            if (!helper.findRoomByName(allrooms, newRoomInput)) {
                allrooms.push({
                    room: newRoomInput,
                    roomID: helper.randomHex(),
                    users: []
                });

                //emit new list to the creator
                socket.emit('chatRoomsList', JSON.stringify(allrooms));
                //emit new list ot everyone connected
                socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
            }
        })
    });


    io.of('/chatter').on('connection', socket => {
        //join the room
        socket.on('join', data => {
            console.log(data);
            let usersList = helper.addUserToRoom(allrooms, data, socket);

            //update the list of active users as shown on the chatroom page
            //  console.log('userList:' + usersList);

            socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
            socket.emit('updateUsersList', JSON.stringify(usersList.users));
        });


        //when a new message arrives
        socket.on('newMessage', data => {
            socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
        });

        //user exits
        socket.on('disconnect', () => {
            let room = helper.removeUserFromRoom(allrooms, socket);
            socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
        });
    })
};