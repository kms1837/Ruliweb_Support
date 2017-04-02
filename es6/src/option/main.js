
import Utility from '../common/utility';
import UserIO from './userIO';
import Sweetalert from 'sweetalert2';

const defaultOptionForm = {
	userList: [],
	userNameKeys: [],
	userIDKeys: [],
	dislikeBlock: {
		flag: false,
		limit: 0
	}, // 비추천 차단
	prisonerBlock: false // 죄수 번호 차단
};

class Option
{
	static get defaultOptionForm() {
		return defaultOptionForm;
	}
	
	constructor() {
		this.nowMenuNumber = 0; //현재 선택된 메뉴
		this.memoFlag = true;
		this.eventBind();
		
		// object bind
		this.eventBind = this.eventBind.bind(this);
		this.detailOptionSceneBind = this.detailOptionSceneBind.bind(this);
		this.otherOptionSceneBind = this.otherOptionSceneBind.bind(this);
		this.changeMenu = this.changeMenu.bind(this);
		this.deleteCell = this.deleteCell.bind(this);
		this.userOptionsAllChange = this.userOptionsAllChange.bind(this);
		this.restoreOptions = this.restoreOptions.bind(this);
	}
	
	eventBind() {
		$(document).on('click', '#addBadUser', () => {
			let aggroUserNameTextBox = document.getElementById('aggrohuman');
			let aggroUserIDTextBox = document.getElementById('aggrohumanID');
			let aggroUserName = aggroUserNameTextBox.value;
			let aggroUserID = aggroUserIDTextBox.value;
			let blockColor = document.getElementById('blockColor');
			let blockTypeValue = $('#blockTypeSelect').val();
			
			blockTypeValue = blockTypeValue === undefined ? 0 : blockTypeValue;
			// detail 옵션에서 blockType 선택하는 것이 없어서 대응
	
			if (aggroUserName.length > 0) {
				let addUserForm = Object.assign(UserIO.defaultUserForm, {
	    	        name: aggroUserName,
	    	        ruliwebID: aggroUserID,
	    	        settingType: blockTypeValue,
					settingColor: blockColor.value,
	    	        addDate: Utility.getDate()
	    	    });
	    	    
				UserIO.addUser(addUserForm, userData => {
					aggroUserNameTextBox.value = '';
					aggroUserIDTextBox.value = '';
					
					this.addCell(userData);
					this.restoreOptions();
					
					Utility.logPrint('#005CFF', '어그로 유저 추가');
				});
			} else {
				Utility.logPrint('red', '이름이 비어있음');	
			}
		});
		
		$(document).on('click', '#importBtn', () => {
			Sweetalert({
				title: '파일 선택',
				text: '파일 선택 ㅎㅎ <input type="file" id="importOption"></input>',
				input: 'file',
				cancelButtonText: '취소',
				showCancelButton: true,
				html: true
			}).then(() => {
				
			});
			//UserIO.importOption
		});
		$(document).on('click', '#importOptionBtn', UserIO.exportOption);
	
		$('#left_menu ul li').click( e => {
			let clickMenuID = e.target.getAttribute('itemprop');
			this.changeMenu(clickMenuID);
		});
		
		this.detailOptionSceneBind();
		this.otherOptionSceneBind();

		this.changeMenu(1);
	}
	
	detailOptionSceneBind() {
		$(document).on('click', '.choiceSetting input[type="radio"]', data => {
			let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
			let userid = $('.select').attr('itemprop');
			
			aggrohuman[userid].settingType = data.target.value;
			Utility.saveUser(aggrohuman);
			
			let setType = Utility.settingToStrConvert(parseInt(data.target.value));
			
			$('.select .userState').text(setType);
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
		});
		
		$(document).on('change', '.choiceSetting input[type="color"]', data => {
			let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
			let userid = $('.select').attr('itemprop');
	
			aggrohuman[userid].settingColor = data.target.value;
			Utility.saveUser(aggrohuman);
	
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
		});
		
		$(document).on('keyup', '.choiceSetting #userID', data =>{
			let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
			let userid = $('.select').attr('itemprop');
			let inID = data.target.value;
			data.target.value = inID.replace(/[^0-9]/, "");
			
			aggrohuman[userid].ruliwebID = data.target.value;
			
			Utility.saveUser(aggrohuman);
		});
		
		$(document).on('change', '.choiceSetting #userID', () => {
			let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
			let userid = $('.select').attr('itemprop');
			
			$('.select .userID').text(aggrohuman[userid].ruliwebID);
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + 'ID 변경');
		});
		
