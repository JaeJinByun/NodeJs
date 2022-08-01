//브라우저에서 실행하기 위해서 추출 
var http = require('http');

//UDP 통신을 위한 모듈을 추출 
var client = require('dgram').createSocket('udp4');

//전송할 메시지 생성 
var message = "안녕하세요. 반갑습니다.";

var data = new Buffer(message);
client.send(data,0,data.length,4445,'localhost');

//데이터 받았을 때 처리
client.on("message", function(msg,info){
    message = msg;
})

//에러가 발생한 경우
client.on("error",function(err){
    console.log("에러: " + err)
})

http.createServer((function(req,res){
    if(req.url === './favicon.ico') {
        res.writeHead(200, {
            'Content-Type' : 'image/x-icon'
        })
        res.end();
        return;
    }

    //데이터 전송
    var data = new Buffer(message);
    client.send(data,0,data.length,4445,'localhost');
}))
