const exec = require('child_process').exec;

//dir 명령을 수행하기 위한 프로세스 생성
var process = exec('ls');

//성공 했을때 처리
process.stdout.on('data',function(data){
    console.log(data.toString());
});

//에러가 발생했을때
process.stderr.on('data',function(data){
    console.log(data.toString());
});









