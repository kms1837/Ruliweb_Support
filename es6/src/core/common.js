
/*
    core의 기타함수를 모아놨습니다.
*/

const defaultCheckUserForm = {
    writerName: '',
	writerID: ''
}

const defaultDisplayCheckedUserForm = {
    name: '',
    id: '',
    count : 0
}

class Common
{
    static get defaultCheckUserForm() {
        return defaultCheckUserForm;
    }
    
    static get defaultDisplayCheckedUserForm() {
        return defaultDisplayCheckedUserForm;
    }
    
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

	static contextMenuUpdate(response) {
		let inUserName = $.trim($(response.target).text());

		Common.seleteUser = $(response.target);
    	
    	let messageFrom = {
    		type: "context",
    		key: "adduser",
    		userName: inUserName
    	}
    			
    	chrome.extension.sendMessage(messageFrom);
	}
    
	static contextMenu(response) {
    	let inUserName = $.trim($(response.target).text());
    	$(response.target).css('background-color', '#ccc');
    	$(response.target).css('color', '#fff');
    	
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

	static userMypiNodeCheck(data, subject, userInfo) {
		let userInfoList = data.userList;
		
		let infoIndex = data.userNameKeys[userInfo.writerName] ?
						data.userNameKeys[userInfo.writerName] :
						data.userIDKeys[userInfo.writerID];
		
		if (infoIndex !== undefined) {
			let user = userInfoList[infoIndex];
			
			switch(parseInt(user.settingType)) {
				case 1: //글 제거
					subject[0].style.display = 'none';
					subject[1].style.display = 'none';
					break;
				case 2: //글 가리기
					subject[0].style.fontSize = '0px';
					subject[1].style.fontSize = '0px';
					break;
				case 3: // 색칠
					subject[0].style.backgroundColor = user.settingColor;
					subject[1].style.backgroundColor = user.settingColor;
					break;
				case 4:
					subject.innerHTML += '(어글러)';
					break;
			}

			return true;

		} else if(data.prisonerBlock) {
            let priCheck = writerName.replace(/루리웹-|[0-9]/g, "");
            if (priCheck.length === 0) {
                Common.addBlockNode('죄수번호가 차단되었습니다.', subject);

                return true;
            }
        }

		return false;
	} // 마이피 전용 유저체크
	
    static userNodeCheck(data, subject, userInfo) {
    	let userInfoList = data.userList;
    	
    	let writerName  = $.trim(userInfo.writerName);
    	let writerID	= userInfo.writerID;
    	let infoIndex	= data.userNameKeys[writerName] !== undefined ?
    					  data.userNameKeys[writerName] :
    					  data.userIDKeys[writerID];
    	
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

    	} else if(data.prisonerBlock) {
            let priCheck = writerName.replace(/루리웹-|[0-9]/g, "");
            if (priCheck.length === 0) {
                Common.addBlockNode('죄수번호가 차단되었습니다.', subject);

                return true;
            }
        }
    	
    	return false;
    } // 유저 체크

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
