const url = require('url')
const {URL} = url
const querystring = require('querystring')

//url을 분해
const parsedURL = url.parse('https://github.com/item/list?page=1&size=15')
console.log(parsedURL);

//url을 생성 
const myURL = new URL('https://github.com/item/list?page=1&size=15');

//파라미터 읽어오기
console.log(myURL.searchParams)
console.log(myURL.searchParams.get('page'))
//파라미터 부분 추출 - API는 deprecated( 사용을 권장하지 않음 )
console.log(querystring.stringify(querystring.parse(parsedURL.query)))



