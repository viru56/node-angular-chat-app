var mongoose = require('mongoose');
const Chat = mongoose.model('Chat');
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
    Chat.find(query)
        .then((docs) => cb(null, docs))
        .catch((error) => cb(error, null));
};
function createChat(query, cb) {
    Chat.create(query)
        .then((doc) => cb(null, doc))
        .catch((error) => cb(error, null));

};