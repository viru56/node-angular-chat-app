var Chat = require('../controllers/chat.controller');
var Room = require('../controllers/room.controller');
var User = require('../controllers/user.controller');
module.exports = (app, server) => {

    var io = require('socket.io').listen(server);

    io.on('connection', (socket) => {
        socket.on('join', (userId) => {
            // console.log('user joined', socket.id);
            socket.userId = userId;
            var query = {
                _id: userId,
                socketId: socket.id,
                logedIn: {
                    isLogedIn: true,
                    lastLogedIn: new Date()
                }
            }
            User.updateUser(query, (err, user) => {
                if (user) {
                    socket.broadcast.emit('user-join-left', user);
                } else {
                    socket.broadcast.to(socket.id).emit('user-join-left', err); //not implimented yet clinet side future ref
                }
            });
        });

        socket.on('get-users', (userId) => {
            User.findAllUsers(userId, (err, users) => {
                socket.emit('set-users', users);
            });
        });
        socket.on('get', (data) => {
            Chat.createChat(data, (err, roomMsg) => {
                socket.broadcast.to(data.socketId).emit('set', roomMsg);
            });
        });
        socket.on('get-writer', (data) => {
            socket.broadcast.to(data.socketId).emit('set-writer', data.writerName);
        });
        socket.on('get-chat-history', (userId) => {
            Chat.findChats(userId, (err, docs) => {
                socket.emit('set-chat-history', docs);
            });
        });
        socket.on('room-update', (connection) => {
            Room.updateUnreadMessageToZero(connection);
        });
        socket.on('disconnect', () => {
            //  console.log('user disconnect', socket.id, socket.userId);
            if (socket.userId) {
                var query = {
                    _id: socket.userId,
                    logedIn: {
                        isLogedIn: false,
                        lastLogedIn: new Date()
                    }
                }
                User.updateUser(query, (err, user) => {
                    if (user) {
                        socket.broadcast.emit('user-join-left', user);
                    } else {
                        socket.broadcast.to(socket.id).emit('err-user-join-left', err); //not implimented yet clinet side future ref
                    }
                });
            }
        });
    });

}
