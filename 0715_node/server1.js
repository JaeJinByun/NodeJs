//웹 서버 모듈 추출
const http  = require('http');

http.createServer((req, res) =>{
    res.writeHead(200,{'Content-Type':'text/html ; charset=utf-8'});
    res.write('<a href="http://www.github.com/JaeJinByun">🫥</a>');
    res.end()
}).listen(9000,()=>{
    console.log('서버 대기 중')
})