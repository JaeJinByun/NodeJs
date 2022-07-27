const express = require('express');

//.env 파일의 내용을 읽어서 process.env 를 통해 접근하도록 설정 (메모리에 로드)
const dotenv = require('dotenv');
dotenv.config();

//서버 설정
const app = express();
app.set('port', process.env.PORT);

//파일의 기본 경로 와 읽고 쓰기 위한 모듈을 추출 
const fs = require('fs');
const path = require('path');

//static 파일의 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

//view template 설정
const nunjucks = require('nunjucks');
app.set('view engine', 'html'); 
nunjucks.configure('views', {
    express:app,
    watch: true, 
});

//로그를 기록하기 위한 패키지 추출
const morgan = require('morgan');
//로그를 파일에 출력하기 위한 패키지 추출 
const FileStreamRotator = require('file-stream-rotator');

//로그를 기록하기 위한 디렉토리 경로를 생성  
const logDirectory = path.join(__dirname, 'log');

// 로그 디렉토리 생성
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// 로그 파일 옵션 설정 - 빈도수 : 매일 , 파일명 access-YYYYMMDD.log , 기록 
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});

// 로그 설정
app.use(morgan('combined', {stream: accessLogStream}));

//출력하는 파일 압축해서 전송
const compression = require('compression');
app.use(compression());

//post 방식의 파라미터 읽기
var bodyParser = require('body-parser');
app.use( bodyParser.json());        // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

//쿠키 설정 - (클라이언트 사이드에 데이터를 저장해두고 추후에 사용하기 위하여
//           클라이언트에 저장하고 서버에 전송한 후 사용하기 위한 객체)
const cookieParser = require('cookie-parser');
app.use(cookieParser(process. env.COOKIE_SECRET));

//세션 설정 - (클라이언트의 데이터를 서버에 저장해두고 사용)
//세션은 쿠키와 같이 만들어 짐 
//세션은 쿠키 세션이라고도 하며 접속한 브라우저 탭 당 1개씩 생성됨 
//세션은 기본적으로 서버의 메모리에 생성 되는데 파일이나 데이터베이스에 저장이 가능
const session = require("express-session");

//데이터베이스 접속 정보 
var options = {
    host :process.env.HOST,
	port : process.env.MYSQLPORT,
	user : process.env.USERNAME,
	password : process.env.PASSWORD,
	database : process.env.DATABASE
};

//세션을 MySQL에 저장하기 위한 패키지 추출 
const MySQLStore = require('express-mysql-session')(session);

//세션을 MySQL에 저장하기 위한 설정 
app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: true,
      store : new MySQLStore(options)
    })
);

const passport = require('passport');
const passportConfig = require('./passport');
passportConfig();
app.use(passport.initialize());
app.use(passport.session());




//라우터 설정 - /로 시작하는 요청을 page.js 파일의 내용으로 처리
const pageRouter =require('./routes/page');
app.use ('/',pageRouter);

const authRouter = require('./routes/auth');
app.use ('/auth',authRouter);


const postRouter = require('./routes/post');
app.use ('/post',postRouter);

const userRouter = require('./routes/user');
app.use('/user', userRouter);

//에러가 발생한 경우 처리
app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	err.status = 404;
	next(err);
});

//에러가 발생한 경우 처리
app.use((err, req, res, next) => {
	res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
