import UserIO from './userIO';
import Option from './main'

class EventBinder
{
  static eventBind() {
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

					Option.restoreOptions();
					
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
					Option.restoreOptions();
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
			Option.changeMenu(clickMenuID);
		});
		
		this.keywordDetailBind();
		this.userDetailBind();
		this.otherOptionSceneBind();

		Option.changeMenu(1);

		$('#menuItems li')[0].id = 'selectedMenuItem';
  }
  
	static userDetailBind() {
		$(document).on('click', '.choiceSetting input[type="radio"]', event => {
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
		
		$(document).on('change', '.choiceSetting input[type="color"]', event => {
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
		
		$(document).on('keyup', '.choiceSetting #userID', event =>{
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
		
		$(document).on('change', '.choiceSetting #userID', () => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				let user = userList[userid];

				$('.select .userID').text(user.ruliwebID);
				Utility.logPrint('#005CFF', user.name + ' : ' + 'ID 변경');
			});
		});
		
		$(document).on('keyup', '.choiceSetting #userMemo', event => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let userid = $('.select').attr('itemprop');
				
				userList[userid].userMemo = event.target.value;
				
				StorageIO.saveUser(userList);
			});
		});
		
		$(document).on('change', '.choiceSetting #userMemo', event => {
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
			Option.userChoice(data.currentTarget, userid);
		});
	}

	static keywordDetailBind() {
		$(document).on('click', '#keywordDelete', () => {
		});
		$(document).on('click', '#addKeyword', () => {
			let keywordTextBox = document.getElementById('keyword');
			let addKeyword = keywordTextBox.value;
			let blockColor = $('#blockColor').val();
			let blockTypeValue = $('#blockTypeSelect').val();

			blockTypeValue = blockTypeValue === undefined ? 0 : blockTypeValue;

			if (addKeyword.length > 0) {
				console.log(UserIO.defaultKeywordForm);
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

					Option.restoreOptions();
					
					Utility.logPrint('#005CFF', '관리 유저 추가');
				})
				.catch( response => {
					Utility.logPrint('red', response.message);
				});
			} else {
				Utility.logPrint('red', '키워드가 비어있음');	
			}
		});

		$(document).on('click', '.choiceBadUserOption ul.keywordList li', data => {
			let userid = data.currentTarget.getAttribute('itemprop');
			Option.keywordChoice(data.currentTarget, userid);
		});
	}
	
	static otherOptionSceneBind() {
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
}

export default EventBinder;