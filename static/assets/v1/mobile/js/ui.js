$(function(){
  include(); //header
  fn_top(); //Top버튼
  fn_tab(); //공통 탭
  fn_slideTab(); //슬라이드 탭
  fn_bottomFold(); //하단 고정 영역
  fn_layerPop(); //레이어팝업
  fn_pagination(); //스와이퍼 슬라이드 페이지네이션 위치
  fn_calendar(); //체험 날짜 선택
  fn_timeList(); //체험 시간 선택
  //fn_count(); //체험 인원 선택
  fn_accodian(); //아코디언
  fn_cashChoice(); //결제 수단 선택
  fn_selectContBox(); //셀렉트 드롭다운 박스
  fn_select(); //셀렉트 박스
  tooltip(); //툴팁
  fn_inputText(); //input text 박스
  fn_allChk(); //체크박스 전체 선택 및 해지
  fn_pwdShow(); //비밀번호

  $(window).resize(function () {
    fn_pagination();
  });
});

function fn_inputText() {
  if ($('.inputBox').length) {
    $('.inputBox').each(function(){
      if ($(this).find('.unit').length) {
        let unitW = $(this).children('.unit').outerWidth() + 10;
        let ipPR = 0.1*unitW + 'rem';

        $(this).children('input').css({'padding-right': ipPR });
        //setInterval(fn_inputText , 100);
      }
    });
  }
}


//header
const include = function(){
  $('[data-include]').each(function(){
    const target = $(this);
    const href = target.data('include');
    
    // load(경로,동작) 데이터를 불러오는 방식
    // 파일명, 이미지
    target.load(href,function(){
      target.removeAttr('data-include');
    })
  });
};

// Top버튼
function fn_top() {
  //첫 화면 Top버튼 숨김 상태
  $('#wrap').append('<button class="scrollTop" style="display:none">스크롤 맨 위로</button>');

  //Top버튼 클릭 시 스크롤 맨 위로 이동
	$('.scrollTop').on('click',function(){
    $('#wrap').stop().animate({scrollTop: 0}, 300, 'easeOutCirc'); //easeInOutQuart
		$('#container').focus();
	});
  
  scrollCheck();
  let timer; //정리가능?
  //스크롤 발생 시
  $('#wrap').scroll(function(){ 
    $('.scrollTop').fadeIn(200); //Top버튼 나타남
    $('#navWrap').addClass('off'); //하단 네비게이션 사라짐

    const scrollT = $(this).scrollTop();
    scrollCheck(); 

    if(scrollT == 0){ //스크롤이 맨 위로 가면
      $('.scrollTop').stop(true,false).fadeOut(200); //Top버튼 사라짐
      //현재 진행 중인 효과는 즉시 정지되고(false) 대기중인 모든 효과들이 정지(true)된다.
      //stop(false,false) 대기 중인(다음동작) 애니메이션도 제거할지, 현재 애니메이션을 즉시 완료할지 여부(true면 애니메이션의 끝지점으로 바로 감)
    }
    
    clearTimeout(timer);
    timer = setTimeout(function(){ 
      $('.scrollTop').stop().delay(1000).fadeOut(400); //1초 경과(=2초) 뒤 Top버튼 사라짐
      $('#navWrap').removeClass('off'); //하단 네비게이션 나타남
      scrollCheck();
    },1000); //1초 경과 후 코드실행
  });
}

//하단 요소 따라 탑버튼 위치 조정
function scrollCheck(){  //var, function 은 호이스팅으로 맨 위로 올라감
  //네비게이션 있을 경우
  if($('#navWrap').length){
    let navH = $('#navWrap').outerHeight();
    if($('#navWrap').hasClass('off')) navH = 0;
    $('.scrollTop').css({'transform':'translateY(' + -0.1*navH + 'rem)'})
  }

  //버튼 영역 있을 경우
  if($('.bottomWrap').length){
    if(!$('.bottomWrap').data('action')){
      let botH = $('.bottomWrap').outerHeight();   
      $('.scrollTop').css({'transform':'translateY(' + -0.1*botH + 'rem)'})
    }
  }
}


