
import Common from './common'

class BoardCheck
{
    static boardTableCheck(data)
    { 
    	let boardTable = $('.board_list_table tbody tr');
    	let count = 0;
    	let logs = {};
    	
    	Common.tableAddID(boardTable);
    	
    	$(boardTable).each( (index, object) => {
    		let writerEle 	= $(object).find('.writer');
    		let writerName  = $(object).find('.writer a').text();
    		let writerID	= $(object).attr('itemID');
    		let subject 	= object;
    
    		if (writerName === '') {
    			writerName = $(object).find('.writer').text();
    			writerEle.mouseover(Common.contextMenuUpdate);
				writerEle.contextmenu(Common.contextMenu);
    		} else {
    			$(object).find('.writer a').mouseover(Common.contextMenuUpdate);
				$(object).find('.writer a').contextmenu(Common.contextMenu);
    		}
    		
    		let userInfo = {
                ...Common.defaultCheckUserForm,
    	        writerName  : writerName,
    			writerID	: writerID
    	    };

    		let countFlag = Common.userNodeCheck(data, subject, userInfo);
    
    		if (countFlag) Common.logUserCounter(logs, writerName, writerID);
    
    		count = countFlag ? count+1 : count;
    	});
    	
    	let countFrom = {
    		title : 'board',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Common.displayCheckCount(countFrom);
    }//function BoadtTableCheck - 게시판 어그로 체크

    static dislikeCheck(limit, object) {
        let controlBox = $(object).find('.control_box');
        let dislike = controlBox.find('.btn_dislike .num').text().replace(/[^0-9]/g, '');

        if (parseInt(dislike) >= limit) {
            Common.addBlockNode(`비추가 ${limit}개 넘은 댓글입니다.`, object);
            return true;
        }

        return false;
    }

    static commentCheck(data, logs, object) {
        let writerName = $(object).find('.user_inner_wrapper .nick a').text();
        let writerID = $(object).find('.user_inner_wrapper .member_srl').text();
        let subject = object;

        writerID = writerID.replace(/[^0-9]/g, "");

        $(object).find('.user_inner_wrapper .nick a').mouseover(Common.contextMenuUpdate);
		$(object).find('.user_inner_wrapper .nick a').contextmenu(Common.contextMenu);
        
        let userInfo = {
            ...Common.defaultCheckUserForm,
            writerName  : writerName,
            writerID	: writerID
        };
        
        let countFlag = Common.userNodeCheck(data, subject, userInfo);
        
        if (countFlag) {
            Common.logUserCounter(logs, writerName, writerID);
        } else if(data.dislikeBlock.flag) {
            countFlag = BoardCheck.dislikeCheck(data.dislikeBlock.limit, subject);
        }
            
        return countFlag;
    }
    
    static boardCommentCheck(data)
    {
    	let commentTable = $('.comment_view_wrapper .comment_view.normal.row tbody tr')
    	let commentBast = $('.comment_view_wrapper .comment_view.best.row tbody tr');
    	let count = 0;
    	let logs = {};
    
    	$(commentBast).each( (index, object) => {
            count = BoardCheck.commentCheck(data, logs, object) ? count + 1 : count;
         }).bind(BoardCheck);
    	
    	$(commentTable).each( (index, object) => {
            count = BoardCheck.commentCheck(data, logs, object) ? count + 1 : count;
    	}).bind(BoardCheck);
    	
    	let countFrom = {
    		title : 'comment',
    		count : count,
    		logs  : JSON.stringify(logs)
    	}
    	
    	Common.displayCheckCount(countFrom);
    }//function BoardCommentCheck - 댓글 어그로 체크
}

export default BoardCheck;
