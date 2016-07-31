var nowMenuNumber; //현재 선택된 메뉴

$(function() {
	$(document).on('click', '#addBadUser', function() {
		var aggroUserNameTextBox = document.getElementById('aggrohuman');
		var aggroUserName = aggroUserNameTextBox.value;
		if(addUser(aggroUserName)) {
			aggroUserNameTextBox.value = '';
			$('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
		}
	});
	$(document).on('change', '#importOption', importOption);
	$(document).on('click', '.choiceSetting input[type="radio"]', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		
		aggrohuman[userid].settingType = data.target.value;
		save_json(aggrohuman);
		
		var setType = settingToStrConvert(parseInt(data.target.value));
		
		$('.select .userState').text(setType);
		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
	});

	$(document).on('change', '.choiceSetting input[type="color"]', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');

		aggrohuman[userid].settingColor = data.target.value;
		save_json(aggrohuman);

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
	
	$(document).on('click', '.choiceBadUserOption ul.badUserList li', function(data) {
		var userid = $(data.currentTarget).attr('userid');
		userChoice(data.currentTarget, userid);
	});
});

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
		var blockTypeCheck 	= document.getElementsByName('blockTypeRadio');
		var blockColor			= document.getElementById('blockColor');
		var blockTypeValue;

		for(var i=0; i<blockTypeCheck.length; i++) {
			if(blockTypeCheck[i].checked === true) blockTypeValue = blockTypeCheck[i].value;
		}
		
		for(var i=0; i<aggrohuman.length; i++) {
			aggrohuman[i].settingType  = blockTypeValue;
			aggrohuman[i].settingColor = blockColor.value;
		}
		
		save_json(aggrohuman);
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
	$('#blockColor')[0].value = aggrohuman[userNumber].settingColor;
	$('#userMemo')[0].value = aggrohuman[userNumber].user_memo;
	
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
					document.querySelector('#save').addEventListener('click', userOptionsAllChange);
					document.querySelector('#reset').addEventListener('click', optionReset);
					break;
				case 3:
					document.querySelector('#export_option').addEventListener('click', exportOption);
					break;
			}//페이지 셋팅
		});
	}
}//function changeMenu - 옵션메뉴 변경

function restore_options()
{
	var aggrohuman = localStorage['aggrohuman']; //어그로 목록
	
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
}//function restore_options - 페이지 로드

function optionReset()
{
	var resetSwitch = confirm("정말 옵션을 초기화 하시겠습니까? (추가하신 모든 리스트가 사라집니다.)");
	if (resetSwitch) {
		var aggroUserName  = document.getElementById('aggrohuman');
		var radiobox       = document.getElementsByName('blockTypeRadio');
		var badUserList    = $('.badUserList');
		
		delete localStorage['aggrohuman'];
		
		badUserList[0].innerHTML = '';
		radiobox[0].checked      = true;
		aggroUserName.value      = '';
		logPrint('#005CFF', '옵션 초기화 완료');
	}
}//function optionReset - 옵션 초기화

function importOption(event)
{
	var optionFile = event.target.files[0];
	var reader = new FileReader();

	reader.onload = (function(file) {
		try {
			var userData = JSON.parse(file.target.result);
			$(userData).each(function(index, object) {
				addUser(object.name, object);
			});
			logPrint('#005CFF', '유저 추가');
		} catch(err) {
			logPrint('red', '파일내용을 확인해 주세요');
		}
	});

	reader.readAsText(optionFile);
}

function exportOption()
{
	var result = JSON.parse(localStorage['aggrohuman']);
	var url = 'data:application/json;base64,' + btoa(JSON.stringify(result.userCellInfo));
	chrome.downloads.download({
		url : url,
		filename : 'test.json'
	});
}

function addUser(aggroUserName, form)
{
	var badUserList   = $('.badUserList');
	
	var defaultUserForm = {
	  ruliwebID: '', 
	  user_memo: '', 
	  settingType: 0, 
	  settingColor: '#ffffff'
	};
  
	if (aggroUserName != '') {
	    if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {

	    	if (form === undefined) {
	    		defaultUserForm.addDate = getDate();
	    		defaultUserForm.name	= aggroUserName;
	    		save_json([defaultUserForm]);
	    	} else {
	    		save_json([form]);
	    	}
	    	
	    	badUserList[0].innerHTML  += addCell(0, getDate(), aggroUserName, '', 0, 0);
	    	logPrint('#005CFF', '어그로 유저 추가');
	    	// 최초 추가

	    	return true;

	    } else {
	   		var aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
	     	var addSwitch      = true;
	     	var aggrohumanList = aggrohumanJson.userCellInfo;
	
			for (var i=0; i<aggrohumanList.length; i++){
				if (aggrohumanList[i].name == aggroUserName){
					addSwitch = false;
					logPrint('red', '리스트에 이미 존재함');

					return false;
				}
			}//for - 중복체크
	
	    	if (addSwitch) {
	    		var addDate;
	    		var settingType;
	    		if (form === undefined) {
	    			addDate = getDate();
	    			settingType = 0;
					defaultUserForm.addDate = addDate;
					defaultUserForm.name = aggroUserName;
					
					aggrohumanJson.userCellInfo.push(defaultUserForm);
				} else {
					addDate = form.addDate;
					settingType = form.settingType;
					aggrohumanJson.userCellInfo.push(form);
				}

				save_json(aggrohumanJson.userCellInfo);
				
				badUserList[0].innerHTML  += addCell(aggrohumanJson.userCellInfo.length - 1,
													addDate, 
													aggroUserName, 
													'',
													settingType,
													aggrohumanList.length-1);
				logPrint('#005CFF', '어그로 유저 추가');

				return true;
			}
		}
	} else {
		logPrint('red', '이름이 비어있음');
	}

	return false;
}

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
	
	return	 '<li userid=' + id + '>'   +
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
		  var settingType	= aggrohumanList[i].settingType;
		  var ruliwebID		= aggrohumanList[i].ruliwebID;
		  tempArray.push(aggrohumanList[i]);
		  badUserList[0].innerHTML += addCell(i, date, aggroUserName, ruliwebID, settingType, tempArray.length-1);
		}
	}
	
	if(tempArray.length!=0)$('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
	
	aggrohumanJson.userCellInfo = tempArray;
	save_json(aggrohumanJson.userCellInfo);
	
	logPrint('#005CFF', '셀 삭제 완료');
}