//공통 탭
function fn_tab() {
	$('.tabTit a').on('click', function() {
		tabChange($(this));
    fn_inputText();
		return false;
	});

	function tabChange(obj) {
		let $parent = obj.parent();
    let $grandParent = $parent.parent().parent();
    index = $parent.index();

		$parent.addClass('on').siblings().removeClass('on');

    if($grandParent.length){
      $grandParent.next().children().eq(index).show().siblings().hide();
    } else {
      $grandParent.children().eq(index).show().siblings().hide();
    }

		if (!obj || $(obj).attr("href") != '#')
			location.href=$(obj).attr("href");
	}
}


//탭 클릭시 on이 되며 맨앞으로 스크롤
function fn_slideTab() {
	if ($('.slideTab').length) {
    $('.slideTab').each(function(){
      const $this = $(this);
      let li = $this.find('ul li');
      let w = $this.find('>ul').outerWidth(); 
      let totalWidth = 0;
      li.each(function(){
        totalWidth += $(this).outerWidth(true);
      }) //li 넓이 총합
      totalWidth = Math.floor(totalWidth);

      // 클릭 버튼
      tabCheck($this.find('.on a'),true);
      $this.find('a').on('click',function(){
        tabCheck($(this));
      });

      //탭 좌우 스크롤시 양쪽 블러 발생
      sclslideTab();
      $this.find('>ul.tabTit').scroll(function(){
        sclslideTab();
      });

      function tabCheck(t,motion){
        const target = $this.find('ul');
        t.parent().addClass('on').siblings().removeClass('on');
        
        let tabL = target.offset().left;
        let offsetL = target.find('.on').offset().left - tabL;
        let sclL = target.scrollLeft();
        let gapL = parseInt(li.first().css('margin-left'));
        if(motion){
          //true : 최초로딩
          target.scrollLeft(offsetL + sclL - gapL);
        }else{
          //false : 클릭
          target.stop().animate({scrollLeft: offsetL + sclL - gapL}, 300);
        }
      }

      function sclslideTab(){
        let sclL = $this.find('>ul').scrollLeft();
        $this.addClass('before after');
        if($this.find('ul').scrollLeft() == 0){// 스크롤이 0일 때
          //console.log('스크롤 처음');
          $this.removeClass('before');
        }
        if(sclL + w >= totalWidth){
          //console.log('스크롤 끝');
          $this.removeClass('after');
        }
      }
    })
	} 
}


//하단 고정 영역
function fn_bottomFold() {
  if($('#container > .section').length == 1){
    $('#container').css('padding-bottom', '2.5rem' ); //.section 하나일때 패딩추가
  }

  if($('.bottomWrap').length){
    let botPd1 = $('.bottomWrap').outerHeight() + 20;
    let botPd2 = 0.1*botPd1 + 'rem';

    $('#container').css('padding-bottom', botPd2 ); //하단 버튼 패딩추가
  }

  if($('#navWrap').length){
    let navPd1 = $('#navWrap').outerHeight() + 30;
    let navPd2 = 0.1*navPd1 + 'rem';

    $('#container').css('padding-bottom', navPd2 ); //하단 네비게이션 패딩추가
  }

  if($('footer').length){
    $('#container').css('padding-bottom', '0' ); //메인 푸터있을 경우
  }

  $('.foldBox .btnFold').on('click',function(){
    let foldH = $('.foldCon').outerHeight();
    const $this = $(this);
    $('.bottomWrap').data('action',true);

    if($this.hasClass('on')){ //클릭한 순간에는 on있음 : 클릭한 이후에 움직임
      //console.log('있을때');
      foldH = $('.bottomWrap').outerHeight() - $('.foldCon').outerHeight();
    }else{
      //console.log('없을때');
      foldH = $('.bottomWrap').outerHeight() + $('.foldCon').outerHeight();
    }
    $this.toggleClass('on').siblings('.foldCon').stop().slideToggle('fast','linear',function(){ //swing? linear? 
      $('.bottomWrap').data('action',false);
    })
    
    $('.scrollTop').css({'transform':'translateY(' + -0.1*foldH + 'rem)'})
	});
}


