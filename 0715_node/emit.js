//process 객체에게 test라는 이벤트가 발생하면 수행할 작업

process.addListener('test', ()=> {
    console.log('강제로 이벤트 발생')
})

process.emit('test');

