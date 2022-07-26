const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const User = require('../models/user');

const router = express.Router();

router.post('./join',isNotLoggedIn,async(req,res,next) => {
    try {
        //email 중복 검사
        const exUser = await User.findOne({where: {email}}); 
        if(exUser) {    //있다면 
            return res.redirect('/join?error=exist');
        }
        //비밀번호를 암호회 salt 
        const hash = await bcrypt.hash(password, 12);

        //데이터베이스에 저장
        await User.create({
            email,
            nick,
            password:hash
        });

        return res.redirect('./');

    } catch (err) {
        console.log(err);
        return next(err);
    }
})

router.post('./login',isNotLoggedIn, (req,res,next) => {
    //localStratgy 의 함수를 호출해서 로그인을 수정 
    //authEorror는 에러가 발생했을 때 에러 객체
    //user는 로그인에 성공했을 때 유저 정보
    //info는 로그인에 실패했을 때 실패한 이유

    passport.authenticate('local',(authError,user,info)=>{
        //에러가 발생한 경우 
        if(authError) {
            console.log(authError);
            return next(authError);
        }
        //로그인에 성공한 경우 
        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }   
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next); //미들웨어 내에서 호출하는 미들웨어는 정보를 전달 
})

//로그아웃 처리 - 로그인 되어 있을 때 만 수행 
router.get('/logout',isLoggedIn,(req,res) => {
    req.logOut(function(err) {
        if(err){return next(err)}
        req.session.destroy();
        res.redirect('/');
    })
})



