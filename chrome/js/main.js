var background = chrome.extension.getBackgroundPage();
var userInfo;
var contextFlag = false;

function messageProcess(request, sender, sendResponse)
{
	if (request.type === 'adduser') {
		userInfo = request.userName;
		var userForm = {
			'title': '유저추가('+ userInfo +')',
			'contexts':['page', 'selection', 'link', 'editable', 'image'],
			onclick: addUser
		};

		if(contextFlag) {
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
	if (request.method == "getLocalStorage"){
		if(request.key == "noteCount") sendResponse({data: localStorage['noteCount']});
		else sendResponse({data: localStorage});
		//[request.key]
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

function save_json(jsonData) {
	var perent = localStorage['aggrohuman'];
	var userNameKeys = {};
	var userIDKeys = {};
	
	$(jsonData).each(function(index, data) {
		if(data.name) userNameKeys[data.name] = index;
		if(data.ruliwebID) userIDKeys[data.ruliwebID] = index;
	});
	
	localStorage['aggrohuman'] = JSON.stringify(
		{
			"userCellInfo": jsonData,
			"userNameKeys": userNameKeys, 
			"userIDKeys": userIDKeys
		}
	);
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

chrome.runtime.onMessage.addListener(messageProcess);
chrome.extension.onRequest.addListener(requestProcess);