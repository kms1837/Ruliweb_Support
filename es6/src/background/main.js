
import Utility from '../common/utility';
import UserIO from '../option/userIO';

const background = chrome.extension.getBackgroundPage();

const defaultMessageFrom = {
	type: '',
	key: '',
	userName: ''
}

class Background 
{
	constructor() {
		this.init();
	}
	
	static init() {
		Background.prototype.userInfo = {};
		Background.prototype.counts = [];
		Background.prototype.contextFlag = false;

		/*
		this.userInfo = {};
		this.counts = [];
		this.contextFlag = false;
		*/
		
		this.init = this.init.bind(Background);
		this.messageProcess = this.messageProcess.bind(Background);
		this.count = this.count.bind(Background);
		console.log('init!');
	}
	
	static get defaultMessageFrom () {
	    return defaultMessageFrom;
	}
	
	static messageProcess(request, sender, sendResponse) {
		switch (request.type) {
			case 'load':
				Background.init();
				break;
			case 'context': 
				Background.context(request);
				break;
			case 'count': 
				Background.count(request);
				break;
			case 'getCount': 
				sendResponse(Background.prototype.counts);
				break;
			default:
				break;
		}
	}
	
	static count(inForm) {
		Background.prototype.counts.push(inForm);
	}
	
	static context(inForm) {
		if (inForm.key === 'adduser') {
			this.userInfo = Object.assign(UserIO.defaultUserForm, {
    	        name: inForm.userName,
    	    });
			
			let userForm = {
				'title': '유저추가('+ this.userInfo.name +')',
				'contexts':['page', 'selection', 'link', 'editable', 'image'],
				onclick: () => { UserIO.addUser(this.userInfo); }
			};
	
			if (this.contextFlag) {
				chrome.contextMenus.update('adduser', userForm);
			} else {
				userForm['id'] = 'adduser';
				chrome.contextMenus.create(userForm);
			}
	
			this.contextFlag = true;
			
		} else {
			if (this.contextFlag) {
				chrome.contextMenus.remove('adduser');
				this.contextFlag = false;
			}
		}
	}
	
	static requestProcess(request, sender, sendResponse) {
		if (request.method == "getLocalStorage") {
			let sendData = localStorage.length > 0 ? localStorage : undefined;
			sendResponse({data: sendData});
		} else {
			sendResponse({});
		}
	}
	
	/*addUser (event) {
		let defaultUserForm = {
		  	ruliwebID: '', 
		  	user_memo: '', 
		  	settingType: 0, 
		  	settingColor: '#ffffff'
		};
		
	    if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {
	      	defaultUserForm.addDate = Utility.getDate();
	    	defaultUserForm.name	= userInfo;
	    	Utility.saveJson([defaultUserForm]);
	    	
	      	alert('유저추가 완료');
	  	} else {
			let aggrohumanJson  = JSON.parse(localStorage['aggrohuman']);
			let addSwitch 		= true;
			let aggrohumanList  = aggrohumanJson.userCellInfo;
	
			for (let i=0; i<aggrohumanList.length; i++) {
				if (aggrohumanList[i].name === userInfo) {
					alert('이미 유저가 존재합니다.');
			  		addSwitch = false;
			  		break;
				}
			}//for - 중복체크
	
			if (addSwitch) {
				defaultUserForm.addDate = Utility.getDate();
				defaultUserForm.name = userInfo;
		    		
		        aggrohumanJson.userCellInfo.push(defaultUserForm);
		        
		        Utility.saveJson(aggrohumanJson.userCellInfo);
				alert('유저추가 완료');
			}
	  	}
	}*/
}

chrome.runtime.onMessage.addListener(Background.messageProcess);
chrome.extension.onRequest.addListener(Background.requestProcess);

export default Background