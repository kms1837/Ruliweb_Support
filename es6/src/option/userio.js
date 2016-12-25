
class UserIo
{
    importOption(event)
    {
    	var optionFile = event.target.files[0];
    	var reader = new FileReader();
    
    	reader.onload = (function(file) {
    		try {
    			var userData = JSON.parse(file.target.result);
    			$(userData).each(function(index, object) {
    				addUser(object.name, object);
    			});
    			logPrint('#005CFF', '유저 추가');
    		} catch(err) {
    			logPrint('red', '파일내용을 확인해 주세요');
    		}
    	});
    
    	reader.readAsText(optionFile);
    }
    
    exportOption()
    {
    	var result = JSON.parse(localStorage['aggrohuman']);
    	var url = 'data:application/json;base64,' + btoa(JSON.stringify(result.userCellInfo));
    	chrome.downloads.download({
    		url : url,
    		filename : 'test.json'
    	});
    }
    
    addUser(aggroUserName, form)
    {
    	var badUserList   = $('.badUserList');
    	
    	var defaultUserForm = {
    	  ruliwebID: '', 
    	  user_memo: '', 
    	  settingType: 0, 
    	  settingColor: '#ffffff'
    	};
      
    	if (aggroUserName != '') {
    	    if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {
    
    	    	if (form === undefined) {
    	    		defaultUserForm.addDate = getDate();
    	    		defaultUserForm.name	= aggroUserName;
    	    		save_json([defaultUserForm]);
    	    	} else {
    	    		save_json([form]);
    	    	}
    	    	
    	    	badUserList[0].innerHTML  += addCell(0, getDate(), aggroUserName, '', 0, 0);
    	    	logPrint('#005CFF', '어그로 유저 추가');
    	    	// 최초 추가
    
    	    	return true;
    
    	    } else {
    	   		var aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
    	     	var addSwitch      = true;
    	     	var aggrohumanList = aggrohumanJson.userCellInfo;
    	
    			for (var i=0; i<aggrohumanList.length; i++){
    				if (aggrohumanList[i].name == aggroUserName){
    					addSwitch = false;
    					logPrint('red', '리스트에 이미 존재함');
    
    					return false;
    				}
    			}//for - 중복체크
    	
    	    	if (addSwitch) {
    	    		var addDate;
    	    		var settingType;
    	    		if (form === undefined) {
    	    			addDate = getDate();
    	    			settingType = 0;
    					defaultUserForm.addDate = addDate;
    					defaultUserForm.name = aggroUserName;
    					
    					aggrohumanJson.userCellInfo.push(defaultUserForm);
    				} else {
    					addDate = form.addDate;
    					settingType = form.settingType;
    					aggrohumanJson.userCellInfo.push(form);
    				}
    
    				save_json(aggrohumanJson.userCellInfo);
    				
    				badUserList[0].innerHTML  += addCell(aggrohumanJson.userCellInfo.length - 1,
    													addDate, 
    													aggroUserName, 
    													'',
    													settingType,
    													aggrohumanList.length-1);
    				logPrint('#005CFF', '어그로 유저 추가');
    
    				return true;
    			}
    		}
    	} else {
    		logPrint('red', '이름이 비어있음');
    	}
    
    	return false;
    }
}

export default UserIo