//레이어팝업
function fn_layerPop(){
  $(document).on('click','.openPop',function(){
    let href = $(this).attr('href');
    $(href).find('.popCon').scrollTop(0);
    $(href).addClass('on').removeClass('off');
    return false;
  });
  $(document).on('click','.popWrap .btnClosePop',function(){
    const $this = $(this);
    //$this.prev('.popCon').scrollTop(0);
    $this.closest('.popWrap').addClass('off').removeClass('on');
  });
}


//스와이퍼 슬라이드 페이지네이션 위치
function fn_pagination(){
  if ($('.slideWrap').length) {
    $('.slideWrap').each(function(){
      let $this = $(this);
      let imgBoxH = $this.find('.imgBox').outerHeight(true);
      let txtBoxH = $this.find('.swiper-slide-active .txtBox').outerHeight();

      $this.find('.swiper-pagination').css({'top': 0.1*imgBoxH + 0.1*txtBoxH + 'rem'});
      $this.find('.swiper-button-prev').css({'top': 0.1*imgBoxH / 2 + 'rem'});
      $this.find('.swiper-button-next').css({'top': 0.1*imgBoxH / 2 + 'rem'});
    })
  }
}

//체험 날짜 선택
function fn_calendar(){
  $(document).on('click','.weekDay button, .dateGrid button',function(){ 
    $(this).addClass('on').closest('li').siblings().find('button').removeClass('on');
  });

  $(document).on('click','.calendarWrap .btnCalChg',function(){
    let $this = $(this);
    $this.toggleClass('on').siblings().toggleClass('on'); //순서 여기
    
    //주간달력 선택 날짜(on)를 스크롤 맨앞으로
    if(!$this.hasClass('on')){
      const target = $this.siblings('.weeklyCalendar').find('.weekDay');
      let parent = target.find('.on').closest('li'); //on의 부모 li
      let liL = parent.offset().left;
      let sclL = target.scrollLeft();
      let paddingL = parseInt($('.section').css('padding-left'));

      target.scrollLeft(sclL+liL-paddingL);
    }
  });
}


//체험 시간 선택
function fn_timeList(){
  $(document).on('click','.timeList li a',function(){ 
    let $this = $(this).parent();
    let $parent = $(this).parent().parent();
    if($this.hasClass('soldOut')){
      return false;
    } 

    if($parent.hasClass('clear')){
      if($this.hasClass('on')){
        $this.removeClass('on');
      } 
      else {
        $this.addClass('on').siblings().removeClass('on');
      }
    } else {
      $this.addClass('on').siblings().removeClass('on');
    }
  });
}


//체험 인원 선택
function fn_count(){
  //체험시간 클릭 시 체험인원수 선택 나타남
  if ($('.timeListWrap').length) {
    $('.timeAfter.countNum').removeClass('on');

    $(document).on('click','.timeList a',function(){
      let $this = $(this).parent();
      if($this.hasClass('soldOut')){
        return false;
      } else {
        $('.timeAfter.txt').hide();
        $('.timeAfter.countNum').addClass('on');
      }
    });
  }

  let count = 0;
  let interval;
  /* function minus(){
    if(count > 0){   
      count -= 1;
      $('.count').html(count);
    } else {
      return false;
    }
  }

  function plus(){
    if(count < 50){ 
      count += 1;
      $('.count').html(count);
    } else {
      return false;
    }
  } <1> */

  // <1> ↑위를 ↓아래로 줄임
  function countMotion(t){
    if( t == 'minus'){
      count <= 0 ? count = 0 : count--;
    }
    if (t == 'plus'){
      count >= 50 ? count = 50 : count++;
    }
    $('.count').html(count);
  }

  /* $(document).on('click','.countNum .btnMinus',function(e){
    // if(count > 0){   
    //   minus();   
    // } else {
    //   return false;
    // }

    // ↑위를 ↓아래로 줄임
    countMotion('minus');
  });

  $(document).on('click','.countNum .btnPlus',function(){     
    // if(count < 2){ 
    //   plus();  
    // } else {
    //   return false;
    // }

    // ↑위를 ↓아래로 줄임
    countMotion('plus');
  }); <2> */

  // <2> ↑위를 ↓아래로 줄임
  $(document).on('click','.countNum button',function(e){
    if($(this).hasClass('btnMinus')){
      countMotion('minus');
    }else{
      countMotion('plus');
    }
  });

  //클릭 이벤트와 동일한 방식으로 줄여보자!
  /* $(document).on('touchstart','.countNum .btnMinus',function(){ 
    interval = setInterval(minus , 70);

    $(this).on('touchend',function(){ //touchend는 touchstart 안에 있어도 됨
      clearInterval(interval);
    });
  });


  $(document).on('touchstart','.countNum .btnPlus',function(){ 
    interval = setInterval(plus , 70)

    $(this).on('touchend',function(){ 
      clearInterval(interval)
    });
  }); */
}

