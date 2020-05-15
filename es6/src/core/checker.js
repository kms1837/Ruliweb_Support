import Common from './common'

/*
  체크하여 적절히 변형시킴
*/

const defaultCheckUserForm = {
	writerName: '',
	writerID: ''
}

class Checker
{
  static get defaultCheckUserForm() {
		return defaultCheckUserForm;
  }
  
  static keywordCheck(data, subject) {
		let keywordList = data.keywordList;
		let check = keywordList.some( item =>  {
			let regex = new RegExp(item.keyword, "g");
			if (regex.test(subject)) {
				return true;
			}
		});

		return check;
	}
	
	static userNodeCheck(type, data, subject, userInfo) {
    // type 0 - normal, 1-gallery
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
          Common.hideTd($(subject).find('td'));
					break;
        case 3: // 글 강조
          if (type === 1) {
            $(subject).attr('style', `background-color: ${user.settingColor} !important;`);
          } else {
            Common.changeTdColor($(subject).find('td'), user.settingColor);
          }
					break;
				case 4: // 별명 표시
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
  } // 유저 설정에 따라 댓글 및 게시글을 변경함

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
			let priCheck = userInfo.writerName.replace(/루리웹-|[0-9]/g, "");
			if (priCheck.length === 0) {
				Common.addBlockNode('죄수번호가 차단되었습니다.', subject);

				return true;
			}
		}
		return false;
	} // 마이피 전용 유저체크
}

export default Checker;