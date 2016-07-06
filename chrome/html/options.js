var nowMenuNumber; //현재 선택된 메뉴

$(function() {
	$(document).on('click', '#addBadUser', addBadUser);
	$(document).on('click', '.choiceSetting input[type="radio"]', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		
		aggrohuman[userid].settingType = data.target.value;
		save_json(aggrohuman);
		
		var setType = settingToStrConvert(parseInt(data.target.value));
		
		$('.select .userState').text(setType);
		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
	});
	
	$(document).on('keyup', '.choiceSetting #userID', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		var inID = data.target.value;
		data.target.value = inID.replace(/[^0-9]/, "");
		
		aggrohuman[userid].ruliwebID = data.target.value;
		
		save_json(aggrohuman);
	});
	
	$(document).on('change', '.choiceSetting #userID', function() {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		
		$('.select .userID').text(aggrohuman[userid].ruliwebID);
		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + 'ID 변경');
	});
	
	$(document).on('keyup', '.choiceSetting #userMemo', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		var inID = data.target.value;
		
		aggrohuman[userid].user_memo = data.target.value;
		
		save_json(aggrohuman);
	});
	
	$(document).on('change', '.choiceSetting #userMemo', function() {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		
		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '유저 메모 추가');
	});
	
});

function save_json(jsonData) {
	localStorage['aggrohuman'] = JSON.stringify({"userCellInfo":jsonData});
}

window.onload = function() {
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
		var aggrohuman  		= JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var noteCount  	 		= document.getElementById('noteCount');
		var blockTypeCheck 	= document.getElementsByName('blockTypeRadio');
		var blockColor			= document.getElementById('blockColor');
		var blockTypeValue;

		for(var i=0; i<blockTypeCheck.length; i++) {
			if(blockTypeCheck[i].checked === true) blockTypeValue = blockTypeCheck[i].value;
		}
		
		for(var i=0; i<aggrohuman.length; i++) {
			aggrohuman[i].settingType = blockTypeValue;
		}
		
		localStorage['aggrohuman'] = JSON.stringify({"userCellInfo":aggrohuman});
		localStorage["blockType"]  = blockTypeValue;
		localStorage["blockColor"] = blockColor.value;
	}
	
	$('.badUserList').html('');
	
	restore_options();
	logPrint('#005CFF', '일괄처리 완료');
}//function restore_options - 옵션 저장

function userChoice(cellObj, userNumber)
{
	var aggrohuman  = JSON.parse(localStorage['aggrohuman']).userCellInfo;
	var radiobox	= document.getElementsByName('blockTypeRadio');
	
	var blockgroup = $('.blockGroup');
	blockgroup.removeClass();
	blockgroup.addClass('blockGroup');
	
	$('#userID')[0].value = '';
	
	$('.select').removeClass();
	$(cellObj).addClass('select');
	$('.choiceSetting .choiceUserName').text(aggrohuman[userNumber].name);
	$('#userID')[0].value = aggrohuman[userNumber].ruliwebID;
	var settingType = aggrohuman[userNumber].settingType;
  radiobox[settingType].checked = true;
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
					//document.querySelector().addEventListener('click', addBadUser);
					document.querySelector('#save').addEventListener('click', userOptionsAllChange);
					document.querySelector('#reset').addEventListener('click', optionReset);
					break;
				case 2:
					var userCellList = $("ul.badUserList li");
					for(var i=0; i<userCellList.length; i++){
						userCellList[i].addEventListener('click', function(cellObj, userNumber) {
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
	var blockColor = localStorage['blockColor'];
	
	//$('#log')[0].innerHTML = '';
	
	if (aggrohuman != undefined) {
		var badUserList = $('.badUserList');
		var date        = getDate();
		var aggrohuman  = JSON.parse(localStorage['aggrohuman']).userCellInfo;

		for(var i=0; i<aggrohuman.length; i++){
			badUserList[0].innerHTML += addCell(i, aggrohuman[i].addDate, aggrohuman[i].name, aggrohuman[i].ruliwebID, aggrohuman[i].settingType, i);
		}
	
		$('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
	}

	if(blockColor != undefined) {
	  	var blockColorBox	= document.getElementById('blockColor');
	  	blockColorBox.value	= blockColor;
	}
}//function restore_options - 페이지 로드

function optionReset()
{
  var resetSwitch = confirm("정말 옵션을 초기화 하시겠습니까? (추가하신 모든 리스트가 사라집니다.)");
  if(resetSwitch){
    var aggroUserName  = document.getElementById('aggrohuman');
    var radiobox       = document.getElementsByName('blockTypeRadio');
    var badUserList    = $('.badUserList');

    delete localStorage['aggrohuman'];
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
  
  if(aggroUserName != '') {
    if(localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null){
      localStorage['aggrohuman'] = JSON.stringify({"userCellInfo": [{addDate: getDate(), name: aggroUserName, ruliwebID: '', settingType: 0, settingColor: '#fff'}]});
      badUserList[0].innerHTML  += addCell(0, getDate(), aggroUserName, '', 0, 0);
      logPrint('#005CFF', '어그로 유저 추가');
      // 최초 추가
      
    } else {
    	var aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
      var addSwitch      = true;
      var aggrohumanList = aggrohumanJson.userCellInfo;

      for(var i=0; i<aggrohumanList.length; i++){
        if(aggrohumanList[i].name==aggroUserName){
          addSwitch = false;
          break;
        }
      }//for - 중복체크

      if(addSwitch){
        aggrohumanJson.userCellInfo.push({addDate: getDate(), name: aggroUserName, ruliwebID: '', settingType: 0, settingColor: '#fff'});
        localStorage['aggrohuman'] = JSON.stringify(aggrohumanJson);
        badUserList[0].innerHTML  += addCell(aggrohumanJson.userCellInfo.length - 1, getDate(), aggroUserName, '', 0, aggrohumanList.length-1);
        logPrint('#005CFF', '어그로 유저 추가');
      }else{
        logPrint('red', '리스트에 이미 존재함');
      }
    }
    $('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
    aggroUserNameTextBox.value = '';
  } else {
    logPrint('red', '이름이 비어있음');
  }

}

function logPrint(color, text)
{
  var log = $('#log')[0];
  log.innerHTML   = text;
  log.style.color = color;
}//function logPrint - 페이지 로그 출력

function settingToStrConvert(settingType) {
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
	
	return settingTypeStr;
}

function addCell(id, date, name, ruliwebID, settingType, cellNumber)
{
	var settingTypeStr = settingToStrConvert(parseInt(settingType));
	
  return '<li userid=' + id + '>'   +
  			 '<div class="cellState">' +
         '<p class="date">' + date + '</p>' +
         '<p class="userState">' + settingTypeStr + '</p>' +
         '</div>' +
         '<div class="badUserName">' +
         '<p class="userName">' + name + '</p>' +
         '<p class="userID">' + ruliwebID + '</p>' +
         '</div>' +
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
      var settingType		= aggrohumanList[i].settingType;
      var ruliwebID			= aggrohumanList[i].ruliwebID;
      tempArray.push(aggrohumanList[i]);
      badUserList[0].innerHTML  += addCell(i, date, aggroUserName, ruliwebID, settingType, tempArray.length-1);
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