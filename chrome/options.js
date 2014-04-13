function save_options() {
  var aggrohuman = document.getElementById('aggrohuman');
  var noteCount  = document.getElementById('noteCount');
  var blockTypeCheck = document.getElementsByName('blockTypeRadio');
  var blockTypeValue;

  for(var i=0; i<blockTypeCheck.length; i++){
    if(blockTypeCheck[i].checked) blockTypeValue = blockTypeCheck[i].value;
  }

  //localStorage["aggrohuman"] = aggrohuman.value;
  localStorage["blockType"]  = blockTypeValue;
  localStorage["noteCount"]  = parseInt(noteCount);

  logPrint('#005CFF', '옵션 저장완료');
}//function restore_options - 옵션 저장

function restore_options() {
  var aggrohuman = localStorage['aggrohuman']; //어그로 목록
  var blockType  = localStorage['blockType'];  //어그로 차단 타입(0-미작동, 1-글제거, 2-이름표시, 3-색칠)
  var noteCount  = localStorage['noteCount'];  //머였더라 ㄷㄷ;

  $('#log')[0].innerHTML = '';

  if (aggrohuman) {
    var badUserList = $('.badUserList');
    var date        = getDate();
    var aggrohuman  = JSON.parse(localStorage['aggrohuman']).userCellInfo;

    badUserList[0].innerHTML = '';
    for(var i=0; i<aggrohuman.length; i++){
      badUserList[0].innerHTML += addCell(aggrohuman[i].addDate, aggrohuman[i].name, i);
    }

    $('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
  }

  if(blockType) {
    var radiobox = document.getElementsByName('blockTypeRadio');
    radiobox[blockType].checked = true;
  }
  /*
  if(noteCount) {
    var noteCountText  = document.getElementById('noteCount');
    noteCountText.innerHtml = noteCount;
  }
  */
}//function restore_options - 페이지 로드

function optionReset()
{
  var resetSwitch = confirm("정말 옵션을 초기화 하시겠습니까?");
  if(resetSwitch){
    var aggroUserName  = document.getElementById('aggrohuman');
    var radiobox       = document.getElementsByName('blockTypeRadio');
    var badUserList    = $('.badUserList');

    localStorage['aggrohuman'] = '';
    localStorage['blockType']  = 0;
    localStorage['noteCount']  = null;

    badUserList[0].innerHTML = '';
    radiobox[0].checked      = true;
    aggroUserName.value      = '';
    logPrint('#005CFF', '옵션 초기화 완료');
  }
}//function optionReset - 옵션 초기화

function addBadUser()
{
  var aggroUserNameTextBox = document.getElementById('aggrohuman');
  var aggroUserName        = aggroUserNameTextBox.value;
  var badUserList          = $('.badUserList');

  if(aggroUserName != ''){
    if(localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null){
      localStorage['aggrohuman'] = JSON.stringify({"userCellInfo": [{addDate: getDate(), name: aggroUserName}]});
      badUserList[0].innerHTML  += addCell(getDate(), aggroUserName, 0);
      logPrint('#005CFF', '어그로 유저 추가');
    }else{
      var addSwitch      = true;
      var aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
      var aggrohumanList = aggrohumanJson.userCellInfo;

      for(var i=0; i<aggrohumanList.length; i++){
        if(aggrohumanList[i].name==aggroUserName){
          addSwitch = false;
          break;
        }
      }//for - 중복체크

      if(addSwitch){
        aggrohumanJson.userCellInfo.push({addDate: getDate(), name: aggroUserName});
        localStorage['aggrohuman'] = JSON.stringify(aggrohumanJson);
        badUserList[0].innerHTML  += addCell(getDate(), aggroUserName, aggrohumanList.length-1);
        logPrint('#005CFF', '어그로 유저 추가');
      }else{
        logPrint('red', '리스트에 이미 존재함');
      }
    }
    $('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
    aggroUserNameTextBox.value = '';
  }else{
    logPrint('red', '이름이 비어있음');
  }

}

function logPrint(color, text)
{
  var log = $('#log')[0];
  log.innerHTML   = text;
  log.style.color = color;
}//function logPrint - 페이지 로그 출력

function addCell(date, name, cellNumber)
{
  return '<div class="badUserCell">'   +
         '<p class="date">'            + date + '</p>' +
         '<p class="badUserName">'     + name + '</p>' +
         '<button class="deleteCellBtn" value="'+ cellNumber +'">삭제</button>';
}//function addCell - 리스트 셀 형식

function deleteCell(data)
{
  var deleteCellNumber = data.currentTarget.value;
  var aggrohumanJson   = JSON.parse(localStorage['aggrohuman']);
  var aggrohumanList   = aggrohumanJson.userCellInfo;
  var badUserList      = $('.badUserList');
  var tempArray = new Array();

  badUserList[0].innerHTML = '';
  for(var i=0; i<aggrohumanList.length; i++){
    if(i!=deleteCellNumber){
      var aggroUserName = aggrohumanList[i].name;
      var date          = aggrohumanList[i].addDate;
      tempArray.push(aggrohumanList[i]);
      badUserList[0].innerHTML  += addCell(date, aggroUserName, tempArray.length-1);
    }
  }

  if(tempArray.length!=0)$('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트

  aggrohumanJson.userCellInfo = tempArray;
  localStorage['aggrohuman']  = JSON.stringify(aggrohumanJson);

  logPrint('#005CFF', '셀 삭제 완료');
}

function getDate()
{
  var date  = new Date();
  var year  = date.getFullYear();
  var month = date.getMonth()+1;
  var day   = date.getDate();

  if(month <10 ) month = '0' + month;
  if(day   <10 ) day   = '0' + day;

  return ''+year+'/'+month+'/'+day;
}//function getDate - 날짜값을 얻어옴

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#addBadUser').addEventListener('click', addBadUser);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#reset').addEventListener('click', optionReset);