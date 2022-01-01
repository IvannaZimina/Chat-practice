const socketIO = require('socket.io');
const moment = require('moment');

const run = (httpServer) => {
    const io = socketIO(httpServer);

    let users = [];
    let connections = [];

    io.on('connection', (socket) => {
        connections.push(socket);

        socket.on('login', (data, cb) => {
            cb({ name: data.name });

            socket.broadcast.emit('joinChat', { name: data.name});
        });
    
        socket.on('send mess', (data, cb) => {
            const { message, name } = data;
            const time = moment().format('h:mm a');
            cb({ time, message, name });

            socket.broadcast.emit('send mess', { message, name, time});
        });

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {name: data.name,});
        })

        socket.on('disconnect', (data) => {
            connections.splice(connections.indexOf(socket, 1));
        });
    })
}

module.exports = run;






    // const joinChat = (id, username) => {
    //     const user = { id, username };
    //     users.push(user);
    //     return user;
    // };

    // const getCurrentUser = (id) => {
    //     return useers.find(user => user.id === id);
    // }

