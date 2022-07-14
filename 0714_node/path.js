//path 모듈을 사용할 준비
const path = require('path');

console.log('경로 부분자:', path.sep);

const basepath = "c://adam"

console.log(path.join(basepath,'/adam.png'));