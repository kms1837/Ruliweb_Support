var background = chrome.extension.getBackgroundPage();
var userInfo;
var contextFlag = false;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.type === 'adduser') {
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
			//TODO
		} else {
			if(contextFlag) {
				chrome.contextMenus.remove('adduser');
				contextFlag = false;
			}
		}
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage")
		if(request.key == "noteCount") sendResponse({data: localStorage['noteCount']});
		else sendResponse({data: localStorage});
		//[request.key]
		
	else
		sendResponse({});
});

function addUser (event) {
    if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {
      	localStorage['aggrohuman'] = JSON.stringify({"userCellInfo": [
      		{addDate: getDate(), 
      		name: userInfo, 
      		ruliwebID: '', 
      		user_memo: '', 
      		settingType: 0, 
      		settingColor: '#ffffff'}]
      	});
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
			aggrohumanJson.userCellInfo.push({
				addDate: getDate(), 
				name: userInfo, 
				ruliwebID: '', 
				user_memo: '', 
				settingType: 0, 
				settingColor: '#ffffff'
			});
			localStorage['aggrohuman'] = JSON.stringify(aggrohumanJson);
			alert('유저추가 완료');
		}
  	}

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