var Chat = require('../controllers/chat.controller');
var Room = require('../controllers/room.controller');
var User = require('../controllers/user.controller');
module.exports = (app, server) => {

    var io = require('socket.io').listen(server);

    io.on('connection', (socket) => {

        socket.on('update-user', (userId) => {

            //console.log('user connected', socket.id,userId);
            var query = {
                id: userId,
                socketId: socket.id,
                logedIn: {
                    isLogedIn: true,
                    lastLogedIn: new Date()
                }
            }
            User.updateUser(query);
        });
        socket.on('get-users-rooms', (userId) => {
            Room.findAllRooms(userId, (err, rooms) => {
                User.findAllUsers(userId, (err, users) => {
                    socket.emit('set-users-rooms', {
                        rooms,
                        users
                    });
                });
            });
        });
        socket.on('get', (data) => {
            Room.updateRoom(data);
            Chat.createChat(data, (err, doc) => {
                Room.findAllRooms(data.receiver, (err, rooms) => {
                    socket.broadcast.to(data.connection).emit('set', {
                        message: doc,
                        rooms
                    });
                });
            });
        });

        socket.on('get-writer', (data) => {
            socket.broadcast.to(data.connection).emit('set-writer', data);
        });

        socket.on('join', (data) => {
            Room.findOrCreateRoom(data, (err, data) => {
                if (data.room) {
                    socket.room = data.room.connection;
                    socket.user = data.room.createdBy;
                    socket.join(data.room.connection);
                    socket.emit('room-joined', data);
                }
            });
        });
        socket.on('update-room', (data) => {
            Room.updateRoom(data);
        });
        socket.on('disconnect', () => {
            //  console.log('user disconnect', socket.id);
            var query = {
                socketId: socket.id,
                logedIn: {
                    isLogedIn: false,
                    lastLogedIn: new Date()
                }
            }
            User.updateUser(query);
        });
    });

}
