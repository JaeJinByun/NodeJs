/*
const express = require('express');

//파일 읽기 쓰기 모듈 
const path = require('path');

//파일에 로그를 출력하기 위한 모듈 가져오기
const morgan =require('morgan');
const FileStreamRotator = require('file-stream-rotator');
//파일에 읽고 쓰기를 할 수 있도록 해주는 모듈 
const fs = require('fs');

//.env 파일의 내용을 읽어오기 위한 패키지 
const dotenv = require('dotenv');
//쿠키를 사용하기 위한 모듈 
const cookieParser = require('cookie-parser');

//웹 어플리케이션 서버를 만들기 위한 모듈을 생성
const app = express();

//파일 업로드 설정
const multer = require('multer');
try {
    fs.readdirSync('uploads');
}catch(error) {
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null,'uploads/')
        },
        filename(req,file,done){
            //원본 파일의 확장자를 추출
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname,ext) + Date.now() + ext);
        }
    }),
    limits: {fileSize: 10 * 1024 * 1024}
})

//.env 읽어오기
dotenv.config();
//static 경로 설정 
app.use('/',express.static('public'))

//파라미터를 읽기 위한 설정
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//쿠키를 읽기위한 설정
app.use(cookieParser(process.env.COOKIE_SECRET))


//세션 사용을 위한 모듈 가져오기
const session = require('express-session');
const exp = require('constants');
const FileStore = require('session-file-store')(session);

//데이터베이스 접속 정보
var options = {
    host : "127.0.0.1",
    user : "user00",
    password : "1234",
    database : "jin"
}

const MysqlStore = require('express-mysql-session')(session);





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



//morga 설정 - 로그를 파일에 기록 
app.use(morgan('combined', {stream:accessLogStream}));

//세션 설정
app.use(session({   
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store : new MysqlStore(options)
}));

//포트 설정 
app.set('port',process.env.PORT || 3000 );
//요청
app.get('/',(req,res) => {
   // res.sendFile(path.join(__dirname,'/index.html'));
   res.sendFile(path.join(__dirname),'/index.html')
}); 

app.get('/singlefileupload', (req,res)=> {
    res.sendFile(path.join(__dirname,'singlefileupload.html'));
})

app.post('/singlefileupload', upload.single('image'),(req,res)=> {
    res.sendFile(path.join(__dirname,'singlefileupload.html'));
    console.log(req.file)
    console.log(req.body.title)
    res.send('ok');
})


app.get('/multifileupload', (req,res)=> {
    res.sendFile(path.join(__dirname,'multifileupload.html'));
})

app.post('/multifileupload', upload.array('image'),(req,res)=> {
    //업로드 된 파일이름 확인
    //req.files 는 file 정보에 대한 배열
    for(var idx =0; idx<req.files.length; idx++) {
        var f = req.files[idx];
        console.log("파일이름 : ",f.filename);
    }
    console.log("파일속성 : ", req.files)
    console.log("제목 : ",req.body.title)
    res.send('ok');
})

app.get('/multiparameter', (req,res)=> {
    res.sendFile(path.join(__dirname,'multiparameter.html'));
})

app.post('/multiparameter', upload.fields([{name:"image1"},{name:"image2"}]),(req,res)=> {
    //업로드 된 파일이름 확인
    //req.files 는 file 정보에 대한 배열
    for(var idx =0; idx<req.files.length; idx++) {
        var f = req.files[idx];
        console.log("파일이름 : ",f.filename);
    }
    console.log("파일속성 : ", req.files)
    console.log("제목 : ",req.body.title)
    res.send('ok');
})



//서버 실행 및 대기 
app.listen(app.get('port'), ()=> {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
*/



const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

// /로 시작하는 것은 indexRouter 가 처리 
//app.use('/',indexRouter);
// /user로 시작하는 것은 userRouter 가 처리 
//app.use('/user',userRouter);

const path = require('path');
//뷰가 위치해야 할 디렉토리 위치 명시 
app.set('views', path.join(__dirname,'views'))
//템플릿 엔진을 설정 
app.set('view engine','pug');

app.get('/',(req,res) => {
    //템플릿 엔진으로 출력
    //views 디렉토리의 index.pug로 출력 
    //title 과 aespa 라는 이름의 데이터를 전달 
    res.render('index',{title:'PUG', aespa:['카리나','윈터','지젤','링링']})
})


app.listen(app.get('port'), ()=> {
    console.log(app.get('port'),'번 포트 대기 중');
})

















