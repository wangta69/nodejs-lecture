const express = require('express')
const http = require('http');

// 미들웨어 추가
// 익스프레스 객체 생성
const app = express();

app.get('/', (req, res) => {
    res.send('root');
});

app.route('/book')
    .get((req, res) => {
        res.send('Get a random book');
    })
    .post((req, res) => {
        res.send('Add a book');
    })
    .put((req, res) => {
        res.send('Update the book');
    });

// Express 서버 시작
http.createServer(app).listen(3000, () => {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});
