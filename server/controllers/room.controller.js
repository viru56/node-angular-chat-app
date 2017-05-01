var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var Chat = mongoose.model('Chat');
var User = mongoose.model('User');

module.exports = {
    findOrCreateRoom,
    createRoom,
    findAllRooms,
    updateRoom
}

function findOrCreateRoom(data, cb) {
    const query = {
        $or: [
            { connection: data.sender + '-' + data.receiver },
            { connection: data.receiver + '-' + data.sender }
        ]
    }
    Room.findOne(query).then((room) => {
        if (room) {
            Chat.find({ connection: room.connection }).then((docs) => {
                cb(null, {
                    room: room.toJSON(),
                    messages: docs
                });

            }).catch((err) => cb(err, null));
        } else {
            createRoom(data, cb);
        }
    }).catch((err) => cb(err, null));
};

function createRoom(data, cb) {
    const query = {
        connection: data.sender + '-' + data.receiver,
        createdBy: data.sender,
        receivers: [{ _id: data.sender }, { _id: data.receiver }]
    }
    Room.create(query)
        .then((room) => {
            cb(null, {
                room: room.toJSON(),
                messages: []
            });
        })
        .catch((err) => cb(err, null));
};

function findAllRooms(senderId, cb) {
    Room.find({ receivers: { $elemMatch: { _id: senderId } } })
        .then((rooms) => cb(null, rooms))
        .catch((err) => cb(err, null))
}
function updateRoom(data) {
    Room.findOne({ connection: data.connection }).then((room) => {
        for (var i = 0; i < room.receivers.length; i++) {
            if (data.sender == room.receivers[i]._id) {
                if (data.receiver) {
                    room.receivers[i].unreadMessage += 1;
                } else{
                    room.receivers[i].unreadMessage = 0;
                }
                break;
            }
        }
        room.save();
    });
}