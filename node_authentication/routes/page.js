const express = require('express')

const router = express.Router();

const {isLoggedIn, isNotLoggedIn} = require('./middleware');


//무조건 수행 GET , POST 상관없이 
router.use((req,res,next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
   
    //다음에 처리할 것이 있으면 다음 처리로 이동시킴 ex) /profile 로 라우팅 해주거나 , /join으로 라우팅 역활 
    next();
})

router.get('/profile',isLoggedIn,(req,res)=>{
    //첫 번째 매개변수는 view 파일의 이름
    //두 번째 매개변수는 view 파일의 넘어가는 데이터
    res.render('profile',{title:'내 정보'})
});

router.get('/join',isNotLoggedIn,(req,res)=>{
    res.render('join',{title:'회원가입 - NodeSNS'})
});

router.get('/',(req,res,next) => {
    const twits = [];
    res.render('main',{
        title : 'Node SNS',
        twits
    })
});

//모듈 추출 => require('./routes/page')
module.exports = router;














