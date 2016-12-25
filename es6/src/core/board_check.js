
class BoardCheck
{
    boardTableCheck(response)
    { 
    	var boardTable = $('.board_list_table tbody tr');
    	var count = 0;
    	var logs = {};
    	
    	tableAddID(boardTable);
    	
    	$(boardTable).each(function(index, object) {
    		var writerEle 	= $(object).find('.writer');
    		var writerName  = $(object).find('.writer a').text();
    		var writerID	= $(object).attr('itemID');
    		var subject 	= object;
    
    		if (writerName === '') {
    			writerName = $(object).find('.writer').text();
    			writerEle.contextmenu(contextMenu)
    		} else {
    			$(object).find('.writer a').contextmenu(contextMenu);
    		}
    		
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
    		title : 'board',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	displayCheckCount(countFrom);
    }//function BoadtTableCheck - 게시판 어그로 체크
    
    BoardCommentCheck(response) //blockType, checkUserList
    {
    	var commentTable	= $('.comment_view_wrapper .comment_view.normal.row tbody tr')
    	var commentBast		= $('.comment_view_wrapper .comment_view.best.row tbody tr');
    	var count = 0;
    	var logs = {};
    
    	$(commentBast).each(function(index, object) {
     		var writerName  = $(object).find('.user_inner_wrapper .nick a').text();
     		var writerID	= $(object).find('.user_inner_wrapper .member_srl').text();
     		var subject = object;
     		
     		writerID = writerID.substr(1, writerID.length-2);
     		
     		$(object).find('.user_inner_wrapper .nick a').contextmenu(contextMenu);
     		
     		var userInfo = {
     			writerName  : writerName,
     			writerID	: writerID
     		};
     		
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
    	
    	$(commentTable).each(function(index, object) {
    		var writerName  = $(object).find('.user_inner_wrapper .nick a').text();
    		var writerID	= $(object).find('.user_inner_wrapper .member_srl').text();
    		var subject = object;
    		
    		writerID = writerID.substr(1, writerID.length-2);
    		
    		$(object).find('.user_inner_wrapper .nick a').contextmenu(contextMenu);
    		
    		var userInfo = {
    			writerName  : writerName,
    			writerID	: writerID
    		};
    		
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
    		title : 'comment',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	displayCheckCount(countFrom);
    }//function BoardCommentCheck - 댓글 어그로 체크
}

export default BoardCheck;