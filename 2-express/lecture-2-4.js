const express = require('express')
const http = require('http');

// 미들웨어 추가
// 익스프레스 객체 생성
const app = express();

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어에서 요청을 처리함.');
    res.send({name: '소녀시대', age: 20});
    // res.redirect('http://google.co.kr');
});

// Express 서버 시작
http.createServer(app).listen(3000, () => {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});
