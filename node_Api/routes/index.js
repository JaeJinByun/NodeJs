const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User, Domain } = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

//기본 요청 처리
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user && req.user.id || null },
      include: { model: Domain },
    });
    //랜더링 : 뷰로 출력한다라는 의미
    //첫번째 매개변수는 출력할 뷰의 이름인데
    //이 이름과 nunjucks 설정이 합쳐져서 실제로 출력할 파일을 결정한다. 
    //두번째 매개변수는 뷰에게 전달하는 데이터이다. 
    res.render('login', {
      user,
      domains: user && user.Domains,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
//도메인 등록 처리 
router.post('/domain', isLoggedIn, async (req, res, next) => {
    try {
      await Domain.create({
        UserId: req.user.id,
        host: req.body.host,
        type: req.body.type,
        clientSecret: uuidv4(),
      });
      res.redirect('/');
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  
  module.exports = router;