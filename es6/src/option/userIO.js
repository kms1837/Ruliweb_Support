
import Utility from '../common/utility';
import StorageIO from '../common/storageIO';

const defaultUserForm = {
	ruliwebID: '',
	name: '',
	nameRegex: '', //정규식
	userMemo: '', 
	settingType: 0,
	settingColor: '#ffffff',
	subSetting: 0,
	addDate: ''
};
	
class UserIo
{
    constructor() {
        
    }
    
    static get defaultUserForm () {
	    return defaultUserForm;
	}
    
    static importOption(file) {
    	let optionFile = file.target.files[0];
    	let reader = new FileReader();
    
    	reader.onload = ((file) => {
    		try {
    			let userData = JSON.parse(file.target.result);
    			$(userData).each((index, object) => {
    				this.addUser(object.name, object);
    			});
    			Utility.logPrint('#005CFF', '유저 추가');
    		} catch(err) {
    			Utility.logPrint('red', '파일내용을 확인해 주세요');
    		}
    	});
    
    	reader.readAsText(optionFile);
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
	
	static exportJson() {
		let userList = JSON.parse(localStorage['ruliweb-support'])['userList'];
		let file = btoa(JSON.stringify(userList));
		let url = `data:application/json;base64,${file}`;
		console.log(url);
	}
    
    static addUser(form=undefined, callback=()=>{}) {
        StorageIO.getData( data => {
	   		let userList = data.userList;
	     	let addSwitch = true;
	
			for (let i=0; i<userList.length; i++) {
				if (userList[i].name == form.name) {
					addSwitch = false;
					Utility.logPrint('red', '리스트에 이미 존재함');
					return;
				}
			}//for - 중복체크
	
	    	if (addSwitch) {
				userList.push(form);
				StorageIO.saveUser(userList);
				callback(form);
			}
        });
	}
}

export default UserIo
