
/*
  core의 기타함수를 모아놨습니다.
*/

const defaultDisplayCheckedUserForm = {
	name: '',
	id: '',
	count : 0
}

class Common
{
	static get defaultDisplayCheckedUserForm() {
		return defaultDisplayCheckedUserForm;
	}
	
	static get mypiCheck() {
		let pageURL = window.location.href;
		let rootPageStatuse = pageURL.split('.')[0].substr(7);

		return rootPageStatuse === 'mypi';
	}// 마이피인지 체크합니다.
    
	static logUserCounter(logs, writerName, writerID) {
		if (logs[writerName] === undefined) {
			logs[writerName] = Object.assign({
				...this.defaultDisplayCheckedUserForm,
				name 	: writerName,
				id 		: writerID,
			});
		}
		
		logs[writerName].count = parseInt(logs[writerName].count) + 1;
	}//pipup의 유저 노드를 카운트합니다 ex) 링크공주 3개
	
	static resetContext() {
		if (Common.seleteUser) {
			if (!Common.mypiCheck) {
				Common.seleteUser.parents('td').removeAttr('style');
				Common.seleteUser.removeAttr('style');
			} else {
				let pageStatuse = window.location.href.split('/')[3];
				if (pageStatuse != '') {
					Common.seleteUser.removeAttr('style');
				} else {
					Common.seleteUser.parents('tr').removeAttr('style');
				}
			}
			Common.seleteUser = undefined;
		}
	}

	static setContextEvent(target) {
		target.mouseover(Common.contextMenuUpdate);
		target.contextmenu(Common.contextMenu);
	}

	static contextMenuUpdate(response) {
		let inUserName = $.trim($(response.target).text());
		let inUserID = '';

		if (!Common.mypiCheck) {
			let commentID = $(response.target).parents('tr').attr('itemID');
			let boardID = $(response.target).parents('td').find('span.member_srl');

			inUserID = commentID ? commentID : boardID.text().replace(/[^0-9]/g, "");
		} else {
			//mypi
			let pageStatuse = window.location.href.split('/')[3];
			let parm = window.location.href.split('?')[1];
			if (pageStatuse != '') {
				if (parm.split('=')[0] === 'cate') {
					inUserID = Common.getMypiToID($(response.target).parents('tr').find('a')[0].href, '&');
				} else {
					inUserID = $(response.target).parents('p').find('a')[0].href;
				}
			} else {
				inUserName = $.trim($(response.target).parents('tr').find('td').eq(1).text());
				inUserID = Common.getMypiToID($(response.target).parents('tr').find('a')[0].href, '&');
			}
			inUserID = inUserID ? inUserID.replace(/[^0-9]/g, "") : '';
		}

		Common.resetContext();
		Common.seleteUser = $(response.target);
    	
    let messageFrom = {
      type: "context",
      key: "adduser",
      userName: inUserName,
      userID: inUserID
    }
        
    chrome.extension.sendMessage(messageFrom);
	}

	static contextMenu(response) {
		if(!Common.mypiCheck) {
			$(response.target).parents('td').css('background-color', '#888');
			$(response.target).css('color', '#fff');
		} else {
			let pageStatuse = window.location.href.split('/')[3];
			if (pageStatuse != '') {
				$(response.target).css('background-color', '#888');
				$(response.target).css('color', '#fff');
			} else {
				$(response.target).parents('tr').css('background-color', '#888');
			}
		}
    	
    	Common.contextMenuUpdate(response);
    }

  static addBlockNode(message, object) {
    let hiddenTds = $(object).find('td');
		
    hiddenTds.each( (index, td) => {
        $(td).css('display', 'none');
    });

    $(object).append(`
        <td id="dislike-block" colspan=${hiddenTds.length + 1} style="text-align:center; padding:30px 0; background: rgba(0, 0, 0, 0.5); color:white;">
            <h3>${message}</h3>
            <button id="block-cancel-btn" style="color:white; border: 2px solid; padding:3px 5px; margin-top: 5px;">차단해제</button>
        </td>
    `);

    $(object).find('#block-cancel-btn').click( (event) => {
        let tds = $(event.target).closest('tr').find('td');
        tds.each( (index, td) => {
            $(td).css('display', '');
        });
        $(event.target).closest('td').remove();
    });
  }

	static tableAddID(table) {
		let boardTable = table;
	
		$(boardTable).each( (index, object) => {
			let writerID = $(object).find('.writer.text_over a').attr('onclick');
			if(typeof writerID === "string") {
				$(object).attr('itemID', Common.getOnClickUrlToID(writerID));
			}
		});
  }
  
  static getOnClickUrlToID(onClickUrl) {
    let id = '';
    try {
		  id = onClickUrl.split(',')[2];
      id = id.split("'")[1];
    } catch (e) {

    }

    return id;
	} // onClick의 URL을 기반으로 ID를 추출함
    
  static getMypiToID(mypiLink, cutchar) {
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
    for(var i=0;i<td.length;i++) {
      td[i].style.fontSize = '0px';
      let links = $(td[i]).find('a');
      let images = $(td[i]).find('img');

      if (links.length > 0)
          links.css('visibility', 'hidden');
      
      if (images.length > 0)
          images.css('visibility', 'hidden');
    }
  }
    
  static changeTdColor(td, colorValue) {
    for(var i=0;i<td.length;i++) {
      $(td[i]).attr('style', `background-color: ${colorValue} !important;`);
    }
  }//td색 변경 (리스트의 한줄부분임)
}

Common.prototype.seleteUser = undefined;
// shared state

export default Common;
