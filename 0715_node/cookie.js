//웹 서버 모듈 추출
const http  = require('http');

http.createServer((req, res) =>{
    res.writeHead(200,{'Set-Cookie':'mycookie=cookietest'});
    res.write('<a href="http://www.github.com/JaeJinByun">🫥</a>');
    res.end('<p>Hello Cookie</p>');
}).listen(9000,()=>{
    console.log('서버 대기 중');
})