const { time } = require('console');
const fs = require('fs');

//현재 날짜
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();
let hour = today.getHours();
let min = today.getMinutes();
let sec = today.getSeconds();

fs.writeFile(year + '-' + month + '-' + date + '.log',
            '메시지' + ' log time [ ' + hour + ':' + min + ':' + sec + ' ]',
            (err) => {
            console.log("파일 기록 성공");  
            }
)
