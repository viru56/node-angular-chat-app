var mongoose = require('mongoose');
const Chat = mongoose.model('Chat');
module.exports = {
    findChats,
    createChat
}

function findChats(data, cb) {
    console.log(data);
    const query = {
        $or: [
            { connection: data.sender + data.receiver },
            { connection: data.receiver + data.sender }
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