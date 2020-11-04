require('dotenv').config();
const redis = require('redis');
const express = require('express')
const app = express();
const http = require('http').createServer(app);
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

const rSub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
    return_buffers: false,
    password: process.env.REDIS_AUTH,
    db: process.env.REDIS_DATABASE
});

rSub.subscribe('pub'); // 추후 이곳에서 모두 처리

rSub.on('message', (channel, message) => {
    console.log(channel, message);
})

app.use(express.static(path.join(__dirname, '/public')));

// http://localhost:3000/subscribe?message=%EB%84%8C%20%EC%B5%9C%EA%B3%A0%EC%95%BC
app.route('/subscribe')
    .get((req, res) => {
        const mymessage = req.query.message;
        res.sendFile(path.join(__dirname, '/public/subscribe.html'));
        if (mymessage) {
            client.publish('pub', mymessage);
        }
    })

http.listen(3000, () => {
    console.log('listening on *:3000');
});
