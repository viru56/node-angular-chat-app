var mongoose = require('mongoose');
const Chat = mongoose.model('Chat');
const Room = require('./room.controller');
module.exports = {
    findChats,
    createChat
}

function findChats(userId, cb) {
    const query = {
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    }
    Chat.find(query).limit(15).sort({createdAt:-1}).skip(0)
        .then((docs) => cb(null, docs.sort((a,b)=>a.createdAt - b.createdAt)))
        .catch((error) => cb(error, null));
};
function createChat(query, cb) {
    Chat.create(query)
        .then((doc) => {
            Room.CreateOrUpdateRoom(query, (err, room) => {
                cb(null, { doc, room })
            });
        })
        .catch((error) => cb(error, null));

};