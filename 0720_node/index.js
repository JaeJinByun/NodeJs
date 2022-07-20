const express = require('express');

//파일 읽기 쓰기 모듈 
const path = require('path');

//파일에 로그를 출력하기 위한 모듈 가져오기
const morgan =require('morgan');
const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');

//세션 사용을 위한 모듈 가져오기
const session = require('express-session');



//로그 파일을 저장하기 위한 디렉토리 설정
//path,join(   __dirname  , 'file'  )  
//             현재 디렉토리    파일이름 
const logDirectory = path.join(__dirname, 'log'); 

//로그를 기록하기 위한 디렉토리가 없으면 생성
//존재 한다면 mkdir로 넘어가지 않음 Or연산 이므로 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

//일자별 로그 출력을 위한 설정 
var accessLogStream = FileStreamRotator.getStream({
    date_format:'YYYYMMDD', //날짜 포맷 
    filename: path.join(logDirectory,'access-%DATE%.log'), //경로, 형식, 파일이름, 확장자 
    frequency: 'daily',     //빈도수 
    verbose:false          
});

const app = express();

//morgan 설정
app.use(morgan('combined', {stream:accessLogStream}));
//세션 설정
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}))
//포트 설정 
app.set('port',process.env.PORT || 3000 );
//요청
app.get('/',(req,res) => {
   // res.sendFile(path.join(__dirname,'/index.html'));
   if(!req.session.num) {
    req.session.num = 1;
   }else{
    req.session.num += 1;
   }
   res.send(req.session.num + "");
}); 

//서버 실행 및 대기 
app.listen(app.get('port'), ()=> {
    console.log(app.get('port'), '번 포트에서 대기 중');
});














