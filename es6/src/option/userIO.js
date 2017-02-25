
import Utility from '../common/utility';

const defaultUserForm = {
  ruliwebID: '',
  name: '',
  userMemo: '', 
  settingType: 0, 
  settingColor: '#ffffff',
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
		let result = JSON.parse(localStorage['aggrohuman']);
		let url = 'data:application/json;base64,' + btoa(unescape(encodeURIcomponent(JSON.stringify(result.userCellInfo))));
		chrome.downloads.download({
			url : url,
			filename : 'user-list.json'
		});
	}
    
    static addUser(form=undefined, callback=()=>{})
	{
	    if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {
	    	Utility.saveJson([form]);
    		callback(form);
	    	// 최초 추가
	    	
	    } else {
	   		let aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
	     	let addSwitch      = true;
	     	let aggrohumanList = aggrohumanJson.userCellInfo;
	
			for (let i=0; i<aggrohumanList.length; i++) {
				if (aggrohumanList[i].name == form.name) {
					addSwitch = false;
					Utility.logPrint('red', '리스트에 이미 존재함');
					return;
				}
			}//for - 중복체크
	
	    	if (addSwitch) {
				aggrohumanJson.userCellInfo.push(form);
				Utility.saveJson(aggrohumanJson.userCellInfo);
				callback(form);
			}
		}
	}
}

export default UserIo