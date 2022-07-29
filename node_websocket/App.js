/*
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
    if(req.url === "/"){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('WebSocket')
    }else if(req.url === '/index'){
        fs.readFile('index.html', function(error, data){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        })
    }
})

server.listen(10001, function(){
    console.log('server is listening on port 10001');
});

//웹 소켓 서버 생성
var wsServer = new WebSocketServer({
    httpServer:server,
    autoAcceptConnections:false
});

//이벤트 처리
var x = 0;
wsServer.on('request', function(request){
    //클라이언트 와 연결
    var connection = request.accept(
        'example-echo', request.origin);
    x = x + 1;
    console.log("현재 " + x + "명 접속 중")
    //클라이언트가 메시지를 전송하면
    connection.on('message', function(message){
        if(message.type === 'utf8'){
            //받은 메시지를 출력
            console.log('받은 메시지:' + message.utf8Data);
            //받은 메시지를 다시 전송
            connection.sendUTF(message.utf8Data);
        }else if(message.type === 'binary'){
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', 
        function(reasonCode, description){
            console.log('Peer:' + 
                connection.remoteAddress + 'disconnected');
    });

})
*/

//ws 모듈을 이용한 웹 소켓
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();

//socket.js 에서 내보낸 내용을 저장
const webSocket = require('./socket');

const indexRouter = require('./routes');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/', indexRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

//웹 소켓 서버 실행
webSocket(server);



