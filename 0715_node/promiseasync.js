const fs = require('fs').promises;

console.log('파일 읽기 전에 수행');
//비동기 처리 - promise 이용, 최근에 권장 
fs.readFile('./test.txt')
        .then((data) => {
            console.log(data.toString());
        })
        .catch((err) => {
             console.log(err);
        })

console.log('읽은 후에 수행');

