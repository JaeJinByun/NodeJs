//대칭형 암호화 
const crypto = require('crypto');

//암호화 할 문자
const plaintext = '사이버가수 아담';

//암호화에 사용할 3가지 정보
const algorithm = 'aes-256-cbc';    //알고리즘
const key = 'abcdefghijklmnopqrstuvwxyz123456' //key
const iv = '1234567890123456'       //iv - 초기화 벡터

const iv1 = '1234567890123457';

//cipher 생성
let cipher = crypto.createCipheriv(algorithm,key,iv);
//암호화 
let result = cipher.update(plaintext,'utf-8','base64');
result += cipher.final('base64');
console.log(result)

//cipher 생성
cipher = crypto.createCipheriv(algorithm,key,iv1);
//암호화 
result = cipher.update(plaintext,'utf-8','base64');
result += cipher.final('base64');
console.log(result)


//복호화
cipher = crypto.createDecipheriv(algorithm,key,iv1);
result = cipher.update(result,'base64','utf-8');
result += cipher.final('utf-8');
console.log(result)

