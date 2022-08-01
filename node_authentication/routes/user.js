const express = require('express');
const {isLoggedIn}  = require('./middleware');
const User = require('../models/user');

const router = express.Router();

//url의 일부분을 파라미터 처럼 사용하는 경우에는 :이름 형태로 대입함 
router.post('/:id/follow',isLoggedIn, async(req,res, next) => {
    try {
        const user = await User.findOne({where:{id:req.user.id}});
        if(user) {
            await user.addFollowing(parseInt(req.params.id,10))
            res.send('success');
        }else{
            res.status(404).send('no user');
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;

