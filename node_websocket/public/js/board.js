var ctx;

$(function(){
    //캔버스에서 그림을 그리기 위해서 그리기 정보를 가진
    //객체를 가져옵니다.
    ctx = $('#cv').get(0).getContext('2d');
    
    //아이디가 cv 인 객체의 mousedown 이벤트가 발생하면
    //draw 객체의 start 함수가 호출됩니다.
    $('#cv').bind('mousedown', draw.start);
    $('#cv').bind('mousemove', draw.move);
    $('#cv').bind('mouseup', draw.end);

    //기본 모양 설정
    shape.setShape();
})