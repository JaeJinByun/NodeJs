//웹 서버 모듈 추출
const fs = require('fs').promises;
const http  = require('http');

http.createServer(async(req, res) =>{
    //HTML 파일의 내용읽기
    const data = await
    fs.readFile('./sessionStorage.html');

    res.writeHead(200,{'Content-Type':'text/html ; charset=utf-8'})
    res.end(data);
}).listen(9000,()=>{
    console.log('서버 대기 중')
})