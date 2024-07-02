$(function () {
  tableinit();
  tabList();
  linkGroup();
});


const linkGroup = function(){
  $(document).on('click','.workAll',function() {
    $(this).addClass('on').siblings().removeClass('on');
    $('.id.waiting').closest('tr').show();
    return false;
  });
  $(document).on('click','.workEnd',function(){
    $(this).addClass('on').siblings().removeClass('on');
    $('.id.waiting').closest('tr').hide();
    return false;
  });
};

const tabList = function () {
  const target = $('.tabList a');
  target.on('click', function () {
    $(this).addClass('on').siblings().removeClass('on');
    tableinit();
    $('.linkGroup').show();
    if($(this).index() == 1) $('.linkGroup').hide();
    return false;
  });
};

const tableOpen = function () {
  const target = $('.tabList .on');
  const json = target.data('json');
  const table = $('.tabelWrap tbody');
  let allNum = 0;
  let compNum = 0;
  const count1 = $('.infoBox .one span');
  const count2 = $('.infoBox .two span');
  const count3 = $('.infoBox .three span');
  $.ajax({
    url: json,
    mathod: 'GET',
    dataType: 'JSON',
    complete: function (data) {
      const d = data.responseJSON;
      $.each(d, function (a, b) {
        if (b.category != '' && b.category) {
          tableTbody('type2');
        } else {
          tableTbody();
          allNum++;
        }
        const t = table.find('tr:last');
        t.find('.number').html(allNum);
        if (b.complete != '' && b.complete) {
          compNum++;
        }
        $.each(b, function (j, i) {
          if (j == 'id') {
            const link = b.url + i + '.html';
            if(b.complete != ''){
              t.find('.id').append('<a href="' + link + '" target="_blank">' + i + '</a>');
            }else {
              t.find('.id').addClass('waiting').append(i + '(미완)');
            }
          } else {
            t.find('.' + j).html(i);
          }
        });
      });

      count1.html(allNum);
      count2.html(compNum);
      count3.html(parseInt(compNum/allNum * 100) + '%');

      $(".workEnd").trigger("click");
    }
  });
};

const tableinit = function (a) {
  let html = '';
  html += '<div class="table">';
  html += '<table>';
  html += '<colgroup>';
  html += '<col width="80px">';
  html += '<col width="">';
  html += '<col width="100px">';
  html += '<col width="">';
  html += '<col width="">';
  html += '<col width="">';
  html += '<col width="100px">';
  html += '<col width="100px">';
  html += '<col width="100px">';
  html += '<col width="">';
  html += '</colgroup>';
  html += '<thead>';
  html += '<tr>';
  html += '<th>번호</th>';
  html += '<th>화면명</th>';
  html += '<th>페이지 유형</th>';
  html += '<th>1뎁스</th>';
  html += '<th>2뎁스</th>';
  html += '<th>3뎁스</th>';
  html += '<th>작업자</th>';
  html += '<th>작업일</th>';
  html += '<th>수정일</th>';
  html += '<th>비고</th>';
  html += '</tr>';
  html += '</thead>';
  html += '<tbody>';
  html += '</tbody>';
  html += '</table>';
  html += '</div>';

  $('.tabelWrap').empty().append(html);

  tableOpen();
};

const tableTbody = function (a) {
  const tdList = ['number', 'id', 'page', '1depth', '2depth', '3depth', 'worker', 'complete', 'revised', 'comment'];
  let html = '';
  if (a === 'type2') {
    html += '<td class="category" colspan="' + tdList.length + '"></td>';
  } else {
    $.each(tdList, function (e, i) {
      html += '<td class="' + i + '"></td>';
    });
  }
  $('.tabelWrap tbody').append('<tr></tr>').find('tr:last').append(html);
};
