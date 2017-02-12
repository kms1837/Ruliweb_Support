
import Utility from '../common/utility';
import UserIO from './userIO';

class Option
{
	constructor() {
		this.nowMenuNumber = 0; //현재 선택된 메뉴
		this.eventBind();
		
		this.eventBind = this.eventBind.bind(this);
		this.changeMenu = this.changeMenu.bind(this);
	}
	
	eventBind() {
		console.log(JSON.parse(localStorage['aggrohuman']));
		$(document).on('click', '#addBadUser', () => {
			let aggroUserNameTextBox = document.getElementById('aggrohuman');
			let aggroUserName = aggroUserNameTextBox.value;
			
			UserIO.addUser(aggroUserName, undefined, userData => {
				let userList = $('.badUserList');
				//userList[0].innerHTML  += this.addCell(0, Utility.getDate(), aggroUserName, '', 0, 0);
				userList[0].innerHTML  += this.addCell(userData);
		    	Utility.logPrint('#005CFF', '어그로 유저 추가');
		    	
		    	/*
				badUserList[0].innerHTML  += this.addCell(aggrohumanJson.userCellInfo.length - 1,
														addDate, 
														aggroUserName, 
														'',
														settingType,
														aggrohumanList.length-1);
				Utility.logPrint('#005CFF', '어그로 유저 추가');
                */
		    	
				aggroUserNameTextBox.value = '';
				$('.deleteCellBtn').click(this.deleteCell); //삭제 버튼 이벤트
			});
		});
		
		$(document).on('change', '#importOption', UserIO.importOption);
		
		$(document).on('click', '.choiceSetting input[type="radio"]', (data) => {
			let aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
			let userid = $('.select').attr('userid');
			
			aggrohuman[userid].settingType = data.target.value;
			Utility.saveJson(aggrohuman);
			
			let setType = this.settingToStrConvert(parseInt(data.target.value));
			
			$('.select .userState').text(setType);
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
		});
	
		$(document).on('change', '.choiceSetting input[type="color"]', (data) => {
			let aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
			let userid = $('.select').attr('userid');
	
			aggrohuman[userid].settingColor = data.target.value;
			Utility.saveJson(aggrohuman);
	
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
		});
		
		$(document).on('keyup', '.choiceSetting #userID', (data) =>{
			let aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
			let userid = $('.select').attr('userid');
			let inID = data.target.value;
			data.target.value = inID.replace(/[^0-9]/, "");
			
			aggrohuman[userid].ruliwebID = data.target.value;
			
			Utility.saveJson(aggrohuman);
		});
		
		$(document).on('change', '.choiceSetting #userID', () => {
			let aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
			let userid = $('.select').attr('userid');
			
			$('.select .userID').text(aggrohuman[userid].ruliwebID);
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + 'ID 변경');
		});
		
		$(document).on('keyup', '.choiceSetting #userMemo', (data) => {
			let aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
			let userid = $('.select').attr('userid');
			let inID = data.target.value;
			
			aggrohuman[userid].user_memo = data.target.value;
			
			Utility.saveJson(aggrohuman);
		});
		