//아코디언
function fn_accodian() {
  $(document).on('click','.accoTop',function(e){ 
    let $this =  $(this).parent();
    let $parent =  $(this).parent().parent();
    
    if($parent.hasClass('justOne')){
      console.log(1);
      $this.siblings().removeClass('on').children('.accoCon').slideUp();
    } //하나만 열림
    if($this.hasClass('on')){
      $this.find('.accoCon').css({'display':'block'});
      $(this).siblings('.accoCon').stop().slideUp().parent().removeClass('on');
    }
    else {
      $(this).siblings('.accoCon').stop().slideDown().parent().addClass('on');
    }
    
    /* if($(e.originalEvent.target).closest('.checkBox').length > 0){
      //checkbox 있을 경우
    } else {
      $this =  $(this).parent();
      if($this.hasClass("on")){
        $(this).next('.accoCon').stop().slideUp().parent().removeClass('on');
      }
      else {
        $(this).next('.accoCon').stop().slideDown().parent().addClass('on');
      }
    }
    return false */
  });
}

//결제 수단 선택
function fn_cashChoice(){
  $(document).on('click','.cashChoice button',function(e){ 
    $(this).parent().addClass('on').siblings().removeClass('on');
  });
}

//셀렉트 드롭다운 박스
function fn_selectContBox(){
  $(document).on('click','.selectContBox > a',function(){
    if(!$(this).hasClass('disabled')){
      $('.selectContBox > a').not($(this)).siblings('.view').stop().slideUp().closest('.selectContBox').removeClass('on');
      $(this).siblings('.view').stop().slideToggle().closest('.selectContBox').toggleClass('on');
    }
    return false;
  });
  $(document).on('click','.selectContBox .view a',function(){
    const html = $(this).html();
    if(!$(this).hasClass('disabled')){
      $(this).closest('.view').siblings('a').html(html);
      $(this).addClass('on').siblings().removeClass('on');
      $(this).closest('.view').stop().slideUp('fast').closest('.selectContBox').removeClass('on');
    } 
    if($(this).hasClass('reset')){
      $(this).closest('.view').siblings('a').html('바우처를 선택해 주세요');
    }
    return false;
  });
}

//셀렉트 박스
function fn_select(){
  $('.selectBox > select').css({"color": "#888"})
  $(document).on('change','.selectBox > select',function(){
    let $index = $(".selectBox > select option").index($(".selectBox > select option:selected"));
    if($index == 0){
      $('.selectBox > select').css({"color": "#888"})
    } else {
      $('.selectBox > select').css({"color": "#262626"})
    }
  });
}


