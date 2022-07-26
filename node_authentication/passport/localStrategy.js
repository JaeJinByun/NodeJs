const passport = require('passport');
const localStrategy = require('passport-local').Strategy 
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new localStrategy({
        usernameField : 'email',
        passwordField : 'password' 
    }, async(email,password,done) => {
        try {
            //아이디만 확인
            const exUser = await User.findOne({where:{email}});

            if(exUser) {
                //비밀번호 비교
                const result = await bcrypt.compare(password, exUser.password);
            }else {
                done(null, false, {message:'가입되지 않은 회원'});
            }

        } catch (err) {
            console.error(err);
            done(err);
        }
    }))
}