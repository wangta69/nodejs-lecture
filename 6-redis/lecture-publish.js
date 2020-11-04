require('dotenv').config();
const redis = require('redis');
const event = require('./events');

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
    const payload = JSON.parse(message);
    switch (payload.event) {
        case 'messages.notice':
            break;
    }

    // event.myEmitter.emit('message', JSON.parse(message));
})
