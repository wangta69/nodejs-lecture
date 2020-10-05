const http = require('http');
const fs = require('fs'); // load fs
const app = http.createServer((request, response)=>{
    let url = request.url;
    if (request.url === '/') {
        url = '/lecture-1-3.html';
    }
    if (request.url == '/my-home') {
        url = '/lecture-1-3-my-home.html';
    }
    if (request.url === '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);
