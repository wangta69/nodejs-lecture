const express = require('express')
const http = require('http');
const fs = require('fs');
const path = require('path');

// 익스프레스 객체 생성
const app = express();

app.get('/', (req, res) => {
   res.send('Welcome To Node Project');
});

app.route('/chat')
    .get((req, res) => {
    //    res.writeHead(200);
    //    res.end(fs.readFileSync(path.join(__dirname, '/public/chat.html')));
        res.sendFile(path.join(__dirname, '/public/chat.html'));
    })
    .post((req, res) => {
        res.send('Add a book');
    })

// Express 서버 시작
http.createServer(app).listen(3000, () => {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});