		$(document).on('keyup', '.choiceSetting #userMemo', data => {
			let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
			let userid = $('.select').attr('itemprop');
			
			aggrohuman[userid].userMemo = data.target.value;
			
			Utility.saveUser(aggrohuman);
		});
		
		$(document).on('change', '.choiceSetting #userMemo', data => {
			let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
			let userid = $('.select').attr('itemprop');
			
			aggrohuman[userid].userMemo = data.target.value;
			
			Utility.saveUser(aggrohuman);
			
			Utility.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '유저 메모 추가');
		});
		
		$(document).on('click', '.choiceBadUserOption ul.badUserList li', data => {
			let userid = data.currentTarget.getAttribute('itemprop');
			this.userChoice(data.currentTarget, userid);
		});
	}
	
	otherOptionSceneBind() {
		$(document).on('click', '.otherOption #saveBtn', data => {
			Sweetalert({
				title: "저장",
				text: "이 옵션을 저장 하시겠습니까?",
				type: "info",
				confirmButtonText: "저장",
				cancelButtonText: "취소",
				showCancelButton: true,
				closeOnConfirm: false
			}).then(() => {
				let originOption = JSON.parse(localStorage['ruliweb-support']);
				
				originOption['dislikeBlock']['flag'] = $('#dislikeBlock')[0].checked;
				originOption['dislikeBlock']['limit'] = $('#dislikeLimit').val();
				originOption['prisonerBlock'] = $('#prisonerBlock')[0].checked;
				
				localStorage['ruliweb-support'] = JSON.stringify(originOption);
				
				Sweetalert("완료", "저장하였습니다.", "success");
			});
		});
	}
	
	userOptionsAllChange() {
		Sweetalert({
			title: "일괄 적용",
			text: "정말 일괄로 적용하겠습니까?",
			type: "warning",
			confirmButtonText: "일괄 적용",
			cancelButtonText: "취소",
			showCancelButton: true,
			closeOnConfirm: false
		}).then(() => {
			let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
			let blockColor = document.getElementById('blockColor');
			let blockTypeValue = $('#blockTypeSelect').val();
			
			for (let i=0; i<aggrohuman.length; i++) {
				aggrohuman[i].settingType = blockTypeValue;
				aggrohuman[i].settingColor = blockColor.value;
			}
			
			Utility.saveUser(aggrohuman);
			
			$('.badUserList').html('');
		
			this.restoreOptions();
			Utility.logPrint('#005CFF', '일괄처리 완료');
			Sweetalert("완료", "일괄 적용 완료", "success");
		});
	}//function restoreOptions - 옵션 저장
	
	userChoice(cellObj, userNumber) {
		let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
		let radiobox = document.getElementsByName('blockTypeRadio');
		
		let blockgroup = $('.blockGroup');
		
		blockgroup.removeClass();
		blockgroup.addClass('blockGroup');
		
		$('#userID')[0].value = '';
		
		$('.select').removeClass();
		$(cellObj).addClass('select');
		$('.choiceSetting .choiceUserName').text(aggrohuman[userNumber].name);
		$('#userID')[0].value = aggrohuman[userNumber].ruliwebID;
		$('#blockColor')[0].value = aggrohuman[userNumber].settingColor;
		$('#userMemo')[0].value = aggrohuman[userNumber].userMemo;
		
		let settingType = aggrohuman[userNumber].settingType;
		
		radiobox[settingType].checked = true;
	}
	
	changeMenu(menuNumber) {
		if (menuNumber != this.nowMenuNumber) {
			$('#content').load(`option_menu${menuNumber}.html`, () => {
				$("#left_menu #selectedMenuItem").removeAttr('id');
				$("#left_menu li")[menuNumber-1].id = 'selectedMenuItem';
				
				this.nowMenuNumber = menuNumber;
				
				this.memoFlag = parseInt(menuNumber) === 1 ? true : false;
				
				if (this.nowMenuNumber <= 2) this.restoreOptions();

				switch (parseInt(menuNumber)) {
					case 1: {
						document.querySelector('#allChangeBtn').addEventListener('click', this.userOptionsAllChange);
						document.querySelector('#resetBtn').addEventListener('click', this.optionReset);
						this.memoFlag = true;
						break;
					}
					case 2: {
						this.memoFlag = false;
						break;
					}
					case 3: {
						let option = JSON.parse(localStorage['ruliweb-support']);
						if (option != undefined) {
							$('#dislikeBlock')[0].checked = option.dislikeBlock.flag;
							$('#dislikeLimit').val(option.dislikeBlock.limit);
							$('#prisonerBlock')[0].checked = option.prisonerBlock;
						}
						break;
					}
				}//페이지 셋팅
			});
		}
	}//function changeMenu - 옵션메뉴 변경
	
	restoreOptions() {
		let userList = $('.badUserList');
		let data = localStorage['ruliweb-support']; //어그로 목록
		
		userList[0].innerHTML = '';
		
		if (data === undefined) {
			data = Object.assign(Option.defaultOptionForm);
			localStorage['ruliweb-support'] = JSON.stringify(data);
			Utility.logPrint('#005CFF', '[최초 실행] 데이터를 구성하였습니다.');
			// 최초 실행
		} else {
			let date        = Utility.getDate();
			let aggrohuman  = JSON.parse(data).userList;
	
			for(let i=0; i<aggrohuman.length; i++)
				this.addCell(aggrohuman[i]);
				
			$('.badUserList li').each( (index, li) => {
				$(li).attr('itemprop', index);
			});
			
			$('.overMemoArea').mouseover((event) => {
				let aggrohuman = JSON.parse(localStorage['ruliweb-support']).userList;
				let cellNum = event.target.closest('li').getAttribute('itemprop');
				let overUserMemo = $('#overUserMemo');
				
				let memo = aggrohuman[cellNum].userMemo.length > 0 ? aggrohuman[cellNum].userMemo : '메모없음';
				
				$('#overUserMemo .memoText').text(memo);
				
				overUserMemo.removeClass('hidden');
				overUserMemo.css('top', event.target.offsetTop + 5);
			});
			
			$('.overMemoArea').mouseout((event) => {
				$('#overUserMemo').addClass('hidden');
			});
			
			$('.deleteCellBtn').click(this.deleteCell); //삭제 버튼 이벤트
		}
	}//function restoreOptions - 페이지 로드
	
	addCell(celldata) {
		let userList = $('.badUserList');
		userList[0].innerHTML += this.userCellForm(celldata);
	}//function addCell - 리스트 셀 형식

	userCellForm(celldata) {
		let settingTypeStr = Utility.settingToStrConvert(parseInt(celldata.settingType));
		// { id, date, name, ruliwebID, settingType, cellNumber }
		let memo = this.memoFlag ? '<div class="overMemoArea"> ▶ </div>' : '';
		
		let index = 0;
		
		return	`<li>
					<div class="cellContent">
			  			<div class="cellState">
				    		<p class="date">${celldata.addDate}</p>
				    		<p class="userState">${settingTypeStr}</p>
				    	</div>
				    	<div class="badUserName">
				    		<p class="userName">${celldata.name}</p>
				    		<p class="userID">${celldata.ruliwebID}</p>
				    	</div>
			    		<button class="deleteCellBtn">삭제</button>
		    		</div>
		    		${memo}
			      </li>`;
	}
	
	optionReset() {
		Sweetalert({
			title: "초기화",
			text: "정말 옵션을 초기화 하시겠습니까? (추가하신 모든 리스트가 사라집니다.)",
			type: 'warning',
			confirmButtonText: "초기화",
			cancelButtonText: "취소",
			showCancelButton: true,
			closeOnConfirm: false
		}).then(() => {
			let aggroUserName  = document.getElementById('aggrohuman');
			let radiobox       = document.getElementsByName('blockTypeRadio');
			let badUserList    = $('.badUserList');
			
			delete localStorage['ruliweb-support'];
			
			badUserList[0].innerHTML = '';
			aggroUserName.value      = '';
			Utility.logPrint('#005CFF', '옵션 초기화 완료');
			
			Sweetalert("완료", "옵션 초기화 완료", "success");
		});
	}//function optionReset - 옵션 초기화
	
	deleteCell(data) {
		let deleteCellNumber = data.currentTarget.closest('li').getAttribute('itemprop');
		let aggrohumanJson = JSON.parse(localStorage['ruliweb-support']);
		let aggrohumanList = aggrohumanJson.userList;
		
		aggrohumanList.splice(deleteCellNumber, 1);
		aggrohumanJson.userList = aggrohumanList;
		
		Utility.saveUser(aggrohumanJson.userList);
		Utility.logPrint('#005CFF', '셀 삭제 완료');
		
		this.restoreOptions();
	}
}

window.onload = function () {
	let option = new Option;
	window.ruliwebSupportOption = option;
}

export default Option;