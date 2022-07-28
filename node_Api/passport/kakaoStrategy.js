const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user'); // const {User} = require('../models);

module.exports = ()=> {
    passport.use(new kakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback'
    },async(accsessToken, refreshToken,profile, done) => {
        try {
            //데이터베이스에 저장된 데이터가 있는지 확인
            const exUser = await User.findOne({
                where : {snsId : profile.id, provider:'kakao'}
            });
            if(exUser) {
                done(null,exUser);
            }
            //데이터베이스에 없는 경우는 데이터베이스 저장 
            else{ 
                const newUser = await User.create({
                    email : profile.json && profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao'
                });
                done(null,newUser);
            }
        } catch (err) {
            console.error(error);
            done(error);    
        }
    }));
}
