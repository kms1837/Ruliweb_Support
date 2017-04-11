
import Common from './common'

class MypiCheck
{
    mypiMainCheck(response)
    {
    	let mypiMainTable = $('.m_recently tbody tr');
    	let count = 0;
    	let logs = {};
    	
    	$(mypiMainTable).each( (index, object) => {
    		let subject = object;
    		let userTd  = $(object).find('td');
    		let writerName  = userTd.eq(1).text();
    		let writerID	= $(object).find('a')[0].href;
    		
    		writerID = Common.convertID(writerID, '&');
    		
    		let userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		}
    		
    		let countFlag = Common.userNodeCheck(response.data.aggrohuman, subject, userInfo);
    		
    		if (countFlag) {
    			if (logs[writerName] === undefined) {
    			    logs[writerName] = Object.assign(Common.defaultCheckUserForm, {
        				name 	: writerName,
        				id 		: writerID,
        			});
    			}
    			logs[writerName].count = parseInt(logs[writerName].count) + 1;
    		}
    		
    		count = countFlag ? count + 1 : count;
    	});
    	
    	let countFrom = {
    		title : 'MypiMain',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Common.displayCheckCount(countFrom);
    }//마이피 메인
    
    mypiCheck(response)
    {
    	let data  = JSON.parse(response.data.aggrohuman);
    	let userInfoList = data.userList;
    	let count = 0;
    	let logs = {};
    	
    	let commentDocument = $('#mCenter tbody .mypiReply').find('div');
    	let commentUserClass;
    	let commentUserName;
    	let commentUserId;
    	
    	for(let i=0; i<commentDocument.length; i=i+2) {
    		commentUserClass = $(commentDocument[i]).find('.cm01');
    		commentUserName  = commentUserClass.find('b')[0];
    		commentUserId	 = commentUserClass.find('a')[0].href.split('?')[1].substr(3);
    		
    		let infoIndex = data.userNameKeys[commentUserName] ?
    						data.userNameKeys[commentUserName] :
    						data.userIDKeys[commentUserId];
    		
    		if (infoIndex != undefined) {
    			let user = userInfoList[infoIndex];
    			switch(parseInt(user.settingType)) {
    				case '1': //글 제거
    					commentDocument[i].style.display = 'none';
    					commentDocument[i+1].style.display = 'none';
    					break;
    				case '2': //글 가리기
    					commentDocument[i].style.fontSize = '0px';
    					commentDocument[i+1].style.fontSize = '0px';
    					break;
    				case '3':
    					commentDocument[i].style.backgroundColor 	= user.settingColor;
    					commentDocument[i+1].style.backgroundColor  = user.settingColor;
    					break;
    				case '4':
    					commentUserName.innerHTML += '(어글러)';
    					break;
    			}
    			
    			if (logs[commentUserName] === undefined) {
    			    logs[commentUserName] = Object.assign(Common.defaultCheckUserForm, {
        				name 	: commentUserName,
        				id 		: commentUserId,
        			});
    			}
    			logs[commentUserName].count = parseInt(logs[commentUserName].count) + 1;
    			count++;
    		}
    	}
    	
    	let countFrom = {
    		title : 'MypiComment',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Common.displayCheckCount(countFrom);
    }//마이피 체크
    
    mypiCateCheck(response)
    {
    	let mypiCateTable = $('#mypilist tbody tr');
    	let count = 0;
    	let logs = {};
    	
    	$(mypiCateTable).each( (index, object) => {
    		let subject = object;
    		let userTd  = $(object).find('td');
    		let writerName  = userTd.eq(1).text();
    		let writerID	= userTd.eq(0).find('.mypicto3').find('a')[0];
    		
    		writerID = writerID ? Common.convertID(writerID.href.split('?')[1], '&') : ''
    		
    		let userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		}
    		
    		let countFlag = Common.userNodeCheck(response.data.aggrohuman, subject, userInfo);
    		
    		if(countFlag) {
    			if (logs[writerName] === undefined) {
    			    logs[writerName] = Object.assign(Common.defaultCheckUserForm, {
        				name 	: writerName,
        				id 		: writerID,
        			});
    			}
    			logs[writerName].count = parseInt(logs[writerName].count) + 1;
    		}
    		
    		count = countFlag ? count+1 : count;
    	});
    	
    	let countFrom = {
    		title : 'MypiCate',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Common.displayCheckCount(countFrom);
    }
};

export default MypiCheck;