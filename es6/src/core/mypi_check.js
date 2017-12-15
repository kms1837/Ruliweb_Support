
import Common from './common'

class MypiCheck
{
    static mypiMainCheck(data) {
    	let mypiMainTable = $('.m_recently tbody tr');
    	let count = 0;
    	let logs = {};
    	
    	$(mypiMainTable).each( (index, object) => {
    		let subject = object;
    		let userTd  = $(object).find('td');
    		let writerName  = userTd.eq(1).text();
    		let writerID	= $(object).find('a')[0].href;
    		
			writerID = Common.convertID(writerID, '&');

			Common.setContextEvent(userTd.parents('tr'));
    		
    		let userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		}
    		
    		let countFlag = Common.userNodeCheck(data, subject, userInfo);
    
    		if (countFlag) Common.logUserCounter(logs, writerName, writerID);
    
    		count = countFlag ? count+1 : count;
    	});
    	
    	let countFrom = {
    		title : 'MypiMain',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Common.displayCheckCount(countFrom);
    }//마이피 메인
    
    static mypiCheck(data) {
    	let userInfoList = data.userList;
    	let count = 0;
    	let logs = {};
    	
    	let commentDocument = $('#mCenter tbody .mypiReply').find('div');
		let commentUserClass, commentUserName, commentUserId;
    	
    	for (let i=0; i<commentDocument.length; i=i+2) {
    		commentUserClass = $(commentDocument[i]).find('.cm01');
			commentUserName = commentUserClass.find('b').text();
			commentUserId = commentUserClass.find('a')[0].href.split('?')[1].substr(4);

			Common.setContextEvent($(commentUserClass).find('b'));

			let userInfo = {
                ...Common.defaultCheckUserForm,
    	        writerName  : commentUserName,
    			writerID	: commentUserId
    	    };

			let countFlag = Common.userMypiNodeCheck(data, [commentDocument[i], commentDocument[i+1]], userInfo);
			if (countFlag) Common.logUserCounter(logs, commentUserName, commentUserId);

			count = countFlag ? count+1 : count;
    	}
    	
    	let countFrom = {
    		title : 'MypiComment',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Common.displayCheckCount(countFrom);
    }//마이피 체크
    
    static mypiCateCheck(data) {
    	let mypiCateTable = $('#mypilist tbody tr');
    	let count = 0;
    	let logs = {};
    	
    	$(mypiCateTable).each( (index, object) => {
    		let subject = object;
    		let userTd  = $(object).find('td');
    		let writerName  = userTd.eq(1).text();
			let writerID	= userTd.eq(0).find('.mypicto3').find('a')[0];
			
			Common.setContextEvent(userTd.eq(1));
    		
    		writerID = writerID ? Common.convertID(writerID.href.split('?')[1], '&') : ''
    		
    		let userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		}

			let countFlag = Common.userNodeCheck(data, subject, userInfo);
    
    		if (countFlag) Common.logUserCounter(logs, writerName, writerID);
    
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
