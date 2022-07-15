const fs = require('fs');

console.log('파일 읽기 전에 수행');

fs.readFile('./test.txt', (err,data) => {
    if(err) {
        throw err;
    }
    console.log("읽은 내용 :",data.toString());
})

console.log('읽은 후에 수행');