//툴팁
const tooltip = function(){
//function fn_tooltip(){
  $(document).on('click', '.tooltip', function (e) {
    const winW = $(window).outerWidth();
    const left = $(this).offset().left;
    const space = 20;
    let tipW = 250;
    if ($(this).data('width')) {
      tipW = $(this).data('width');
    }

    const secW = $('.section').outerWidth() - space * 2;
    let addM = 0;
    if (($(this).parent().position().left + 10 - space) / secW > 0.5) {
      addM = 20;
    }
    let tipLeft = -Math.round((($(this).parent().position().left + 10 - space) / secW) * tipW) + addM;

    if ($(this).siblings('.tooltipPop').hasClass('popup')) {
      if (!$('.popupDim').length) {
        $('body').append('<div class="popupDim"></div>').addClass('scrollLock');
      }
    }

    $('.tooltipPop').not($(this).siblings('.tooltipPop')).fadeOut('fast');
    $(this)
      .siblings('.tooltipPop')
      .css({ width: tipW, left: tipLeft, '--tip-left': tipW - tipLeft - tipW + 6 + 'px' });
    $(this).siblings('.tooltipPop').fadeToggle('fast');
    return false;
  });

  $(document).on('click', '.tooltipPop .btnClose', function () {
    $(this).closest('.tooltipPop').fadeOut('fast');
    $('.popupDim').fadeOut('fast', function () {
      $(this).remove();
    });
    $('body').removeClass('scrollLock');
    return false;
  });

  $('html').click(function(e) {   
    if(!$(e.target).hasClass('tooltipPop')){
      $('.tooltipPop').fadeOut('fast');
      $('.popupDim').fadeOut('fast', function () {
        $(this).remove();
      });
      $('body').removeClass('scrollLock');
    }
  });

  /* $('body').click(function (e) {
    if (!$(e.originalEvent.target).closest('.tooltipWrap').length && !$(e.originalEvent.target).closest('.layerPopWrap').length && !$(e.originalEvent.target).closest('.introWrap').length) {
      $('.tooltipPop').fadeOut('fast');
      $('.popupDim').fadeOut('fast', function () {
        $(this).remove();
      });
      $('body').removeClass('scrollLock');
    }
  }); */
}


//체크박스 전체 선택 및 해지
function fn_allChk() {
  $('[data-check-all]').each(function () {
    const target = $(this);
    const connet = target.data('check-all');
    target.find('input').on('change', function () {
      if ($(this).data('no-chg')) return;
      $('[data-check-child=' + connet + ']')
        .find('input')
        .prop('checked', $(this).is(':checked') ? true : false)
        .change();
    });
  });

  $('[data-check-child]').each(function () {
    const target = $(this);
    const parent = $('[data-check-all=' + target.data('check-child') + ']');
    const connet = $('[data-check-child=' + target.data('check-child') + ']');
    const max = connet.length;
    target.find('input').on('change', function () {
      if ($(this).is(':checked')) {
        parent.find('input').prop('checked', max == connet.find('input:checked').length ? true : false);
      } else {
        parent.find('input').prop('checked', false);
      }

      if (parent.data('check-child')) {
        parent.find('input').data('no-chg', true).change().removeData('no-chg');
      }
    });
  });
}


//비밀번호
function fn_pwdShow() {
  $(document).on('click', '.btnPwdShow', function () {
    if ($(this).siblings('input').attr('type') == 'password') {
      $(this).siblings('input').attr('type', 'text').closest('.inputBox').addClass('show');
    } else {
      $(this).siblings('input').attr('type', 'password').closest('.inputBox').removeClass('show');
    }
    return false;
  });
}


// 로딩바
const loading = {
  openM: function (set) {
    let settings = $.extend(
      {
        target: $('body'),
        text: '',
      },set
    );

    if(settings.target.prop('tagName') == 'BODY') {
      $('body').addClass('scrollLock');
    }
    
    settings.target.append(layerPopHtml())
    setTimeout(function () {
      settings.target.find('.loadingWrap').addClass('on');
    }, 10);


    function layerPopHtml() {
      let $layout = '<div id="ladingPop" class="layerPopWrap loadingWrap">';
      $layout += '<div class="bg"></div>';
      $layout += '<div class="loadingBox">';
      $layout += '<div class="loading"><i></i><i></i><i></i><i></i></div>';
      if (settings.text) {
        $layout += '<div class="text">' + settings.text + '</div>';
      }
      $layout += '</div></div>';
      return $layout;
    }
  },
  closeM: function (set) {
    let settings = $.extend(
      {
        target: $('body'),
      },set
    );
    if(settings.target.prop('tagName') == 'BODY') {
      $('body').removeClass('scrollLock');
    }
      
    settings.target.find('.loadingWrap').removeClass('on');
    setTimeout(function () {
      settings.target.find('.loadingWrap').remove();
    }, 300);
  }
};