		$(document).on('change', '.choiceSetting #userMemo', () => {
			let aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
			let userid = $('.select').attr('userid');
			
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '유저 메모 추가');
		});
		
		$(document).on('click', '.choiceBadUserOption ul.badUserList li', (data) => {
			let userid = $(data.currentTarget).attr('userid');
			this.userChoice(data.currentTarget, userid);
		});
		
		$('#left_menu ul li').click((e) => {
			let clickMenuID = e.target.getAttribute('itemprop');
			this.changeMenu(clickMenuID);
		});

		this.changeMenu(1);
	}
	
	userOptionsAllChange()
	{
		let allSwitch = confirm("정말 일괄로 적용하겠습니까?");
		
		if (allSwitch) {
			let aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
			let blockTypeCheck = document.getElementsByName('blockTypeRadio');
			let blockColor = document.getElementById('blockColor');
			let blockTypeValue;
	
			for (let i=0; i<blockTypeCheck.length; i++) {
				if (blockTypeCheck[i].checked === true) blockTypeValue = blockTypeCheck[i].value;
			}
			
			for (let i=0; i<aggrohuman.length; i++) {
				aggrohuman[i].settingType = blockTypeValue;
				aggrohuman[i].settingColor = blockColor.value;
			}
			
			Utility.saveJson(aggrohuman);
		}
		
		$('.badUserList').html('');
		
		this.restoreOptions();
		Utility.logPrint('#005CFF', '일괄처리 완료');
	}//function restoreOptions - 옵션 저장
	
	userChoice(cellObj, userNumber)
	{
		let aggrohuman  = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		let radiobox	= document.getElementsByName('blockTypeRadio');
		
		let blockgroup = $('.blockGroup');
		
		blockgroup.removeClass();
		blockgroup.addClass('blockGroup');
		
		$('#userID')[0].value = '';
		
		$('.select').removeClass();
		$(cellObj).addClass('select');
		$('.choiceSetting .choiceUserName').text(aggrohuman[userNumber].name);
		$('#userID')[0].value = aggrohuman[userNumber].ruliwebID;
		$('#blockColor')[0].value = aggrohuman[userNumber].settingColor;
		$('#userMemo')[0].value = aggrohuman[userNumber].user_memo;
		
		let settingType = aggrohuman[userNumber].settingType;
		
		radiobox[settingType].checked = true;
	}
	
	changeMenu(menuNumber)
	{
		if (menuNumber != this.nowMenuNumber) {
			$('#content').load(`option_menu${menuNumber}.html`, () => {
				let menuList = $("#left_menu li");
				
				for (let i=1; i<=menuList.length; i++) {
					let selectorName = '#menu' + i;
					
					if (i != menuNumber) menuList[i-1].id = 'menu' + i;
					else				 menuList[i-1].id = 'selectedMenuItem';
				}
				
				this.nowMenuNumber = menuNumber;
				
				if (this.nowMenuNumber!=3) this.restoreOptions();
				
				switch (menuNumber) {
					case 1:
						document.querySelector('#save').addEventListener('click', this.userOptionsAllChange);
						document.querySelector('#reset').addEventListener('click', this.optionReset);
						break;
					case 3:
						document.querySelector('#export_option').addEventListener('click', UserIO.exportOption);
						break;
				}//페이지 셋팅
			});
		}
	}//function changeMenu - 옵션메뉴 변경
	
	restoreOptions()
	{
		let aggrohuman = localStorage['aggrohuman']; //어그로 목록
		
		if (aggrohuman != undefined) {
			let badUserList = $('.badUserList');
			let date        = Utility.getDate();
			let aggrohuman  = JSON.parse(localStorage['aggrohuman']).userCellInfo;
	
			for(let i=0; i<aggrohuman.length; i++){
				badUserList[0].innerHTML += this.addCell(i, aggrohuman[i].addDate, aggrohuman[i].name, aggrohuman[i].ruliwebID, aggrohuman[i].settingType, i);
			}
		
			$('.deleteCellBtn').click(this.deleteCell); //삭제 버튼 이벤트
		}
	}//function restoreOptions - 페이지 로드
	
	optionReset()
	{
		let resetSwitch = confirm("정말 옵션을 초기화 하시겠습니까? (추가하신 모든 리스트가 사라집니다.)");
		
		if (resetSwitch) {
			let aggroUserName  = document.getElementById('aggrohuman');
			let radiobox       = document.getElementsByName('blockTypeRadio');
			let badUserList    = $('.badUserList');
			
			delete localStorage['aggrohuman'];
			
			badUserList[0].innerHTML = '';
			radiobox[0].checked      = true;
			aggroUserName.value      = '';
			Utility.logPrint('#005CFF', '옵션 초기화 완료');
		}
	}//function optionReset - 옵션 초기화
	
	addCell(celldata)
	{
		// { id, date, name, ruliwebID, settingType, cellNumber }
		let settingTypeStr = Utility.settingToStrConvert(parseInt(celldata.settingType));
		
		return	`<li userid=${celldata.ruliwebID}>
		  			<div class="cellState">
			    		<p class="date">${celldata.addDate}</p>
			    		<p class="userState">${settingTypeStr}</p>
			    	</div>
			    	<div class="badUserName">
			    		<p class="userName">${celldata.name}</p>
			    		<p class="userID">${celldata.ruliwebID}</p>
			    	</div>
			    	<button class="deleteCellBtn">삭제</button>
			      </li>`;
	}//function addCell - 리스트 셀 형식
	
	deleteCell(data)
	{
		let deleteCellNumber = data.currentTarget.value;
		let aggrohumanJson   = JSON.parse(localStorage['aggrohuman']);
		let aggrohumanList   = aggrohumanJson.userCellInfo;
		let badUserList      = $('.badUserList');
		let tempArray = [];
		
		badUserList[0].innerHTML = '';
		
		for (let i=0; i<aggrohumanList.length; i++) {
			if (i!=deleteCellNumber) {
			  let aggroUserName = aggrohumanList[i].name;
			  let date          = aggrohumanList[i].addDate;
			  let settingType	= aggrohumanList[i].settingType;
			  let ruliwebID		= aggrohumanList[i].ruliwebID;
			  tempArray.push(aggrohumanList[i]);
			  badUserList[0].innerHTML += this.addCell(i, date, aggroUserName, ruliwebID, settingType, tempArray.length-1);
			}
		}
		
		if (tempArray.length!=0) $('.deleteCellBtn').click(this.deleteCell); //삭제 버튼 이벤트
		
		aggrohumanJson.userCellInfo = tempArray;
		Utility.saveJson(aggrohumanJson.userCellInfo);
		
		Utility.logPrint('#005CFF', '셀 삭제 완료');
	}
}

window.onload = function() {
	let option = new Option;
	window.ruliwebSupportOption = option;
}