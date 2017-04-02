
class Utillity
{
    static saveUser(jsonData, callback=()=>{}) {
        let changedJson = JSON.parse(localStorage['ruliweb-support']);
    	let userNameKeys = {};
    	let userIDKeys = {};
    	
    	$(jsonData).each( (index, data) => {
    		if (data.name)
    		    userNameKeys[data.name] = index;
    		    
    		if (data.ruliwebID)
    		    userIDKeys[data.ruliwebID] = index;
    	});
    	
    	changedJson["userList"] = jsonData;
    	changedJson["userNameKeys"] = userNameKeys;
    	changedJson["userIDKeys"] = userIDKeys;
    	
    	localStorage['ruliweb-support'] = JSON.stringify(changedJson);
    	
    	callback();
    }
    
    static logPrint(color, text)
    {
    	let log = $('#log')[0];
    	log.innerHTML   = text;
    	log.style.color = color;
    }//function logPrint - 페이지 로그 출력
    
    static getDate()
    {
        let date  = new Date();
        let year  = date.getFullYear();
        let month = date.getMonth()+1;
        let day   = date.getDate();
    
        if(month <10 )
            month = `0${month}`;
        if(day   <10 )
            day = `0${day}`;
    
        return ''+year+'/'+month+'/'+day;
    }//function getDate - 날짜값을 얻어옴
    
    static settingToStrConvert(settingType) {
		let settingTypeStr;
		
		switch(parseInt(settingType)) {
			case 0:
				settingTypeStr = "설정없음";
				break;
			case 1:
				settingTypeStr = "글 제거";
				break;
			case 2:
				settingTypeStr = "글 가리기";
				break;
			case 3:
				settingTypeStr = "줄 색칠";
				break;
		}
		
		return settingTypeStr;
	}
}

export default Utillity

/*
    공통 사용 기타함수를 모아놨습니다.
*/