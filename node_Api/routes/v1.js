const express = require('express');
const jwt = require('jsonwebtoken');
const {verifyToken, deprecated} = require('./middleware');
const {Domain, User, Post, Hashtag} = require('../models');
const router = express.Router();

//모든 요청에 deprecated를 수행
//v1 으로 요청하느 클라이언트 애플리케이션은 경고가 발생
router.use(deprecated);

//토큰 요청을 처리 
router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
   
    try {
        //도메인 가져오기 
      const domain = await Domain.findOne({
        where: {clientSecret},
        include: {
          model: User,
          attribute: ['nick', 'id'],
        },
      });
      if (!domain) {
        return res.status(401).json({
          code: 401,
          message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
        });
      }const token = jwt.sign({
        id: domain.User.id,
        nick: domain.User.nick,
      }, process.env.JWT_SECRET, {
        expiresIn: '1m', // 1분
        issuer: 'nodebird',
      });
      return res.json({
        code: 200,
        message: '토큰이 발급되었습니다',
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    }
});
router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

//클라이언트의 요청을 처리하기 위한 코드
//접속한 클라이언트가 작성한 post를 전부 전송
router.get('/posts/my',verifyToken, (req,res)=> {
  //id가 작성한 모든 Post찾아오기 
  Post.findAll({where:{userId:req.decoded.id}})
  .then((posts) => {
    res.json({
      code:200,
      payload:posts
    })
  })
  .catch( (err) => {
    return res.status(500).json({
      code:500,
      message : '서버 에러'
    })
  })
})

module.exports = router;

