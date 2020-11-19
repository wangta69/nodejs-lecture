const http = require('http');
const fs = require('fs'); // load fs
const path = require('path');
const app = http.createServer((request, response) => {
    // const u_name = req.param('name');
    // const u_age = req.param('age');
    let url = request.url;
    if (request.url === '/') {
        url = '/lecture-1-3.html';
    }
    if (request.url === '/my-home') {
        url = '/lecture-1-3-my-home.html';
    }
    if (request.url === '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);
    // response.end(fs.readFileSync(__dirname + url));
    response.end(fs.readFileSync(path.join(__dirname, url)));
//    res.sendFile(path.join(__dirname, '/public/chat.html'));
});
app.listen(3000);
