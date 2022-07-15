setInterval(()=>{
    //예외를 강제로 발생 시킴
    try {
        throw new Error("예기치 않은 상황 발생")
    } catch (error) {
        console.log("예외 발생");
    }
    console.log("타이머");
},1000)

