const express = require('express')

const router = express.Router();

const {isLoggedIn, isNotLoggedIn} = require('./middleware');

const {Post, User, Hashtag} = require('../models');



//무조건 수행 GET , POST 상관없이 
router.use((req,res,next) => {
    res.locals.user = req.user;
    res.locals.followerCount =  req.user ? req.user.Followers.length : 0 ;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0 ;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [] ;
   
    //다음에 처리할 것이 있으면 다음 처리로 이동시킴 ex) /profile 로 라우팅 해주거나 , /join으로 라우팅 역활 
    next();
});

router.get('/profile',isLoggedIn,(req,res)=>{
    //첫 번째 매개변수는 view 파일의 이름
    //두 번째 매개변수는 view 파일의 넘어가는 데이터
    res.render('profile',{title:'내 정보'})
});

router.get('/join',isNotLoggedIn,(req,res)=>{
    res.render('join',{title:'회원가입 - NodeSNS'})
});

router.get('/',async(req,res,next) => {
    try {
        const posts = await Post.findAll({
            include : {
                model : User,
                attributes : ['id','nick']
            },
            order:[['createdAt','DESC']]
        });
        res.render('main',{title : 'Node SNS', twits:posts})
    } catch (err) {
        
    }
});

//모듈 추출 => require('./routes/page')
module.exports = router;















