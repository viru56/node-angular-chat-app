var mongoose = require('mongoose');
var User = mongoose.model('User');
var Room = require('./room.controller');
module.exports = {
    findAllUsers,
    updateUser,
    getSocketId
}

function findAllUsers(userId, cb) {
    var projection = { 'email': 1, 'username': 1, 'image': 1, 'latitude': 1, 'longitude': 1, 'phone': 1, 'logedIn': 1, 'socketId': 1 };
    User.find({ _id: { $ne: userId } }, projection)
        .then((users) => {
            Room.findAllRooms(userId, (err, rooms) => {
                for (let room of rooms) {
                    for (let user of users) {
                        if (room.sender.equals(user._id)) {
                            user.connection = room.connection;
                            user.unreadMessage = room.unreadMessage;                          
                        }
                    }
                }
                cb(null, users);
            });
        })
        .catch((error) => cb(error, null));
}

function updateUser(query, cb) {
    if (query._id) {
        User.findById(query._id).then((user) => {
            if (user) {
                if (typeof query.logedIn !== "undefined") {
                    user.logedIn = query.logedIn;
                }
                if (typeof query.socketId !== "undefined") {
                    user.socketId = query.socketId;
                }
                if (typeof query.unreadMessage !== "undefined") {
                    user.unreadMessage = query.unreadMessage;
                }
                user.save().then(() => cb(null, user.toAuthJSON())).catch((err) => cb(err, null));
            } else {
                console.log("user Not Found", query);
            }
        }).catch((err) => console.log(err));
    } else {
        console.log("No Id Found", query);
    }
}

function getSocketId(userId, cb) {
    User.findById(userId, { 'socketId': 1, '_id': 0 })
        .then((doc) => cb(null, doc.socketId))
        .catch((err) => cb("No Id Found", null))
}