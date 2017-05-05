var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var Chat = mongoose.model('Chat');
var User = mongoose.model('User');

module.exports = {
    CreateOrUpdateRoom,
    createRoom,
    findAllRooms,
    updateUnreadMessageToZero
}

function CreateOrUpdateRoom(data, cb) {
    const query = { connection: data.sender + '-' + data.receiver }
    Room.findOne(query).then((room) => {
        if (room) {
            room.unreadMessage += 1;
            room.save();
            cb(null, room.toJSON());
        } else {
            createRoom(data, cb);
        }
    }).catch((err) => cb(err, null));
};

function createRoom(data, cb) {
    const query = {
        connection: data.sender + '-' + data.receiver,
        sender: data.sender,
        receiver: data.receiver
    }
    Room.create(query)
        .then((room) => cb(null, room.toJSON()))
        .catch((err) => cb(err, null));
};

function findAllRooms(userId, cb) {
    Room.find({ receiver: userId }, { '_id': 0, 'connection': 1, 'sender': 1, 'unreadMessage': 1 })
        .then((rooms) => {
            cb(null, rooms)
        })
        .catch((err) => cb(err, null))
}
function updateUnreadMessageToZero(connection) {
    Room.findOne({ connection: connection }).then((room) => {
        room.unreadMessage = 0;
        room.save();
    }).catch((err)=>console.log(err));
}