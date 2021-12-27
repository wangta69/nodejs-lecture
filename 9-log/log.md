# LOG
## winston을 이용한 log  파일 저장
```
npm install winston winston-daily-rotate-file
```
아래와 같이 공용으로 사용할 js 파일을 만들어 준다.
### Winston 로그파일 만들기(winston.js)
```
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');//
const moment = require('moment-timezone');
const logDir = 'logs'; // logs 디렉토리 하위에 로그 파일 저장
const {combine, label, printf} = winston.format; // timestamp, ms,

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const loggerSample = winston.createLogger({
    level: 'info',
    format: combine(
        label({label: 'main'}),
        appendTimestamp({tz: 'Asia/Seoul', format: 'YYYY-MM-DD HH:mm:ss'}),
        logFormat
    ),
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new DailyRotateFile({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `sample_%DATE%.log`,
            maxFiles: 10, // 10일치 로그 파일 저장
            zippedArchive: false
        }),
        // error 레벨 로그를 저장할 파일 설정
        new DailyRotateFile({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
            filename: `sample_%DATE%.error.log`,
            maxFiles: 10,
            zippedArchive: false
        })
    ]
});

module.exports.loggerSample = loggerSample;
```
### 로그파일 사용
```
const {loggerSample} = require('./winston');

loggerSample.info(JSON.stringify(myObject));
```
