
import Utility from '../common/utility';

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
    
    static importOption(event)
    {
    	let optionFile = event.target.files[0];
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
    
    static exportOption()
	{
		let result = JSON.parse(localStorage['ruliweb-support']);
		let url = 'data:application/json;base64,' + btoa(unescape(encodeURIcomponent(JSON.stringify(result.userList))));
		chrome.downloads.download({
			url : url,
			filename : 'user-list.json'
		});
	}
    
    static addUser(form=undefined, callback=()=>{})
	{
	    if (localStorage['ruliweb-support'] == '' || localStorage['ruliweb-support'] == null) {
	    	Utility.saveUser([form]);
    		callback(form);
	    	// 최초 추가
	    	
	    } else {
	   		let aggrohumanJson = JSON.parse(localStorage['ruliweb-support']);
	     	let addSwitch      = true;
	     	let aggrohumanList = aggrohumanJson.userList;
	
			for (let i=0; i<aggrohumanList.length; i++) {
				if (aggrohumanList[i].name == form.name) {
					addSwitch = false;
					Utility.logPrint('red', '리스트에 이미 존재함');
					return;
				}
			}//for - 중복체크
	
	    	if (addSwitch) {
				aggrohumanJson.userList.push(form);
				Utility.saveUser(aggrohumanJson.userList);
				callback(form);
			}
		}
	}
}

export default UserIo