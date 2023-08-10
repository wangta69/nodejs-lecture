require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const pool = mysql.createPool(
{
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'db_user',
  password: process.env.DB_PASSWORD || 'db_password',
  database: process.env.DB_DATABASE || 'database',
  multipleStatements: true
}); // [실서버용]

function query(sql, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = [];
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err);
    }
    connection.query(sql, params, (err, results) => {
      connection.release(); // always put connection back in pool after last query
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  });
}

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug'); // jade engin 사용
app.set('views', './8-session/public') // public 경로 설정
app.use(session({
secret: 'asdf3234sdf@#%^@sdfa234ws3s3',
resave: false,
saveUninitialized: true
}));

app.route('/login')
  .get((req, res) => {
      res.render('login');
  })
  .post((req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;

      query('SELECT * FROM users where email = ? ', [email], (err, rows) => {
          if (err) { console.log(err); }

          if (rows.length === 0) {
              res.send('존재하지 않는 회원입니다.')
          } else if (rows[0].password !== password) {
              res.send('비밀번호가 틀립니다.')
          } else {
              req.session.name = rows[0].name; // 세션 객체에 인증을 마친 회원의 title값을 저장하여 판별한다.
              req.session.save(() => {
                console.log(req.session);
                res.redirect('/logout');
              });
          }
      });
  });
app.route('/logout')
  .get((req, res) => {
    console.log(req.session);
    console.log(req.session.name);
    res.render('logout', {session: req.session});
  })
  .post((req, res, next) => {
    req.session.destroy(); // /login에서 만들어진 SessionID를 DB와 쿠키에서 삭제
    res.send('로그아웃 되었습니다. 세션을 확인하세요')
  });

  http.listen(3000, () => {
    console.log('listening on *:3000');
  });
