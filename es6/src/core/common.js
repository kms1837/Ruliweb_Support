
/*
    core의 기타함수를 모아놨습니다.
*/

Common.prototype.seleteUser = undefined;
// shared state

const defaultCheckUserForm = {
    writerName: '',
	writerID: ''
}

class Common
{
    
    static get defaultCheckUserForm() {
        return defaultCheckUserForm;
    }
    
	static contextMenu(response) {
    	let inUserName = $.trim($(response.target).text());
    	$(response.target).css('background-color', '#ccc');
    	$(response.target).css('color', '#fff');
    	
    	this.seleteUser = $(response.target);
    	
    	let messageFrom = {
    		type: "context",
    		key: "adduser",
    		userName: inUserName
    	}
    			
    	chrome.extension.sendMessage(messageFrom);
    }
	
    static userNodeCheck(data, subject, userInfo) {
    	let jsonData = JSON.parse(data);
    	let userInfoList = jsonData.userCellInfo;
    	
    	let writerName  = $.trim(userInfo.writerName);
    	let writerID	= userInfo.writerID;
    	let infoIndex	= jsonData.userNameKeys[writerName] != undefined ?
    					  jsonData.userNameKeys[writerName] :
    					  jsonData.userIDKeys[writerID];
    	
    	if (infoIndex != undefined) {
    		let user = userInfoList[infoIndex];
    		switch (parseInt(user.settingType)) {
    			case 1: // 글 제거
    				$(subject).css('display', 'none');
    				break;
    			case 2: // 글 가리기
    				this.hideTd($(subject).find('td'));
    				break;
    			case 3:
    				this.changeTdColor($(subject).find('td'), user.settingColor);
    				break;
    			case 4:
    				$(subject).find('.writer a').text('어글러');
    				break;
    		}
    		return true;
    	}
    	
    	return false;
    }

    static tableAddID(table) {
    	let boardTable = table;
    
    	$(boardTable).each( (index, object) => {
    		let writerID = $(object).find('.writer.text_over a').attr('onclick');
    		if(typeof writerID === "string") {
    			writerID = writerID.split(',')[2];
    			writerID = writerID.split("'")[1];
    			$(object).attr('itemID', writerID);
    		}
    	});
    }
    
    static convertID(mypiLink, cutchar) {
    	let returnData = mypiLink;
    	returnData = returnData.split(cutchar)[1];
    	returnData = returnData.substr(4, returnData.length);
    	return returnData;
    }//마이피 링크에서 ID 추출
    
    static displayCheckCount(inputCountFrom) {
    	inputCountFrom['type'] = 'count';
    	
    	chrome.extension.sendMessage(inputCountFrom);
    	
    	//issue - 답글작성 불가
    	
    	/*
    		<div id="checkResult"><p>...명 차단완료</p></div>
    		
    		position: absolute;
    		right: 0;
    		padding: 7px;
    		background-color: rgba(255, 255, 255, 0.78);
    		width: 180px;
    		margin-top: 34px;
    		text-align: right;
    	*/
    	
    	/*
    	inputTable.innerHTML = '<div id="checkResult"' +
    							'style="font-size:12px; position: absolute; right: 0; padding: 7px; background-color: #fff; width: 95px;' +
    							'text-align: right; border: 3px solid rgba(0, 152, 207, 0.53);"' +
    							'><p>' + inputCount + '개 차단완료</p></div>' + inputTable.innerHTML;
    	*/
    }
    
    static getClass(teg, name) {
    	for(var i=0;i<teg.length;i++) {
    	    if(teg[i].className == name)
    	        return teg[i];
    	}
    	return false;
    }// 클래스 탐색
    
    static hideTd(td) {
    	for(var i=0;i<td.length;i++)
    	    td[i].style.fontSize = '0px';
    }
    
    static changeTdColor(td, colorValue) {
    
    	for(var i=0;i<td.length;i++) {
    		$(td[i]).attr('style', `background-color: ${colorValue} !important;`);
    	}
    }//td색 변경 (리스트의 한줄부분임)
}

export default Common;