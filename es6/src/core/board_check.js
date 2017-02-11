
import Utility from './utility'

class BoardCheck
{
    static boardTableCheck(response)
    { 
    	let boardTable = $('.board_list_table tbody tr');
    	let count = 0;
    	let logs = {};
    	
    	Utility.tableAddID(boardTable);
    	
    	$(boardTable).each( (index, object) => {
    		let writerEle 	= $(object).find('.writer');
    		let writerName  = $(object).find('.writer a').text();
    		let writerID	= $(object).attr('itemID');
    		let subject 	= object;
    
    		if (writerName === '') {
    			writerName = $(object).find('.writer').text();
    			writerEle.contextmenu(contextMenu)
    		} else {
    			$(object).find('.writer a').contextmenu(contextMenu);
    		}
    		
    		let userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		}
    		
    		let countFlag = Utility.userNodeCheck(response.data.aggrohuman, subject, userInfo);
    
    		if(countFlag) {
    			let defaultInfo = {
    				name 	: writerName,
    				id 		: writerID,
    				count 	: 0
    			}
    			if(logs[writerName] === undefined) logs[writerName] = defaultInfo;
    			logs[writerName].count = parseInt(logs[writerName].count) + 1;
    		}
    
    		count = countFlag ? count+1 : count;
    	});
    	
    	let countFrom = {
    		title : 'board',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Utility.displayCheckCount(countFrom);
    }//function BoadtTableCheck - 게시판 어그로 체크
    
    static BoardCommentCheck(response) //blockType, checkUserList
    {
    	let commentTable	= $('.comment_view_wrapper .comment_view.normal.row tbody tr')
    	let commentBast		= $('.comment_view_wrapper .comment_view.best.row tbody tr');
    	let count = 0;
    	let logs = {};
    
    	$(commentBast).each( (index, object) => {
     		let writerName  = $(object).find('.user_inner_wrapper .nick a').text();
     		let writerID	= $(object).find('.user_inner_wrapper .member_srl').text();
     		let subject = object;
     		
     		writerID = writerID.substr(1, writerID.length-2);
     		
     		$(object).find('.user_inner_wrapper .nick a').contextmenu(contextMenu);
     		
     		let userInfo = {
     			writerName  : writerName,
     			writerID	: writerID
     		};
     		
     		let countFlag = Utility.userNodeCheck(response.data.aggrohuman, subject, userInfo);
     	
     		if(countFlag) {
     			let defaultInfo = {
     				name 	: writerName,
     				id 		: writerID,
     				count 	: 0
     			}
     			if(logs[writerName] === undefined) logs[writerName] = defaultInfo;
     			logs[writerName].count = parseInt(logs[writerName].count) + 1;
     		}
     
     		count = countFlag ? count+1 : count;
     	});
    	
    	$(commentTable).each( (index, object) => {
    		let writerName  = $(object).find('.user_inner_wrapper .nick a').text();
    		let writerID	= $(object).find('.user_inner_wrapper .member_srl').text();
    		let subject = object;
    		
    		writerID = writerID.substr(1, writerID.length-2);
    		
    		$(object).find('.user_inner_wrapper .nick a').contextmenu(contextMenu);
    		
    		let userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		};
    		
    		let countFlag = Utility.userNodeCheck(response.data.aggrohuman, subject, userInfo);
    		
    		if(countFlag) {
    			let defaultInfo = {
    				name 	: writerName,
    				id 		: writerID,
    				count 	: 0
    			}
    			
    			if(logs[writerName] === undefined) logs[writerName] = defaultInfo;
    			logs[writerName].count = parseInt(logs[writerName].count) + 1;
    		}
    
    		count = countFlag ? count+1 : count;
    	});
    	
    	let countFrom = {
    		title : 'comment',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Utility.displayCheckCount(countFrom);
    }//function BoardCommentCheck - 댓글 어그로 체크
}

export default BoardCheck;