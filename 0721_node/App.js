//MySql 연동을 위한 모듈 추출 
//const mysql = require('mysql');
/*
//접속 정보 생성
var connection = mysql.createConnection({
    host : '127.0.0.1',
    port : 3306,
    user : 'user00',
    password : '1234',
    database : 'node'
})

//연결 
connection.connect(function(err){
    if(err) {
        console.log(err);
        throw err;
    }
});

//console.log(connection);
connection.query('CREATE TABLE family(id int auto_increment, name varchar(30),'
+'primary key(id))engine=InnoDB DEFAULT CHARSET=utf8');

//데이터 삽입
connection.query('insert into family(name) values(?)', '을지문덕');
connection.query('insert into family(name) values(?)', '강감찬');


//데이터 삭제
connection.query('delete from family where name = (?)', '자바짱');
connection.query('delete from family where name = (?)', '척춘경');

//select 구문
connection.query('select * from family', function(err, results, fields){
    if(err) {
        throw err;
    }

    //읽은 내용 전체를 출력
    //console.log(results);

    for(var idx = 0; idx<results.length; idx++) {
        var row = results[idx];
        console.log(row.name);
    }
});
*/

//---------------------------------------------------------------------------------------------------

/*
    express : 웹 애플리케이션 서버
    morgan  : 로그 기록
    file-stream-rotator : 로그를 일정한 주기를 가지고 파일에 기록
    multer  : 파일 업로드
    mysql   : MySql 사용
    cookie-parser : 쿠키 사용
    express-session : 세션 사용
    express-mysql-session : 세션을 메모리가 아닌 MySql에 보관
    dotenv  : .env  파일의 내용을 process.env로 읽어와서 전송
    compression : 응답을 압축해서 클라이언트에게 전송 

    => npm install --save-dev nodemon
        • 개발용으로 설치, 배포를 할 때는 포함되지 않음
        • 개발을 할 때는 소스 코드 수정을 빈번히 하는데 그 때 마다 서버를 중지시키고 
          새로 시작하는 것이 번거로워서 이 모듈을 이용하여 사버의 코드를 수정하면 자동으로 반영되도록 함
        • 운영을 할 때는 서버의 코드를 수정할 때는 서버를 일시 중지하거나 별도의 컴퓨터에서 해야 함          
*/
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const mysql = require('mysql');
const cookeiParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const dotenv = require('dotenv')

const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const MySQLStore = require('express-mysql-session')(session);

//.env 파일 읽기
dotenv.config();

//서버 설정 
//.env 설정파일에서 변경 가능 
const app = express();
app.set('port',process.env.PORT);

//로그 출력
var logDirectory = path.join(__dirname,'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = FileStreamRotator.getStream({
    date_format : 'YYYYMMD',
    filename    : path.join(__dirname,'acess-%DATE%.log'),
    frequency   : 'daily',
    verdose     : false
});
//로그 설정 
app.use(morgan('combined',{stream:accessLogStream}));

//압축을 해서 클라이언트에게 전송
app.use(compression());

//파라미터를 읽을 수 있도록 설정  
//post 방식으로 전송된 데이터를 읽어서 req.body에 저장해주는 방식 
var bodyParser = require('body-parser');
const exp = require('constants');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}))

//데이터베이스 접속 정보
var options = {
    host:process.env.HOST,
    port:process.env.MYSQLPORT,
    user:process.env.USERNAME,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}

//세션을 데이터베이스에 저장하기 위한 설정
app.use(session({
    secret:process.env.COOKIE_SECRET,
    //resave : 모든 request(요청이 발생할 때) 마다 세션의 변경이 없어도 다시 저장할 지의 여부
    resave:false,              
    //saveUninitialized : 세션이 없는상태에서 처음 만들어 질 때 세션을 request에 포함시킬 지의 여부로 설정하면 서버의 공간을 아낄 수 있으며 true로 설정하면 request의 횟수에 따라 다른 등급 부여가 가능 
    saveUninitialized:true,
    store: new MySQLStore(options)
}));


