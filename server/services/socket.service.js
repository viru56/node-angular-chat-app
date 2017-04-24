module.exports = function (app, server) {

    var io = require('socket.io').listen(server);

    io.on('connection', function (socket) {

        socket.on('get', function (data) {
            socket.broadcast.to(data.connection).emit('set', data);
        });

        socket.on('get-writer', function (data) {
            socket.broadcast.to(data.connection).emit('set-writer', data);
        });

        socket.on('join', function (data) {
            socket.room = data.connection;
            socket.user = data.username;
            socket.join(data.connection);
        });
    });

}
