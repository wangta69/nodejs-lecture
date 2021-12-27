# 환경변수설정하기
redis나 mysql 정보등 중요정보 등은 환경변수에서 관리하는 것이 보안등에 안정적이이므로 환경변수를 사용하기를 권장한다.

## dotenv 사용하기
```
npm install dotenv
```
project root에 .env 파일을 생성한다. \
.env
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=db_user
DB_PASSWORD=db_password
DB_DATABASE=database
```
js 파일에서 호출하여 사용하기
```
require('dotenv').config();
const mysql = require('mysql');
const pool = mysql.createPool(
    {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'db_user',
        password: process.env.DB_PASSWORD || 'db_password',
        database: process.env.DB_DATABASE || 'database',
        multipleStatements: true
    });

```