
import Utility from '../common/utility';
import StorageIO from '../common/storageIO';
import UserIO from './userIO';
import Sweetalert from 'sweetalert2';

const defaultOptionForm = {
	userList: [],
	userNameKeys: [],
	userIDKeys: [],
	keywordList: [],
	dislikeBlock: {
		flag: false,
		limit: 0
	}, // 비추천 차단
	prisonerBlock: false // 죄수 번호 차단
};

const optionPages = {
	'basic' : 1,
	'detail' : 2,
	'other': 3,
	'info': 4,
	'keyword': 5
}

const MAX_DISPLAY_USER_LIST = 30;

class Option
{
	static get defaultOptionForm() {
		return defaultOptionForm;
	}
	
	constructor() {
		StorageIO.getData().then( data => {  });
		this.nowMenuNumber = 0; // 현재 선택된 메뉴
		this.memoFlag = true;
		this.eventBind();
		
		// object bind
		this.eventBind = this.eventBind.bind(this);
		this.userDetailBind = this.userDetailBind.bind(this);
		this.otherOptionSceneBind = this.otherOptionSceneBind.bind(this);
		this.changeMenu = this.changeMenu.bind(this);
		this.deleteCell = this.deleteCell.bind(this);
		this.userOptionsAllChange = this.userOptionsAllChange.bind(this);
		this.restoreOptions = this.restoreOptions.bind(this);
	}

	getUserListPage(userList) {
		return userList.length % MAX_DISPLAY_USER_LIST > 0 ? 
						Math.floor((userList.length/MAX_DISPLAY_USER_LIST) + 1) : 
						Math.floor(userList.length/MAX_DISPLAY_USER_LIST);
	}
	
	eventBind() {
		$(document).on('click', '#addBadUser', () => {
			let aggroUserNameTextBox = document.getElementById('aggrohuman');
			let aggroUserIDTextBox = document.getElementById('aggrohumanID');
			let userMemoTextBox = document.getElementById('inUserMemo');
			let aggroUserName = aggroUserNameTextBox.value;
			let aggroUserID = aggroUserIDTextBox.value;
			let blockColor = document.getElementById('blockColor');
			let blockTypeValue = $('#blockTypeSelect').val();
			
			blockTypeValue = blockTypeValue === undefined ? 0 : blockTypeValue;
			// detail 옵션에서 blockType 선택하는 것이 없어서 대응
	
			if (aggroUserName.length > 0) {
				let addUserForm = {
					...UserIO.defaultUserForm,
          name: aggroUserName,
          ruliwebID: aggroUserID,
          settingType: blockTypeValue,
					settingColor: blockColor.value,
					userMemo: userMemoTextBox.value,
          addDate: Utility.getDate()
        };
	    	    
				UserIO.addUser(addUserForm)
				.then(() => {
					aggroUserNameTextBox.value = '';
					aggroUserIDTextBox.value = '';
					userMemoTextBox.value = '';

					this.restoreOptions();
					
					Utility.logPrint('#005CFF', '관리 유저 추가');
				})
				.catch( response => {
					Utility.logPrint('red', response.message);
				});
			} else {
				Utility.logPrint('red', '이름이 비어있음');	
			}
		});
		
		$(document).on('click', '#importBtn', () => {
			Sweetalert({
				title: '유저목록 불러오기',
				text: 'JSON파일만 지원합니다.',
				input: 'file',
				inputAttributes: {
					accept: 'json/*'
				}
			}).then((file) => {
				UserIO.importOption(file).then( (result)=> {
					this.restoreOptions();
					Utility.logPrint('#005CFF', `유저 추가완료(성공:${result.success}, 실패:${result.fail})`);
				});
			});
		});
		
		$(document).on('click', '#exportBtn', () => {
			/*
			<button class="swalBtn csv">
				<i class="fa fa-file"></i></br>
				CSV
			</button>
			*/
			Sweetalert({
				title: '다운로드할 파일 형식 선택',
				html: `
						<button class="swalBtn json">
							<i class="fa fa-file"></i></br>
							JSON
						</button>
						<button class="swalBtn oldjson">
							<i class="fa fa-file"></i></br>
							<label>구버전 이용자</label>
						</button>
					`
			});
		});
		
		/*$(document).on('click', '.swalBtn.csv', UserIO.exportCSV);*/
		$(document).on('click', '.swalBtn.json', UserIO.exportJson);
		$(document).on('click', '.swalBtn.oldjson', UserIO.exportOldJson);
	
		$('#menuItems li').click( e => {
			let clickMenuID = e.target.getAttribute('itemprop');
			$("#menuItems #selectedMenuItem").removeAttr('id');
			e.target.id = 'selectedMenuItem';
			this.changeMenu(clickMenuID);
		});
		
		this.keywordDetailBind();
		this.userDetailBind();
		this.otherOptionSceneBind();

		this.changeMenu(1);

		$('#menuItems li')[0].id = 'selectedMenuItem';
	}

