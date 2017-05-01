var mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    findAllUsers,
    updateUser
}

function findAllUsers(senderId, cb) {
    var projection = { 'email': 1, 'username': 1, 'image': 1, 'latitude': 1, 'longitude': 1, 'phone': 1, 'logedIn': 1 };
    User.find({ _id: { $ne: senderId } }, projection)
        .then((users) => cb(null, users))
        .catch((error) => cb(error, null));
};
function updateUser(query, cb) {
    let findQuery = {};
    if (query.id) {
        findQuery._id = query.id;
    } else {
        findQuery.socketId = query.socketId;
    }
    if (Object.keys(findQuery).length > 0) {
        User.findOne(findQuery).then((user) => {
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
                user.save();
            } else {
                console.log("No Id Found findQuery", findQuery);
            }
        }).catch((err) => console.log(err));
    } else {
        console.log("No Id Found findQuery", findQuery);
    }
};