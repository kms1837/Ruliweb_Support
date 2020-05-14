
import Utility from '../common/utility';
import StorageIO from '../common/storageIO';
import Sweetalert from 'sweetalert2';

const defaultUserForm = {
	ruliwebID: '',
	name: '',
	userMemo: '', 
	settingType: 0,
	settingColor: '#ffffff',
	subSetting: 0,
	addDate: ''
};

const defaultKeywordForm = {
	keyword: '',
	settingType: 0,
	settingColor: '#ffffff',
	addDate: ''
}
	
class UserIo
{
	constructor() {
			
	}
    
	static get defaultUserForm () {
		return defaultUserForm;
	}

	static get defaultKeywordForm() {
		return defaultKeywordForm;
	}
    
	static importOption(file) {
		let optionFile = file;
		let reader = new FileReader();

		reader.readAsText(optionFile);

		return new Promise( (rootResolve, reject) => {
			reader.onload = ((loadFile) => {
				try {		
					let userData = JSON.parse(loadFile.target.result);
					Promise.resolve({index: 0, success: 0, fail: 0}).then(function loop(result) {
						if (result.index < userData.length) {
							UserIo.addUser(userData[result.index]).then(() => {
								result['index'] = result['index'] + 1;
								result['success'] = result['success'] + 1;
								loop(result);
							},
							() => {
								result['index'] = result['index'] + 1;
								result['fail'] = result['fail'] + 1;
								loop(result);
							});
						} else {
							rootResolve(result);
						}
					});
				} catch(err) {
					console.error(err);
					Utility.logPrint('red', '파일내용을 확인해 주세요');
				}
			});
		});
	}
    
	static exportCSV() {
		//let result = JSON.parse(localStorage['ruliweb-support']);
		/*
		var url = 'data:application/json;base64,' + btoa(result);
	    chrome.downloads.download({
	        url: url,
	        filename: 'filename_of_exported_file.json'
	    });*/
	    
	    //"data:text/csv;"
	    
		//let url = 'data:application/json;base64,' + btoa(unescape(encodeURIcomponent(JSON.stringify(result.userList))));
		let userList = JSON.parse(localStorage['ruliweb-support'])['userList'];
		let file = btoa(localStorage['ruliweb-support']);
		let url = `data:application/json;base64,${file}`;
		console.log(url);
		/*
		chrome.downloads.download({
			url : url,
			filename : 'user-list.json'
		});*/
	}
	
	static exportOldJson() {
		chrome.extension.sendRequest({ method: "getLocalStorage", key: '' }, (response) => {
			if (response.data != undefined) {
				let userList = JSON.parse(response.data.aggrohuman)['userCellInfo'];
				let file = window.btoa(unescape(encodeURIComponent(JSON.stringify(userList))));
				let url = `data:application/json;base64,${file}`;

				chrome.downloads.download({
					url : url,
					filename : 'user-list.json'
				});
			} else {
				Sweetalert({
					text: '다운로드에 실패하였습니다.'
				});
			}
		});
	} // 구버전 백업.

	static exportJson() {
		StorageIO.getData().then( data => {
			let file = window.btoa(unescape(encodeURIComponent(JSON.stringify(data.userList))));
			let url = `data:application/json;base64,${file}`;
			chrome.downloads.download({
				url : url,
				filename : 'user-list.json'
			});	
		});
	}

	static addUser(form=undefined) {
		return new Promise( (resolve, reject) => {
			StorageIO.getData().then( data => {
				let userList = data.userList;
				let addSwitch = true;
		
				for (let i=0; i<userList.length; i++) {
					if (userList[i].name == form.name) {
						addSwitch = false;
						reject({message: '리스트에 이미 존재함'});
						return;
					}
				}//for - 중복체크
		
				if (addSwitch) {
					userList.push(form);
					StorageIO.saveUser(userList).then(() => {
						resolve();
					});
				}
			});
		});
	}

	static addKeyword(form=undefined) {
		return new Promise( (resolve, reject) => {
			StorageIO.getData().then( data => {
				let keywordList = data.keywordList;
				let addSwitch = true;

				if (keywordList == undefined) {
					data["keywordList"] = [];
					keywordList = data.keywordList;
				} // 구버전 사용자 예외처리

				for (let i=0; i<keywordList.length; i++) {
					if (keywordList[i].keyword == form.keyword) {
						addSwitch = false;
						reject({message: '리스트에 이미 존재함'});
						return;
					}
				} //for - 중복체크

				if (addSwitch) {
					keywordList.push(form);

					StorageIO.saveKeyword(keywordList).then(() => {
						resolve();
					});
				}
			});
		});
	}
}

export default UserIo
