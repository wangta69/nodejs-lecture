require('dotenv').config();
const redis = require('redis');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
   return_buffers: false,
   password: process.env.REDIS_AUTH,
   db: process.env.REDIS_DATABASE,
   retry_strategy: (options) => {
       if (options.error === null || options.error.code === 'ECONNREFUSED') {
         // This will suppress the ECONNREFUSED unhandled exception
           // that results in app crash
           // return;
           return 1000; // retry after 1 sec
       }
    }
});

// app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));
// app.get('/', (req, res) => {
//    // res.send('Welcome To Node Project');
//    res.sendFile(path.join(__dirname, '/public/index.html'));
// });

app.route('/chat')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '/public/chat.html'));
    })
    .post((req, res) => {
        // res.send('Add a book');
    });

io.on('connection', (socket) => {
    console.log('a user connected');

    client.lrange('chatting.simple', 0, -1, (err, data) => {
        if (err) { console.log(err); }
        console.log('chatting.simple', data);
        io.emit('messages', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (msg) => {
        client.lpush(['chatting.simple', msg], () => {});

        // io 는 모든 사람에게 보낼때 (메시지를 보내는 사람 포함)
        io.emit('message', msg);

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
