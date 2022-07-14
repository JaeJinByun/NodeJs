//setInterval => 등록한 시간 단위로 함수를 수행해주는 타이머

function func1(){
    console.log("함수1");
}
//func1 은 3초가 지날 때 마다 호출 됩니다.
//이런 함수가 콜백함수이다
setInterval(func1, 3000);

let func2 = function() {
    console.log("함수2");
}

setInterval(func2,3000);


setInterval(function(){
    console.log("함수3");
},3000);

//화살표 함수(arrow function)를 이용한 콜백 작성
setInterval(()=> {
    console.log("함수4");
},3000);


//즉시 실행
setImmediate( ()=> {
    console.log("즉시실행");
});


//다른 콜백함수 보다 먼저 수행
process.nextTick(()=>{
    console.log("제일 1순위")
})

Promise.resolve().then( ()=> {
    console.log("다른 것 들 보다 먼저 2")
})






