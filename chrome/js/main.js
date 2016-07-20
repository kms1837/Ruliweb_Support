var background = chrome.extension.getBackgroundPage();
var userInfo;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.userName != undefined) {
			userInfo = request.userName;
			chrome.contextMenus.create({
				'id' : 'adduser',
				'title': "유저추가",
				onclick: addUser
			});
			//TODO
			//chrome.contextMenus.remove('adduser');
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
  	} else {
		var aggrohumanJson  = JSON.parse(localStorage['aggrohuman']);
		var addSwitch 		= true;
		var aggrohumanList  = aggrohumanJson.userCellInfo;

		for (var i=0; i<aggrohumanList.length; i++) {
			if (aggrohumanList[i].name === userInfo){
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