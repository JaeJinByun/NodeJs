const express = require('express');

//ajax 요청을 위한 모듈 
const axios = require('axios');

const router = express.Router();

//서버 URL 저장
//const URL = 'http://localhost:9002/v1';
const URL = 'http://localhost:9002/v2';



axios.defaults.headers.origin = 'http://localhost:4000';

const request = async(req, api) => {
  try {
    //토큰이 없으면 토큰을 요청
    if(!req.session.jwt){
      const tokenResult = await axios.post(
        `${URL}/token`,{clientSecret:process.env.CLIENT_SECRET}
      );
      req.session.jwt = tokenResult.data.token;
    }
    return await axios.get(`${URL}${api}`,{headers:{authorization:req.session.jwt}})
  }catch(err) {
    if(err.response.status === 419) {
      delete req.session.jwt;
      return request(req,api);
      }
      return err.response;
  }
}

router.get('/mypost', async(req,res,next) => {
  try{
      //데이터 요청
      const result = await request(req, '/posts/my');
      //출력
      //웹으로 보여주고자 하는 경우는 이 데이터를 html 이름과 함께 전송
      res.json(result.data);
  }catch(err) {
    console.log(err);
    next(err);
  }
})

router.get('/',(req,res) => {
  res.render('main', {key:process.env.CLIENT_SECRET});
})

module.exports = router;  