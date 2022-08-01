//웹 서버 모듈 추출
const http  = require('http');
const fs = require('fs').promises;

http.createServer(async(req, res) =>{
    if(req.url === '/session') {
        const data = await 
        fs.readFile('./sessionStorage.html');
        res.writeHead(200, {'Content-Type' : 'text/html; charset-utf-8'})
        return res.end(data);
    }else if(req.url === '/local'){
        const data = await
        fs.readFile('./localStorage.html');
        res.writeHead(200, {'Content-Type' : 'text/html; charset-utf-8'})
        return res.end(data);
    }


}).listen(9000,()=>{
    console.log('서버 대기 중');
})