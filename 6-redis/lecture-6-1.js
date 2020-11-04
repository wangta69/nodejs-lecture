const redis = require('redis');

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
