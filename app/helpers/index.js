const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

//iterate throught the routes object and mount the routes
let _registerRoutes = (routes, method) => {
    for (let key in routes) {
        if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
            _registerRoutes(routes[key], key);
        } else {
            //register the routes
            if (method === 'get') {
                router.get(key, routes[key]);
            } else if (method === 'post') {
                router.post(key, routes[key]);
            } else {
                router.use(routes[key]);
            }
        }
    }
}

let route = routes => {
    _registerRoutes(routes);
    return router;
};

//find a single user based on a key
let findOne = profileId => {
    return db.userModel.findOne({
        'profileId': profileId
    })
}

//register the new user
let createNewUser = profile => {
    return new Promise((resolve, reject) => {
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
        });

        newChatUser.save(error => {
            if (error) {
                reject(error);
            } else {
                resolve(newChatUser);
            }
        });
    });
}

//find by Id
let findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

//check if user is authenticated or not
let isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/");
    }
};

let findRoomByName = (allrooms, room) => {
    let findRoom = allrooms.findIndex((element, index, array) => {
        if (element.room === room) {
            return true;
        } else {
            return false;
        }
    });
    return findRoom > -1 ? true : false;
};

//generate the room Id
let randomHex = () => {
    return crypto.randomBytes(24).toString('hex');
};

//find a room with the given id
let findRoomById = (allrooms, roomID) => {
    return allrooms.find((element, index, array) => {
        if (element.roomID === roomID) {
            return true;
        } else {
            return false;
        }
    });
}

//add users to a chatroom
let addUserToRoom = (allrooms, data, socket) => {
    //get the room object
    let getRoom = findRoomById(allrooms, data.roomID);
    if (getRoom !== undefined) {
        // get the active user's Id (objectId as used in session)
        let userID = socket.request.session.passport.user;
        //check to see if this user already exist in the chatroom
        let checkUser = getRoom.users.findIndex((element, index, array) => {
            if (element.userID === userID) {
                return true;
            } else {
                return false;
            }
        });

        //if the user is already present in the room, remove him first
        if (checkUser > -1) {
            getRoom.users.splice(checkUser, 1);
        }

        //push the user into the room's user array
        getRoom.users.push({
            socketID: socket.id,
            userID,
            user: data.user,
            userPic: data.userPic
        });

        //Join the room channel
        socket.join(data.roomID);

        //return the updated room object
        return getRoom;
    }
};

let removeUserFromRoom = (allrooms, socket) => {
    for (let room of allrooms) {
        let findUser = room.user.findIndex((element, index, array) => {
            if (element.socketID === socket.id) {
                return true;
            } else {
                return false;
            }
            //return element.socketId === socket.id ? true : false
        });

        if (findUser > -1) {
            socket.leave(room.roomID);
            room.user.splice(findUser, 1);
            return room;
        }
    }
}


module.exports = {
    route,
    findOne,
    createNewUser,
    findById,
    isAuthenticated,
    findRoomByName,
    randomHex,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
};
