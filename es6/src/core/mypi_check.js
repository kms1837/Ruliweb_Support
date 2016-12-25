
import utility

class MypiCheck
{
    mypiMainCheck(response)
    {
    	var mypiMainTable = $('.m_recently tbody tr');
    	var count = 0;
    	var logs = {};
    	
    	$(mypiMainTable).each(function(index, object) {
    		var subject = object;
    		var userTd  = $(object).find('td');
    		var writerName  = userTd.eq(1).text();
    		var writerID	= $(object).find('a')[0].href;
    		
    		writerID = convertID(writerID, '&');
    		
    		var userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		}
    		
    		var countFlag = userNodeCheck(response.data.aggrohuman, subject, userInfo);
    		
    		if(countFlag) {
    			var defaultInfo = {
    				name 	: writerName,
    				id 		: writerID,
    				count 	: 0
    			}
    			if(logs[writerName] === undefined) logs[writerName] = defaultInfo;
    			logs[writerName].count = parseInt(logs[writerName].count) + 1;
    		}
    		
    		count = countFlag ? count+1 : count;
    	});
    	
    	var countFrom = {
    		title : 'MypiMain',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	displayCheckCount(countFrom);
    }//마이피 메인
    
    mypiCheck(response)
    {
    	var data  = JSON.parse(response.data.aggrohuman);
    	var userInfoList = data.userCellInfo;
    	var count = 0;
    	var logs = {};
    	
    	var commentDocument = $('#mCenter tbody .mypiReply').find('div');
    	var commentUserClass;
    	var commentUserName;
    	var commentUserId;
    	
    	for(var i=0; i<commentDocument.length; i=i+2) {
    		commentUserClass = $(commentDocument[i]).find('.cm01');
    		commentUserName  = commentUserClass.find('b')[0];
    		commentUserId	 = commentUserClass.find('a')[0].href.split('?')[1].substr(3);
    		
    		var infoIndex = data.userNameKeys[commentUserName] ?
    						data.userNameKeys[commentUserName] :
    						data.userIDKeys[commentUserId];
    		
    		if (infoIndex != undefined) {
    			var user = userInfoList[infoIndex];
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
    			var defaultInfo = {
    				name 	: writerName,
    				id 		: writerID,
    				count 	: 0
    			}
    			if(logs[writerName] === undefined) logs[writerName] = defaultInfo;
    			logs[writerName].count = parseInt(logs[writerName].count) + 1;
    			count++;
    		}
    	}
    	
    	var countFrom = {
    		title : 'MypiComment',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	displayCheckCount(countFrom);
    }//마이피 체크
    
    mypiCateCheck(response)
    {
    	var mypiCateTable = $('#mypilist tbody tr');
    	var count = 0;
    	var logs = {};
    	
    	$(mypiCateTable).each(function(index, object) {
    		var subject = object;
    		var userTd  = $(object).find('td');
    		var writerName  = userTd.eq(1).text();
    		var writerID	= userTd.eq(0).find('.mypicto3').find('a')[0];
    		
    		writerID = writerID ? convertID(writerID.href.split('?')[1], '&') : ''
    		
    		var userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		}
    		
    		var countFlag = userNodeCheck(response.data.aggrohuman, subject, userInfo);
    		
    		if(countFlag) {
    			var defaultInfo = {
    				name 	: writerName,
    				id 		: writerID,
    				count 	: 0
    			}
    			if(logs[writerName] === undefined) logs[writerName] = defaultInfo;
    			logs[writerName].count = parseInt(logs[writerName].count) + 1;
    		}
    		
    		count = countFlag ? count+1 : count;
    	});
    	
    	var countFrom = {
    		title : 'MypiCate',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	displayCheckCount(countFrom);
    }
};

export default MypiCheck;