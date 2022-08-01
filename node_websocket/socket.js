//웹 소켓 모듈 - ws
/*
const WebSocket = require('ws');

module.exports = (server) => {
    //웹 소켓 서버 생성
    const wss = new WebSocket.Server({server});

    //클라이언트가 접속 요청을 했을 때
    wss.on('connection', (ws, req) => {
        //클라이언트의 IP를 가져오기
        //클라이언트의 요청 객체 안에 x-forwarded-for 
        //라는 속성을 가지고 자신의 IP를 전송합니다.
        const ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속 - ' , ip);

        //클라이언트가 메시지를 전송했을 때 
        ws.on('message', (message) => {
            console.log("클라이언트의 메시지:", message);
        });

        //에러가 발생했을 때
        ws.on('error', (error) => {
            console.error(error);
        });

        //에러가 발생했을 때
        ws.on('close', () => {
            console.log('클라이언트 접속 해제:', ip);
            //타이머 중지
            clearInterval(ws.interval);
        });

        //타이머 생성
        //3초마다 클라이언트에게 메시지를 전송하는 타이머
        ws.interval = setInterval(() => {
            if(ws.readyState === ws.OPEN){
                ws.send('서버에서 클라이언트에게 메시지 전송');
            }
        }, 3000);
    })

}
*/

//socket.io 패키지를 이용한 WebSocket

const SocketIO = require('socket.io');

module.exports = (server) => {
    //웹 소켓 객체 생성
    const io = SocketIO(server, {path:'/socket.io'});

    //클라이언트 접속 이벤트 처리
    //socket 이 클라이언트 와의 통신에 이용할 소켓
    io.on('connection', (socket) => {
        //클라이언트의 요청 정보 가져오기
        const req = socket.request;
        console.log("클라이언트 접속 - ", 
            socket.id, req.ip);

        //클라이언트로 부터 메시지가 전송된 경우
        socket.on('reply', (data) => {
            console.log(data);
        });

        //에러가 발생했을 때
        socket.on('error', (error) => {
            console.error(error);
        })

        //타이머 - 3초마다 메시지를 클라이언트에게 전송
        socket.interval = setInterval(()=>{
            //news 라는 이벤트를 발생시켜서
            //안녕하세요 반갑습니다. 라는 메시지를 전송
            socket.emit('news', '안녕하세요 반갑습니다.');
        }, 3000);

        //연결이 해제될 때 
        socket.on('disconnect', ()=>{
            console.log('클라이언트 접속 해제');
            clearInterval(socket.interval);
        })

        //message 이벤트가 오면 
        //접속한 모든 클라이언트에게 message 이벤트를
        //발생시키는데 이 때 전송된 데이터를 전송
        socket.on('message', function(data){
            io.sockets.emit('message', data);
        })
    })
}