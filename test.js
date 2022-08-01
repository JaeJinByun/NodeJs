

function reservation(nick,phone,howMany,callbackFunc) { 
    console.log(`${nick}님이 ${howMany}명을 예약하였습니다.`);

    setTimeout(() => {
        console.log(`자리가 났습니다. ${phone}로 전화를 겁니다...`);
        return callbackFunc('자리났습니다. 오셔도 됩니다.');
    }, 2000);

}

function receive_call(msg) {
    console.log(`${msg}`);
}

var msg = reservation('JIn','000-0000-0000',4,receive_call);
