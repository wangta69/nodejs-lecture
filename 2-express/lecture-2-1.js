const express = require('express')
const http = require('http');

// 익스프레스 객체 생성
const app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

// Express 서버 시작
http.createServer(app).listen(app.get('port'), () => {
  console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'));
});
