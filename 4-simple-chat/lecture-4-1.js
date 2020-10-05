const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const path = require('path');

app.get('/', (req, res) => {
   res.send('Welcome To Node Project');
});

app.route('/chat')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '/public/chat-4-1.html'));
    })
    .post((req, res) => {
        res.send('Add a book');
    })

io.on('connection', (socket) => {
    console.log('a user connected');
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

http.listen(3000, () => {
    console.log('listening on *:3000');
});