	userDetailBind() {
		$(document).on('click', '.userDetail input[type="radio"]', event => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				let user = userList[userid];

				user.settingType = event.target.value;
				
				let setType = Utility.settingToStrConvert(parseInt(event.target.value));
				
				$('.select .userState').text(setType);
				
				if (parseInt(user.settingType) === 3)
					$('.select .userState').css('background', user.settingColor);
				else 
					$('.select .userState').css('background', 'none');
				
				StorageIO.saveUser(userList);
				
				Utility.logPrint('#005CFF', user.name + ' : ' + '옵션 변경');
			});
		});
		
		$(document).on('change', '.userDetail input[type="color"]', event => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				let user = userList[userid];

				user.settingColor = event.target.value;
				
				if (parseInt(user.settingType) === 3)
					$('.select .userState').css('background', event.target.value);
						
				StorageIO.saveUser(userList);
				
				Utility.logPrint('#005CFF', user.name + ' : ' + '색 변경');
			});
		});
		
		$(document).on('keyup', '.userDetail #userID', event =>{
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				let user = userList[userid];
				let inID = event.target.value;
				
				event.target.value = inID.replace(/[^0-9]/, "");
				
				user.ruliwebID = event.target.value;
				
				StorageIO.saveUser(userList);
			});
		});
		
		$(document).on('change', '.userDetail #userID', () => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				let user = userList[userid];

				$('.select .userID').text(user.ruliwebID);
				Utility.logPrint('#005CFF', user.name + ' : ' + 'ID 변경');
			});
		});
		
		$(document).on('keyup', '.userDetail #userMemo', event => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				
				userList[userid].userMemo = event.target.value;
				
				StorageIO.saveUser(userList);
			});
		});
		
		$(document).on('change', '.userDetail #userMemo', event => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				
				userList[userid].userMemo = event.target.value;
				
				StorageIO.saveUser(userList);
				
				Utility.logPrint('#005CFF', userList[userid].name + ' : ' + '유저 메모 추가');
			});
		});
		
		$(document).on('click', '.choiceBadUserOption ul.badUserList li', data => {
			let userid = data.currentTarget.getAttribute('itemprop');
			this.userChoice(data.currentTarget, userid);
		});
	}

	keywordDetailBind() {
		$(document).on('click', '#keywordDelete', event => {
			let id = $('.select').attr('itemprop');
			this.deleteKeyword(id);
		});

		$(document).on('click', '.keywordDetail input[type="radio"]', event => {
			StorageIO.getData().then( data => {
				let keywordList = data.keywordList;
				let id = $('.select').attr('itemprop');
				let keyword = keywordList[id];

				keyword.settingType = event.target.value;
				
				let setType = Utility.settingToStrConvert(parseInt(event.target.value));
				
				parseInt(keyword.settingType) === 3 ?
					$('.select').css('background', keyword.settingColor): 
					$('.select').removeAttr("style")
				
				StorageIO.saveKeyword(keywordList);
				
				Utility.logPrint('#005CFF', keyword.keyword + ' : ' + '옵션 변경');
			});
		});
		
		$(document).on('change', '.keywordDetail input[type="color"]', event => {
			StorageIO.getData().then( data => {
				let keywordList = data.keywordList;
				let id = $('.select').attr('itemprop');
				let keyword = keywordList[id];

				keyword.settingColor = event.target.value;
				
				if (parseInt(keyword.settingType) === 3)
					$('.select').css('background', event.target.value);
						
				StorageIO.saveKeyword(keywordList);
				
				Utility.logPrint('#005CFF', keyword.keyword + ' : ' + '색 변경');
			});
		});

		$(document).on('click', '#addKeyword', () => {
			let keywordTextBox = document.getElementById('keyword');
			let addKeyword = keywordTextBox.value;
			let blockColor = $('#blockColor').val();
			let blockTypeValue = $('#blockTypeSelect').val();

			blockTypeValue = blockTypeValue === undefined ? 0 : blockTypeValue;

			if (addKeyword.length > 0) {
				let addKeywordForm = {
					...UserIO.defaultKeywordForm,
					keyword: addKeyword,
					settingType: blockTypeValue,
					settingColor: blockColor,
					addDate: Utility.getDate()
				};
	    	    
				UserIO.addKeyword(addKeywordForm)
				.then(() => {
					keywordTextBox.value = '';

					this.restoreOptions();
					
					Utility.logPrint('#005CFF', '관리 유저 추가');
				})
				.catch( response => {
					Utility.logPrint('red', response.message);
				});
			} else {
				Utility.logPrint('red', '키워드가 비어있음');	
			}
		});

		$(document).on('click', '.keywordList li', data => {
			let userid = data.currentTarget.getAttribute('itemprop');
			this.keywordChoice(data.currentTarget, userid);
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
				let otherOption = {
						dislikeBlock: {
								flag: $('#dislikeBlock')[0].checked,
								limit: $('#dislikeLimit').val()
						},
						prisonerBlock: $('#prisonerBlock')[0].checked
				};
						
				StorageIO.setData( otherOption).then( () => {
          Sweetalert("완료", "저장하였습니다.", "success");
				});
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
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let blockColor = document.getElementById('blockColor');
				let blockTypeValue = $('#blockTypeSelect').val();
				
				for (let i=0; i<userList.length; i++) {
						userList[i].settingType = blockTypeValue;
						userList[i].settingColor = blockColor.value;
				}

				StorageIO.setData({'userList': userList}).then( () => {
						StorageIO.saveUser(userList);
						
						$('.badUserList').html('');
				
						this.restoreOptions();
						Utility.logPrint('#005CFF', '일괄처리 완료');
						Sweetalert("완료", "일괄 적용 완료", "success");
				});
			});
		});
	}//function restoreOptions - 옵션 저장

	showDetailSetting() {
		const blockgroup = $('.blockGroup');

		blockgroup.removeClass();
		blockgroup.addClass('blockGroup');
	}

	hiddenDetailSetting() {
		const blockgroup = $('.blockGroup');

		$('.choiceSetting .choiceUserName').text("선택해주세요");

		blockgroup.removeClass();
		blockgroup.addClass('blockGroup hidden');
	}
	
	userChoice(cellObj, userNumber) {
		StorageIO.getData().then( data => {
			let user = data.userList[userNumber];
			let radiobox = document.getElementsByName('blockTypeRadio');
			
			this.showDetailSetting();
			
			$('#userID')[0].value = '';
			
			$('.select').removeClass();
			$(cellObj).addClass('select');
			$('.choiceSetting .choiceUserName').text(user.name);
			$('#userID')[0].value = user.ruliwebID;
			$('#blockColor')[0].value = user.settingColor;
			$('#userMemo')[0].value = user.userMemo;
			
			let settingType = user.settingType;
			
			radiobox[settingType].checked = true;
		});
	}

	keywordChoice(cellObj, keywordNumber) {
		StorageIO.getData().then( data => {
			let keywordObj = data.keywordList[keywordNumber];
			let radiobox = document.getElementsByName('blockTypeRadio');
            
			let blockgroup = $('.blockGroup');

			blockgroup.removeClass();
			blockgroup.addClass('blockGroup');
			
			$('.select').removeClass();
			$(cellObj).addClass('select');
			$('.choiceSetting .choiceUserName').text(keywordObj.keyword);
			$('#blockColor')[0].value = keywordObj.settingColor;
			
			let settingType = keywordObj.settingType;
			
			radiobox[settingType].checked = true;
		});
	}
	
	changeMenu(menuNumber) {
		if (menuNumber != this.nowMenuNumber) {
			$('#content').load(`option_menu${menuNumber}.html`, () => {
				this.nowMenuNumber = menuNumber;
				
				this.memoFlag = parseInt(menuNumber) === 1 ? true : false;
				
				this.restoreOptions();
				
				switch (parseInt(menuNumber)) {
					case optionPages.basic: {
						document.querySelector('#allChangeBtn').addEventListener('click', this.userOptionsAllChange);
						document.querySelector('#resetBtn').addEventListener('click', this.optionReset);
						this.memoFlag = true;
						break;
					}
					case optionPages.detail: {
						this.memoFlag = false;
						break;
					}
					case optionPages.other: {
            StorageIO.getData().then( data => {
              $('#dislikeBlock')[0].checked = data.dislikeBlock.flag;
              $('#dislikeLimit').val(data.dislikeBlock.limit);
              $('#prisonerBlock')[0].checked = data.prisonerBlock;
            });
						break;
					}
					case optionPages.keyword: {
						
					}
				}//페이지 셋팅
			});
		}
	}//function changeMenu - 옵션메뉴 변경

	displayUserList(data, page) {
		let date = Utility.getDate();
		let userListDom = $('.badUserList');
    let controller = $('.userListController');
    let userListData = data['userList'];
		let pageUserListData = data['userList'].slice(MAX_DISPLAY_USER_LIST * page, MAX_DISPLAY_USER_LIST * (page + 1));

		if (userListDom.length <= 0) {
			return;
		}

    userListDom.text('');
    controller.text('');

		pageUserListData.map( (object, index) => {
			userListDom[0].innerHTML += this.userCellForm(object, (MAX_DISPLAY_USER_LIST * page) + index);
		});
		
		$('.overMemoArea').mouseover((event) => {
			StorageIO.getData().then( data => {
				let userList = data['userList'];
				let cellNum = event.target.closest('li').getAttribute('itemprop');
				let overUserMemo = $('#overUserMemo');

				let user = userList[cellNum];
				
				let memo = user.userMemo.length > 0 ? user.userMemo : '메모없음';
				
				let listScrollPos = $('.badUserList').scrollTop();
				
				$('#overUserMemo .memoText').text(memo);
				
				overUserMemo.removeClass('hidden');
				overUserMemo.css('top', event.target.offsetTop - listScrollPos + 5);
			});
		});

		$('.overMemoArea').mouseout((event) => {
			$('#overUserMemo').addClass('hidden');
		});
		
    $('.deleteCellBtn').click(this.deleteCell); // 삭제 버튼 이벤트
    
    controller.append(`<div class="userListPage"></div>`);
    let userListPage = this.getUserListPage(userListData);
    let userListPageDom = controller.find('.userListPage')[0];

    for (let i=0; i<userListPage; i++) {
      $(userListPageDom).append(`<button class="page${i===page ? " seleted" : ""}">${i+1}</button>`);
      let btn = $(userListPageDom).find(".page")[i];
      $(btn).click(()=> {
        this.displayUserList(data, i);
      });
    }

		controller.append(`<div class="totalUser">총 ${userListData.length}명 관리중</div>`);
	}

	displayKeywordList(data) {
		let date = Utility.getDate();
		let keywordList = $('.keywordList');
		let keywordListData = data['keywordList'];
		let footer = $('.itemFooter');

		keywordList.text('');

		if (keywordListData == undefined || keywordList.length <= 0) {
			return;
		} // keywordListData == undefined => 구버전 사용자 예외처리

		keywordListData.map( (object, index) => {
			keywordList[0].innerHTML += this.keywordCellForm(object, index);
		});
	}
	
	restoreOptions() {
		StorageIO.getData().then( data => {
			if (Object.keys(data).length === 0) {
				data = Object.assign(Option.defaultOptionForm);
				StorageIO.setData(data, () => {
						Utility.logPrint('#005CFF', '[최초 실행] 데이터를 구성하였습니다.');
				});
				footer.text('총 0명 관리중');
				// 최초 실행
			} else {
				this.displayUserList(data, this.getUserListPage(data.userList)-1);
				this.displayKeywordList(data);
			}
		});
	}//function restoreOptions - 페이지 로드

	userCellForm(celldata, index) {
		let settingTypeStr = Utility.settingToStrConvert(parseInt(celldata.settingType));
		// { id, date, name, ruliwebID, settingType, cellNumber }
		let memo = this.memoFlag ? '<div class="overMemoArea"> ▶ </div>' : '';
		
		let stateStyle = parseInt(celldata.settingType) === 3 ? `style="background:${celldata.settingColor}"` : '';
		
		return (
		`<li itemprop="${index}">
			<div class="cellContent">
				<div class="cellState">
					<p class="date">${celldata.addDate}</p>
					<p class="userState" ${stateStyle}>${settingTypeStr}</p>
				</div>
				<div class="badUserName">
					<p class="userName">${celldata.name}</p>
					<p class="userID">${celldata.ruliwebID}</p>
				</div>
				<button class="deleteCellBtn">삭제</button>
			</div>
			${memo}
		</li>`);
	}

	keywordCellForm(celldata, index) {
		let stateStyle = parseInt(celldata.settingType) === 3 ? `style="background:${celldata.settingColor}"` : '';

		return `
			<li itemprop="${index}" ${stateStyle}>
				${celldata.keyword}
			</li>
		`;
	}
	
	optionReset() {
		Sweetalert({
			title: "초기화",
			html: "정말 옵션을 초기화 하시겠습니까?</br>(추가하신 모든 리스트및 기타 옵션이 사라집니다.)",
			type: 'warning',
			confirmButtonText: "초기화",
			cancelButtonText: "취소",
			showCancelButton: true,
			closeOnConfirm: false
		}).then(() => {
			let aggroUserName  = document.getElementById('aggrohuman');
			let radiobox       = document.getElementsByName('blockTypeRadio');
			let badUserList    = $('.badUserList');
			let footer = $('.footer');
			
			badUserList[0].innerHTML = '';
			aggroUserName.value      = '';
			footer.text('총 0명 관리중');
            
      StorageIO.setData(Object.assign(Option.defaultOptionForm))
			.then( () => {
        Utility.logPrint('#005CFF', '옵션 초기화 완료');
			
        Sweetalert("완료", "옵션 초기화 완료", "success");
      });
		});
	}//function optionReset - 옵션 초기화

	deleteKeyword(keywordIndex) {
		StorageIO.getData().then(data => {
			let keywordList = data.keywordList;
		
			keywordList.splice(keywordIndex, 1);
			
			StorageIO.saveKeyword(keywordList).then(() => {
				Utility.logPrint('#005CFF', '키워드 삭제 완료');

				this.hiddenDetailSetting();
				this.restoreOptions();
			});
		});
	}
	
	deleteCell(event) {
		const deleteCellNumber = event.currentTarget.closest('li').getAttribute('itemprop');
    StorageIO.getData().then(data => {
			let userList = data.userList;
		
			userList.splice(deleteCellNumber, 1);
			
			StorageIO.saveUser(userList).then(() => {
				Utility.logPrint('#005CFF', '셀 삭제 완료');

				this.hiddenDetailSetting();
				this.restoreOptions();
			});
		});
	}
}

window.onload = function () {
	let option = new Option;
	window.ruliwebSupportOption = option;
}

export default Option;
