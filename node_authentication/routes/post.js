const express = require('express');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {Post, Hashtag} = require('../models');
const {isLoggedIn} = require('./middleware');

const router = express.Router();

try {
    fs.readdirSync('public/img');
}catch(err){
    console.error('img 디렉토리가 없어서 생성합니다.');
    fs.mkdirSync('public/img');
}

//업로드 설정
const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        //업로드할 디렉토리 설정 
        cb(null, 'public/img/');
      },
      filename(req, file, cb) {
        //확장자 가져오기 
        const ext = path.extname(file.originalname);
        //확장자 앞에 현재 시간을 추가 
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }); 
  //img 요청처리 - 이미지 업로드 처리 
  router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    //업로드 된 이미지 경로를 클라이언트에게 전송해서
    //클라이언트에서 출력 
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});




const upload2 = multer();
//폼의 submit 요청이 왔을 때 수행될 내용
//파일 업로드를 하지 않기 위한 객체 
router.post('/',isLoggedIn,upload2.none(),
      async(req,res,next) => {
        try {
          //Post 추가 
          const post = await Post.create({
            content:req.body.content,
            img:req.body.url,
            UserId:req.user.id
          });
          //해시태그 추출   #으로 시작하거나 #으로 끝나는 
          const hashtags = req.body.content.match(/#[^\s#]*/g);
          if(hashtags) {
            //이 전체를 하나로 수정 
            //각각의 데이터를 순회하면서 있으면 찾고 , 없으면 추가 findOrCreate()
            //데이터의 첫글자를 제외하고 소문자로 변경해서 저장 slice(1).toLowerCase()
            const result = await Promise.all(
              hashtags.map(tag => {
                return Hashtag.findOrCreate({
                  where: { title: tag.slice(1).toLowerCase() }  
                })
              })
            );
            //post에서 첫번째 해시태그만 저장 
            await post.addHashtags(result.map(r => r[0]));
          }
          res.redirect('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
});

module.exports = router;









