var nowMenuNumber; //현재 선택된 메뉴
var nowChoiceUser; //현재 선택된 유저

window.onload = function(){
	var menuList = $("#left_menu li");
	nowMenuNumber = 0;
	
	for(var i=1; i<=menuList.length; i++){
		var selectorName = '#menu' + i;
		document.querySelector(selectorName).addEventListener('click',
			function(settingNumber) {
				return function(){changeMenu(settingNumber);}}(i)
			, false
		);

	}
	
	changeMenu(1);
}

function userOptionsAllChange()
{
	var allSwitch = confirm("정말 일괄로 적용하겠습니까?");
	if(allSwitch){
		//var aggrohuman 	= document.getElementById('aggrohuman');
		var aggrohuman  	= JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var noteCount  	 	= document.getElementById('noteCount');
		var blockTypeCheck 	= document.getElementsByName('blockTypeRadio');
		var blockColor		= document.getElementById('blockColor');
		var blockTypeValue;

		for(var i=0; i<blockTypeCheck.length; i++) {
			if(blockTypeCheck[i].checked) blockTypeValue = blockTypeCheck[i].value;
		}
		
		for(var i=0; i<aggrohuman.length; i++) {
			console.log(aggrohuman[i]);
			aggrohuman[i].settingType = blockTypeCheck;
		}
		
		//localStorage["aggrohuman"] = aggrohuman.value;
		localStorage["blockType"]  = blockTypeValue;
		localStorage["noteCount"]  = parseInt(noteCount);
		localStorage["blockColor"] = blockColor.value;
	}
	
	logPrint('#005CFF', '일괄처리 완료');
}//function restore_options - 옵션 저장

function userChoice(cellObj, userNumber)
{
	var aggrohuman  = JSON.parse(localStorage['aggrohuman']).userCellInfo;
	var radiobox	= document.getElementsByName('blockTypeRadio');
	var prevSeletedUser = $('.selectedUser');
	
	if(typeof prevSeletedUser[0] != "undefined") { 
		prevSeletedUser[0].className = "badUserCell";
	}
	
	$(cellObj)[0].className = "selectedUser";
	
	$('.choiceSetting .choiceUserName').text(aggrohuman[userNumber].name);
	
    radiobox[aggrohuman[userNumber].settingType].checked = true;
}

function changeMenu(menuNumber)
{
	if(menuNumber != nowMenuNumber) {
		$('#content').load('option_menu' + menuNumber + '.html', function(){
			var menuList = $("#left_menu li");
			
			for(var i=1; i<=menuList.length; i++) {
				var selectorName = '#menu' + i;
				
				if(i != menuNumber) menuList[i-1].id = 'menu' + i;
				else				menuList[i-1].id = 'selectedMenuItem';
			}
			
			nowMenuNumber = menuNumber;
			
			if(nowMenuNumber!=3) restore_options();
			
			switch(menuNumber){
				case 1:
					document.querySelector('#addBadUser').addEventListener('click', addBadUser);
					document.querySelector('#save').addEventListener('click', userOptionsAllChange);
					document.querySelector('#reset').addEventListener('click', optionReset);
					break;
				case 2:
					var userCellList = $("ul.badUserList li");
					for(var i=0; i<userCellList.length; i++){
						userCellList[i].addEventListener('click',  function(cellObj, userNumber) {
							return function() { userChoice(cellObj, userNumber) };
						}(userCellList[i], i));
					}
					break;
					
			}//페이지 셋팅
		});
	}
}//function changeMenu - 옵션메뉴 변경

function restore_options()
{
	var aggrohuman = localStorage['aggrohuman']; //어그로 목록
	var blockType  = localStorage['blockType'];  //어그로 차단 타입(0-미작동, 1-글제거, 2-이름표시, 3-색칠)
	var noteCount  = localStorage['noteCount'];  //머였더라 ㄷㄷ;
	var blockColor = localStorage['blockColor'];
	
	//$('#log')[0].innerHTML = '';
	
	if (aggrohuman != 'undefined') {
		var badUserList = $('.badUserList');
		var date        = getDate();
		var aggrohuman  = JSON.parse(localStorage['aggrohuman']).userCellInfo;
	
		//badUserList[0].innerHTML = '';
		for(var i=0; i<aggrohuman.length; i++){
			badUserList[0].innerHTML += addCell(aggrohuman[i].addDate, aggrohuman[i].name, aggrohuman[i].settingType, i);
		}
	
		$('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
	}
	
	/*
	if(blockType != 'undefined') {
		var radiobox = document.getElementsByName('blockTypeRadio');
		radiobox[blockType].checked = true;
	}*/
	
	if(blockColor != 'undefined') {
	  	var blockColorBox	= document.getElementById('blockColor');
	  	blockColorBox.value	= blockColor;
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
  var resetSwitch = confirm("정말 옵션을 초기화 하시겠습니까? (추가하신 모든 리스트가 사라집니다.)");
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
      localStorage['aggrohuman'] = JSON.stringify({"userCellInfo": [{addDate: getDate(), name: aggroUserName, settingType: 0, settingColor: '#fff'}]});
      badUserList[0].innerHTML  += addCell(getDate(), aggroUserName, 0, 0);
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
        aggrohumanJson.userCellInfo.push({addDate: getDate(), name: aggroUserName, settingType: 0, settingColor: '#fff'});
        localStorage['aggrohuman'] = JSON.stringify(aggrohumanJson);
        badUserList[0].innerHTML  += addCell(getDate(), aggroUserName, 0, aggrohumanList.length-1);
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

function addCell(date, name, settingType, cellNumber)
{
	var settingTypeStr;
	
	switch(settingType) {
		case 0:
			settingTypeStr = "설정없음";
			break;
		case 1:
			settingTypeStr = "글 제거";
			break;
		case 2:
			settingTypeStr = "글 가리기";
			break;
		case 3:
			settingTypeStr = "줄 색칠";
			break;
	}
  return '<li class="badUserCell">'   +
  		 '<div class="cellState">' +
         '<p class="date">' + date + '</p>' +
         '<p class="userState">' + settingTypeStr + '</p>' +
         '</div>' +
         '<p class="badUserName">'     + name + '</p>' +
         '<button class="deleteCellBtn" value="'+ cellNumber +'">삭제</button>' +
         '</li>';
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
      var settingType	= aggrohumanList[i].settingType;
      tempArray.push(aggrohumanList[i]);
      badUserList[0].innerHTML  += addCell(date, aggroUserName, settingType, tempArray.length-1);
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

//document.addEventListener('DOMContentLoaded', restore_options);