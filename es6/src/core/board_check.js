
import Common from './common'
import Checker from './checker'

class BoardCheck
{
  static thumbnailCheck(data) {
    let thumbnailItems = $('.board_list_table tbody .flex_item');
    let count = 0;
    let logs = {};

    $(thumbnailItems).each((index, item) => {
      const writerObject = $(item).find('.article_info .nick'); 
      const writerName = $(writerObject).text();
      const writerID = Common.getOnClickUrlToID($(writerObject).attr('onclick'));
      let boardTitle = $(item).find('.title_wrapper').text();
      
      boardTitle = $.trim(boardTitle);
      boardTitle = boardTitle.replace(/^\[(.*?)\]/gi, "");
      boardTitle = $.trim(boardTitle);

      let userInfo = {
        ...Checker.defaultCheckUserForm,
        writerName  : writerName,
        writerID	: writerID
      };

      let countFlag = Checker.userNodeCheck(1, data, $(item).closest("td"), userInfo);
      if (!countFlag) countFlag = Checker.keywordCheck(1, data, $(item).closest("td"), boardTitle);

      if (countFlag) Common.logUserCounter(logs, writerName, writerID);
  
      count = countFlag ? count+1 : count;
    });

    let countFrom = {
      title : 'board-thumbnail',
      count : count,
      logs  : JSON.stringify(logs)
    }

    if (count > 0) {
      Common.displayCheckCount(countFrom);
    }
  }

  static galleryCheck(data) {
    let galleryItems = $('.board_list_table tbody .flex_item');
    let count = 0;
    let logs = {};

    $(galleryItems).each((index, item) => {
      const writerObject = $(item).find('.subject_wrapper .nick'); 
      const writerID = Common.getOnClickUrlToID($(writerObject).attr('onclick'));
      const boardTitle = $(item).find('.subject_wrapper .deco').text();
      let writerName = $(writerObject).text();

      writerName = writerName.substring(3, writerName.length);

      let userInfo = {
        ...Checker.defaultCheckUserForm,
        writerName  : writerName,
        writerID	: writerID
      };

      let countFlag = Checker.userNodeCheck(1, data, item, userInfo);
      if (!countFlag) countFlag = Checker.keywordCheck(1, data, item, boardTitle);

      if (countFlag) Common.logUserCounter(logs, writerName, writerID);
  
      count = countFlag ? count+1 : count;

    });

    let countFrom = {
      title : 'board-gallery',
      count : count,
      logs  : JSON.stringify(logs)
    }
    
    if (count > 0) {
      Common.displayCheckCount(countFrom);
    }
  }

  static boardTableCheck(data) { 
    let boardTable = $('.board_list_table tbody tr');
    let count = 0;
    let logs = {};
    
    Common.tableAddID(boardTable);
    
    $(boardTable).each( (index, item) => {
      let writerEle = $(item).find('.writer');
      let writerNameObject = $(item).find('.writer a'); 
      let writerName = $(writerNameObject).text();
      let writerID = Common.getOnClickUrlToID($(writerNameObject).attr('onclick'));
      let boardTitle = $(item).find('.subject a').text();
  
      if (writerName === '') {
        writerName = $(item).find('.writer').text();
        Common.setContextEvent(writerEle);
      } else {
        Common.setContextEvent($(item).find('.writer a'));
      }
      
      let userInfo = {
        ...Checker.defaultCheckUserForm,
        writerName  : writerName,
        writerID	: writerID
      };

      let countFlag = Checker.userNodeCheck(0, data, item, userInfo);
      if (!countFlag) countFlag = Checker.keywordCheck(0, data, item, boardTitle);
    
      if (countFlag) Common.logUserCounter(logs, writerName, writerID);
  
      count = countFlag ? count+1 : count;
    });
    
    let countFrom = {
      title : 'board',
      count : count,
      logs  : JSON.stringify(logs)
    }
    
    if (count > 0) {
      Common.displayCheckCount(countFrom);
    }
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

    Common.setContextEvent($(object).find('.user_inner_wrapper .nick a'));
      
    let userInfo = {
      ...Checker.defaultCheckUserForm,
      writerName  : writerName,
      writerID	: writerID
    };
      
    let countFlag = Checker.userNodeCheck(0, data, subject, userInfo);
      
    if (countFlag) {
      Common.logUserCounter(logs, writerName, writerID);
    } else if(data.dislikeBlock.flag) {
      countFlag = BoardCheck.dislikeCheck(data.dislikeBlock.limit, subject);
    }
        
    return countFlag;
  }
  
  static boardCommentCheck(data) {
    let commentTable = $('.comment_view_wrapper .comment_view.normal tbody tr')
    let commentBast = $('.comment_view_wrapper .comment_view.best tbody tr');
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
