const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

const server = app.listen(3000);
// const io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
const io = require('socket.io')(server, {
    allowEIO3: true, // whether to enable compatibility with Socket.IO v2 clients
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    //    allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('an user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (msg) => {
        console.log('message: ' + msg);

        // io 는 모든 사람에게 보낼때 (메시지를 보내는 사람 포함)
        // io.emit('some event', {});

        // 특정 room에 있는 사람에게 보낼때
        // io.in(joined room).emit('some event', {});

        // 나를 제외한 모든 사람에게 보낼때
        // socket.broadcast.emit('hi');

        // 소켙의 모든 사람에게 보낼때
        // socket.emit('hi');
    });
});