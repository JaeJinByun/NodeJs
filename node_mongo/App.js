const express = require('express');

//로그 기록 과 관련된 패키지 
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const multer = require('multer');

//서버 생성 
const app = express();
app.set('port',process.env.PORT || 9000);

//개발 과정에서만 기록
app.use(morgan('dev'));

//POST방식의 파라미터를 읽기 위한 설정
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.unsubscribe(bodyParser.urlencoded({extended:true}))

//파일 다운로드를 위한 설정
var util = require('util');
var mime = require('mime');
const { get } = require('http');
const { json } = require('express');

//이미지를 저장할  디렉토리가 없으면 생성 - 
try {
    fs.readdirSync('img');
} catch (err) {
    console.log('img 디렉토리가 없어서 생성');
    fs.mkdirSync('img');
}

//파일 업로드 설정 
const upload = multer({
    storage : multer.diskStorage({
        destination(req,file,done) {
            done(null,'img/')
        }, filename(req,file,done) {
            const ext = path.extname(file.originalname);
            done(null,path.basename(file.originalname, ext) + Date.now() + ext)
        }
    }), limits:{fileSize: 10 * 1024 * 1024}
})

//뷰엔진 설정 - 뷰 파일 경로 설정
app.set('view engine','html');
app.engine('html',require('ejs').renderFile);

app.get('/item/all', (req, res,next) => {
    MongoClient.connect(databaseUrl, 
        function(err,database){
            if(err != null) {
                res.json({'result':false,'message':err});
            }
            //사용할 데이터베이스 설정 
            db = database.db('node');
            //전체 데이터 가져오기 
            db.collection('item').find().sort({'itemid':-1}).toArray(function(err,items){
                res.json({'count':items.length,'list':items,'result':true});
            })
    })
})
//데이터의 일부분 가져오기
app.get('/item/list',(req,res, next) => {
    //파라미터 읽기
    const pageno = req.query.pageno;
    const count = req.query.count;

    //파라미터를 로직에 필요한 형태로 연산 
    var start = 1;
    var size = 3;
    if(pageno != undefined && count != undefined) {
        start = (pageno -1) * count;
        size = parseInt(count);
    }

    MongoClient.connect(databaseUrl, function(err,database){
        if(err != null) {
            res.json({'result':false,'message':err})
        }
        db = database.db('node');

        db.collection('item').find().toArray(function(err, items){
            var len = items.length;
            db.collection('item').find().sort({'itemid':-1}).skip(start).limit(size).toArray(function(err,items){
                res.json({'count':len,'list':items,'result':true});
            })
        })
    })
})


//MongoDB 사용 객체 생성
var MongoClient = require('mongodb').MongoClient;
var db;
var databaseUrl = 'mongodb://localhost:27017/';


app.get('/item/detail',(req,res,next)=> {
    //파라미터 읽기
    const itemid = req.query.itemid;

    MongoClient.connect(databaseUrl,function(err,database){
        if(err != null) {
            res.json({'result':false,'message':err})
        }
        db = database.db('node');

        db.collection('item').findOne({'itemid':Number(itemid)},function(err,item){
            if(item == null) {
                res.json({'result':false,'message':'데이터 없음'})
            }else{
                res.json({'result':true,'item':item})
            }
        })
    })
})

app.get('/item/insert', (req,res,next) => {
    res.render('insert');
})

app.post('/item/insert',upload.single('pictureurl'),(req,res,next) => {
    //폼에서 post 방식으로 전송된 파라미터 읽기
    const itemname = req.body.itemname;
    const description = req.body.description;
    const price = req.body.price;

    //업로드 된 파일이름 설정
    var pictureurl;
    if(req.file) {
        pictureurl = req.file.fieldname;
    }else {
        pictureurl = "default.jpg";
    }

    MongoClient.connect(databaseUrl, function(err,database){
        if(err != null) {
            res.json({'result':false,'message':err})
        }
        db = database.db('node');
        //itemid 만들기 
        db.collection('item')
        .find({},{projection:{_id:0,itemid:1}})
        .sort({itemid : -1})
        .limit(1)
        .toArray(function(err,result){
            if(err) {
                res.json({'result':false})
            }

            var itemid = 1;
            if(result[0] != null) {
                itemid = result[0].itemid + 1;
            }

            db.collection('item').insert({'itemid':itemid,'itemname':itemname,
                                    'price':price,'description':description,
                                    'pictureurl':pictureurl},
                    function(err,result){
                        res.json({'result':true});
           })
        })
    })
})

app.get('/item/update',(req,res,next) => {
    res.render('update');
})

app.post('/item/update',upload.single('pictureurl'),(req,res,next)=> {
    const itemid = req.body.itemid;
    const itemname = req.body.itemname;
    const price = req.body.price;
    const description = req.body.description;
    const oldpictureurl = req.body.oldpictureurl;

    var pictureurl = oldpictureurl;

    if(req.file) {
        pictureurl = req.file.fieldname;
    }


    MongoClient.connect(databaseUrl, function(err, database){
        if(err != null) {
            res.json({'result':false})
        }
        db = database.db('node');
        db.collection('item').update(
            {'itemid':Number(itemid)},
            {$set:{'itemname':itemname,'price':price,'description':description,'pictureurl':pictureurl}},
            function(err,result) {
                if(err) {
                    res.json({'result':false});
                }else{
                    res.json({'result':true});
                }
            })
    })
})
app.get('/item/delete',(req,res,next) => {
    res.render('delete');
})

app.post('/item/delete', (req,res,next) => {
    const itemid = req.body.itemid;
    MongoClient.connect(databaseUrl, function(err,database) {
        if(err != null) {
            res.json({'result':false});
        }

        db = database.db('node');
        db.collection('item').deleteOne({'itemid':Number(itemid)}),function(err,result){
           if(err) {
                res.json({'result':false})
           }else{
                res.json({'result':true})
           }
        }
    })
})

//에러가 발생 했을 때 처리
app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).send(message);
})

//사버 실행
app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
})
