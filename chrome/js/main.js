var background = chrome.extension.getBackgroundPage();
var userInfo;
var contextFlag = false;

function messageProcess(request, sender, sendResponse)
{
	switch (request.type) {
		case 'context': 
			context(request);
			break;
		case 'count': 
			count(request);
			break;
		default:
			break;
	}
}

function count(inForm) {
	
}

function context(inForm) {
	if (inForm.key === 'adduser') {
		userInfo = inForm.userName;
		var userForm = {
			'title': '유저추가('+ userInfo +')',
			'contexts':['page', 'selection', 'link', 'editable', 'image'],
			onclick: addUser
		};

		if (contextFlag) {
			chrome.contextMenus.update('adduser', userForm);
		} else {
			userForm['id'] = 'adduser';
			chrome.contextMenus.create(userForm);
		}

		contextFlag = true;
		
	} else {
		if(contextFlag) {
			chrome.contextMenus.remove('adduser');
			contextFlag = false;
		}
	}
}

function requestProcess(request, sender, sendResponse)
{
	if (request.method == "getLocalStorage") {
		sendResponse({data: localStorage});
	} else {
		sendResponse({});
	}
}

function addUser (event) {
	var defaultUserForm = {
	  	ruliwebID: '', 
	  	user_memo: '', 
	  	settingType: 0, 
	  	settingColor: '#ffffff'
	};
	
    if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {
      	defaultUserForm.addDate = getDate();
    	defaultUserForm.name	= aggroUserName;
    	save_json([defaultUserForm]);
    	
      	alert('유저추가 완료');
  	} else {
		var aggrohumanJson  = JSON.parse(localStorage['aggrohuman']);
		var addSwitch 		= true;
		var aggrohumanList  = aggrohumanJson.userCellInfo;

		for (var i=0; i<aggrohumanList.length; i++) {
			if (aggrohumanList[i].name === userInfo) {
				alert('이미 유저가 존재합니다.');
		  		addSwitch = false;
		  		break;
			}
		}//for - 중복체크

		if (addSwitch) {
			defaultUserForm.addDate = getDate();
			defaultUserForm.name = aggroUserName;
	    		
	        aggrohumanJson.userCellInfo.push(defaultUserForm);
	        
	        save_json(aggrohumanJson.userCellInfo);
			alert('유저추가 완료');
		}
  	}
}

function logPrint(color, text)
{
	var log = $('#log')[0];
	log.innerHTML   = text;
	log.style.color = color;
}//function logPrint - 페이지 로그 출력

chrome.runtime.onMessage.addListener(messageProcess);
chrome.extension.onRequest.addListener(requestProcess);