//파일 업로드를 위한 설정 
try{
    fs.readdirSync('public/img');
}catch(error) {
    fs.mkdirSync('public/img');
}
const upload = multer({
    storage : multer.diskStorage({
        destination(req, file,done){
            //업로드할 디렉토리 결정
            //이 디렉토리는 미리 만들어져 있어야 함 
            done(null, 'public/img');
        },
        filename(req, file, done) {
            //원본 파일의 확장자를 추출
            const ext = path.extname(file.originalname);
            //원본 파일 이름에 현재시간 그리고 확장자를 추가
            //업로드 되는 파일이름을 만들고 업로드 수행 
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }), limits:{fileSize : 10 * 1024 * 1024}
})

//static 파일 디렉토리 설정
app.use('/',express.static('public'));

//파일을 다운로드 받을 수 있도록 설정
var util = require('util');
var mime = require('mime');
const { json } = require('express');

//데이터베이스 연결
var connection = mysql.createConnection(options);
connection.connect(function(err){
    if(err) {
        console.log('MySql Connection Error');
        console.log(err);
        throw err;
    }
})

//sequelize 추출 
const { sequelize} = require("./models");

sequelize.sync({force:false}).then( ()=> {
    console.log("데이터 베이스 연결 성공");
}).catch( (err) => {
    console.log(err);
})

const {Item} = require('./models');


//시작요청 처리 '/' 으로 시작되는 주소로 들어올때 index.html 파일 전송
app.get('/',(req,res, next) => {
    res.sendFile(path.join(__dirname,'index.html'));
});
//테이블의 전체 데이터 가져오는 처리
app.get('/item/all',async(req,res,next) =>{
    try{
        var list = await Item.findAll();
        var count = await Item.count();
        res.json({'count':count,'list':list})
    }catch(err){
        console.log(err);
        next(err)
    }
})

//페이지 단위로 데이터 가져오기 
app.get('/item/list', async(req, res, next) => {
    //GET 방식의 파라미터 읽어오기
    const pageno = req.query.pageno;
    const count = req.query.count;
    //MySQL에서 페이지 단위로 데이터를 읽기 위해서는
    //데이터의 시작 인덱스 와 개수가 필요

    var start = 0;
    var size  = 0;

    //데이터의 개수 설정 
    if(count != undefined) {
        size = parseInt(count);
    }
    //시작 인덱스 결정
    if(pageno != undefined) {
        start = (parseInt(pageno) -1 ) * size;
    }
   
    try {
        var list = await Item.findAll({
            offset:start,
            limit:size
        });
        var cnt = await Item.count();
        res.json({'list':list,'count':cnt})

    } catch (err) {
        console.log(err);
        next(err);
    }
})

//상세보기 
app.get('/item/detail',async(req,res,next) => {
    //파라미터 읽어오기
    const itemid = req.query.itemid;
    console.log(itemid)
    try {
        var item = await Item.findOne({
            where:{
                itemid:itemid
            }
        });
        res.json({'result':true,'item':item})
    } catch (err) {
        console.log(err)
        res.json({'result':false})
    }
})
app.get('/item/insert',(req,res)=> {
    fs.readFile('public/insert.html',function(err,data){
        res.end(data);
    })
})

app.post('/item/insert',upload.single('pictureurl'),async(req,res) => {
   
        //파라미터 읽기
        const itemname = req.body.itemname;
        const price = req.body.price;
        const description = req.body.description;;
        
        //파일 파라미터 값을 읽어오기
       var pictureurl;
       if(req.file) {
        pictureurl = req.file.filename;
       }else{
        pictureurl = "default.jpg";
       }

       var itemid = 1;
       try{
            var x = await Item.max('itemid');
            itemid = x + 1;
       }catch(err) {
        console.log(err);
       }

       //데이터 삽입
       Item.create({
            itemid:itemid,
            itemname:itemname,
            price:price,
            description : description,
            pictureurl : pictureurl
       })
    
})
app.post('/item/delete',async(req,res,next) => {
    //삭제를 위한 파라미터 읽기
    const itemid = req.body.itemid;
    
    try {
        var item = await Item.destroy({
            where:{itemid:itemid}
        });
        res.json({'result':true})
    } catch (err) {
        console.log(err)
        next(err)
        res.json({'result':false})
    }
})

app.get('/item/update',(req,res) => {
    fs.readFile('public/update.html', function(err,data){
        res.end(data);
    })
})
//수정
app.post('/item/update',upload.single('pictureurl'),async(req,res)=>{
    //파라미터 가져오기
    const itemid = req.body.itemid;
    const itemname = req.body.itemname;
    const price = req.body.price;
    const description = req.body.description;
    const oldpictureurl = req.body.oldpictureurl;

    // 새로운 파일을 선택하면 pictureurl을 변경하고 
    // 새로운 파일을 선택하지 않으면 이전 이름 그대로 
    var pictureurl;
    if(req.file) {
        pictureurl = req.file.fieldname;
    }else {
        pictureurl = oldpictureurl;
    }

    try {
        var item = await Item.update({
            itemname:itemname,
            price:price,
            description:description,
            pictureurl:pictureurl
        },{
            where:{itemid:itemid}
        });
        res.json({'result':true})
    } catch (err) {
        console.log(err)
        res.json({'result':false})
    }

})
app.get('/item/date', (req,res) => {
    fs.readFile('./update.txt',function(err,data) {
        res.json({'result' : data.toString()});
    })
})

//에러가 발생했을 때 처리 
app.use((err,req,res,next)=>{
    console.error(err);
    res.status(500).send(err.message);
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})
