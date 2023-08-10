require('dotenv').config();
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

query('SELECT count(*) as cnt FROM bbs order by id desc ', [], (err, result) => {
  if (err) { console.log(err); }
  console.log(result[0]);
});
