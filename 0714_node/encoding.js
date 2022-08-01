const crypto = require('crypto');

const password1 = "adam";
const password2 = "adam";
const password3 = "mada";
/*
    Digest 란 ? 
    Hash 함수를 통과 하기전의 원본 데이터를 메세지(message)라고 부르고,
    통과된 이후의 데이터를 다이제스트(digest)라고 부른다.
*/


// 단방향 암호화 - pbkdt2, bcrypt, scrypt 로 검색 

//                          [암호화 방식]        [target]         [인코딩방식]
const p1 = crypto.createHash('sha512').update(password1).digest('base64')

const p2 = crypto.createHash('sha512').update(password2).digest('base64')

const p3 = crypto.createHash('sha512').update(password3).digest('base64')

console.log('adam : ' , p1)
console.log('adam : ' , p2)
console.log('mada : ' , p3)

