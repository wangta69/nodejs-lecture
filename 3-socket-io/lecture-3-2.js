const server = require('http').createServer(() => {});
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('a user connected');

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

server.listen(3000);
