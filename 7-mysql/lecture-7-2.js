require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const path = require('path');
const mysql = require('mysql');
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

// query('SELECT count(*) as cnt FROM withdrawals WHERE status=? AND deleted_at is null', ['R'], (err, result) => {
//     if (err) { console.log(err); }
//     console.log(result[0]);
// });

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug'); // jade engin 사용
app.set('views', './7-mysql/public') // public 경로 설정

app.route('/users')
  .get((req, res) => {
    query('SELECT * FROM users order by id desc ', [], (err, rows) => {
      if (err) { console.log(err); }
      console.log(rows);
      console.log(rows.length);
      // res.sendFile(path.join(__dirname, '/public/list.html'), result);
      res.render('list', {rows});

      // res.render(path.join(__dirname, '/public/list'), result);
    });
  });

app.route('/write')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '/public/write.html'));
  })
  .post((req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    query('INSERT INTO  users (email, name, password)  values (?, ?, ?) ', [email, name, password], (err, result) => {
      if (err) { console.log(err); }
    });
    res.redirect('/users');
  });
app.route('/view/:id')
  .get((req, res) => {
      const id = req.params.id;
      query('SELECT * FROM users where id = ?', [id], (err, row) => {
          if (err) { console.log(err); }
          console.log(row);
          res.render('view', {row: row[0]});
      });
  });
app.route('/update/:id')
  .get((req, res) => {
    const id = req.params.id;
    query('SELECT * FROM users where id = ? ', [id], (err, rows) => {
      if (err) { console.log(err); }
      res.render('update', {row: rows[0]});
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    console.log(id, email, name, password);
    query('UPDATE users set email = ?, name = ?, password = ?  where id = ? ', [email, name, password, id], (err) => {
      if (err) { console.log(err); }
      res.redirect('/users');
    });
  });
app.route('/delete/:id')
  .get((req, res) => {
    const id = req.params.id;
    query('DELETE FROM users where id = ?', [id], (err, row) => {
      if (err) { console.log(err); }
      res.redirect('/users');
    });
  })
  .post((req, res) => {

  });

  http.listen(3000, () => {
    console.log('listening on *:3000');
  });
