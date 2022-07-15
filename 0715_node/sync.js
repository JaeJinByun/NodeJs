const fs = require('fs');

console.log('파일 읽기 전에 수행');

//Mac 에서 현재위치의 상태를 ./ 로 표현하기 때문에 써주는게 좋다.
let data = fs.readFileSync('./test.txt');
console.log('읽은 내용 : ', data.toString());

data = fs.readFileSync('./test2.json');
console.log('읽은 내용 : ', data.toJSON());

console.log('읽은 후에 실행');


