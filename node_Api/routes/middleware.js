exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()) {
        next();
    }else {
        res.status(403).send("로그인 필요");
    }
}

exports.isNotLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        next();
    }else{
        const message = encodeURIComponent("로그인 한 상태입니다.");
        res.redirect(`/?error=${message}`)
    }
}

const jwt = require('jsonwebtoken');

exports.verifyToken = (req,res,next) => {
    try {
        //유효성 검사 - 실패하면 예외가 발생함
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (err) {
        if(err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code : 419,
                message : '토큰이 만료되었습니다.'
            });
        }
        return res.status(401).json({
            code : 401,
            message : '유효하지 않은 토큰입니다.'
        })
    }
}

const RateLimit = require('express-rate-limit');
//사용량 제한
//예전 버전의 노드 라이브러리들의 객체 생성이 대부분
//new 생성자 형태 였었는데, 최근에는 new를 사용하지 않고 
//생성하는 경우가 많습니다. 
exports.apiLimiter = RateLimit({
    windowMs: 60 * 1000, //60초  
    max : 10,
    delayMs : 0,
    handler(req,res) {
        res.status(this.statusCode).json({
            code : this.statusCode,
            message : '1분에 열 번만 요청할 수 있습니다.'
        })
    }
})

exports.deprecated = (req,res) => {
    res.status(410).json({
        code:410,
        message:'새로운 버전이 나왔습니다. 새로운 버전을 사용하세요'
    })
}

