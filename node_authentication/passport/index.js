const passport = require('passport');

//로그인 관련 모듈 2개 가져오기 

//전략 모듈을 가져오기 
const local = require('./localStrategy');

//테이블 가져오기 
const User = require('../models/user');

module.exports = () => {
    //로그인 했을 때 정보 넘기기
    passport.serializeUser((user,done) => {
        //유저 정보의 기본키 값을 넘겨주어야 함
        done(null,user.id);
    });

    passport.deserializeUser( (id,done) => {
        //데이터베이스에서 id에 해당하는 값이 있는지 찾아서 세션에 저장
        User.findOne({ where: { id } })
        .then(user => done(null, user))
        .catch(err => done(err));
    })
    //로컬 로그인 함수를 호출
    local();
}



