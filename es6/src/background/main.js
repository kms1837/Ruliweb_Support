
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
		chrome.contextMenus.create({
			'id': 'adduser',
			'title': `유저를 선택해 주세요`,
			'contexts':['page', 'selection', 'link', 'editable', 'image'],
			'enabled': false,
			onclick: () => { 
				if (Object.keys(Background.userInfo).length > 0) {
					let flag = confirm(`선택한 ${Background.userInfo.name} 유저를 추가 하시겠습니까?`);
					if (flag) {
						UserIO.addUser({...Background.userInfo, addDate: Utility.getDate()})
						.then( () => {
							alert('유저를 추가하였습니다.');
						})
						.catch( res => {
							alert(res.message);
						});
					}
				}
			}
		});
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
			Background.userInfo = {
				...UserIO.defaultUserForm,
    	        name: inForm.userName
    	    };
	
			chrome.contextMenus.update('adduser', {'title': `관리유저등록(${Background.userInfo.name})`, 'enabled': true});
		} else {
			chrome.contextMenus.update('adduser', {'title': '유저를 선택해 주세요', 'enabled': false});
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
}

chrome.runtime.onMessage.addListener(Background.messageProcess);
chrome.extension.onRequest.addListener(Background.requestProcess);

export default Background