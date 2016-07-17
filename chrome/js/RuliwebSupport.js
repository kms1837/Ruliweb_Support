
/*var testdata = '{"userCellInfo":[{"addDate":"2016/07/02","name":"smile","ruliwebID":"","settingType":"3","settingColor":"#fff"},{"addDate":"2016/07/02","name":"루리","ruliwebID":"","settingType":0,"settingColor":"#fff"}]}';
var response = testdata;
테스트 데이터
*/

$(document).ready(function()
{
	runChecking();
});

function runChecking()
{
	var pageURL 		= window.location.href;
	var pageUrlElement  = pageURL.split('/');
	var rootPageStatuse = pageURL.split('.')[0].substr(7);
	var pageStatuse 	= pageUrlElement[3];
	var pageStatuseType	= pageUrlElement[pageUrlElement.length-2].substr(0, 4);

	chrome.extension.sendRequest({method: "getLocalStorage"}, function(response){
		var checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
		
		$.observer = new MutationObserver(function(mutations) {
			var tartgetName = $(mutations[0].target).attr('class');
			if(tartgetName === 'comment_view normal row') {
	    		BoardCommentCheck(response);
			}
		});

		var observerConfig = { childList: true};
					
		if(checkUserList!='') {
			if(pageStatuse == 'news') {
				BoardCommentCheck(response);
				$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
				
			}else if(rootPageStatuse == 'mypi'){
				if(pageStatuse != '')	mypiCheck(response);
				else					mypiMainCheck(response);
				
			} else {
				BoardTableCheck(response);
				if(pageStatuseType == 'read') {
					BoardCommentCheck(response);
					$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
				}
			}
		}
	});
}

function userNodeCheck(subject, user, userInfo)
{
	if(userInfo.writerName === user.name || userInfo.writerID === user.ruliwebID) {
		switch(parseInt(user.settingType)){
			case 1: // 글 제거
				$(subject).css('display', 'none');
				break;
			case 2: // 글 가리기
				hideTd($(subject).find('td'));
				break;
			case 3:
				changeTdColor($(subject).find('td'), user.settingColor);
				break;
			case 4:
				$(subject).find('.writer a').text('어그로');
				break;
		}
		return true;
	}
	
	return false;
}

function mypiMainCheck(response)
{
	var checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
	
	var mypiMainTable = $('.m_recently tbody tr');
	$(mypiMainTable).each(function(index, object) {
		var subject = object;
		var userTd  = $(object).find('td');
		var writerName  = userTd.eq(1).text();
		var writerID	= $(object).find('a')[0].href;
		
		writerID = convertID(writerID, '&');
		
		$(checkUserList).each(function(index, user){
			var userInfo = {
				writerName  : writerName,
				writerID	: writerID
			}
			var flag = userNodeCheck(subject, user, userInfo);
			if(flag) return;
		});
	});
}//마이피 메인

function mypiCheck(response)
{
	var checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
	
	var commentDocument = $('#mCenter tbody .mypiReply').find('div');
	var commentUserClass;
	var commentUserName;
	var commentUserId;
	var checkCount = 0;
	
	for(var i=0; i<commentDocument.length; i=i+2) {
		commentUserClass = $(commentDocument[i]).find('.cm01');
		commentUserName  = commentUserClass.find('b')[0];
		commentUserId	 = commentUserClass.find('a')[0].href.split('?')[1].substr(3);
		
		for(var y=0; y<checkUserList.length; y++) {
			var checkUser = checkUserList[y];
			if(commentUserName.outerText == checkUser.name || commentUserId == checkUser.ruliwebID) {
				checkCount++;
				switch(parseInt(checkUser.settingType)){
					case '1': //글 제거
						commentDocument[i].style.display = 'none';
						commentDocument[i+1].style.display = 'none';
						break;
					case '2': //글 가리기
						commentDocument[i].style.fontSize = '0px';
						commentDocument[i+1].style.fontSize = '0px';
						break;
					case '3':
						commentDocument[i].style.backgroundColor 	= checkUser.settingColor;
						commentDocument[i+1].style.backgroundColor  = checkUser.settingColor;
						break;
					case '4':
						commentUserName.innerHTML += '(어글러)';
						break;
				}
			}
			return;
		}
	}
}//마이피 체크

function BoardCommentCheck(response) //blockType, checkUserList
{
	var checkUserList   = JSON.parse(response.data.aggrohuman).userCellInfo;
	var commentTable	= $('.comment_view_wrapper .comment_view.normal.row tbody tr')
	
	$(commentTable).each(function(index, object) {
		var writerName  = $(object).find('.user_inner_wrapper .nick a').text();
		var writerID	= $(object).find('.user_inner_wrapper .member_srl').text();
		var subject = object;
		
		writerID = writerID.substr(1, writerID.length-2);
		
		$(checkUserList).each(function(index, object){
			var userInfo = {
				writerName  : writerName,
				writerID	: writerID
			}
			var flag = userNodeCheck(subject, object, userInfo);
			if(flag) return;
		});
	});
}//function BoardCommentCheck - 댓글 어그로 체크

function BoardTableCheck(response)
{ 
	var checkUserList = JSON.parse(response.data.aggrohuman).userCellInfo;
	var boardTable = $('.board_list_table tbody tr');
	tableAddID(boardTable);
	
	$(boardTable).each(function(index, object) {
		var writerName  = $(object).find('.writer a').text();
		var writerID	= $(object).attr('itemID');
		var subject 	= object;
		$(checkUserList).each(function(index, object){
			var userInfo = {
				writerName  : writerName,
				writerID	: writerID
			}
			var flag = userNodeCheck(subject, object, userInfo);
			if(flag) return;
		});
	});
}//function BoadtTableCheck - 게시판 어그로 체크

function tableAddID(table)
{
	var boardTable = table;

	$(boardTable).each(function(index, object) {
		var writerID = $(object).find('.writer.text_over a').attr('onclick');
		if(typeof writerID === "string") {
			writerID = writerID.split(',')[2];
			writerID = writerID.split("'")[1];
			$(object).attr('itemID', writerID);
		}
	});
}

function convertID(mypiLink, cutchar)
{
	var returnData = mypiLink;
	returnData = returnData.split(cutchar)[1];
	returnData = returnData.substr(4, returnData.length);
	return returnData;
}//마이피 링크에서 ID 추출

function displayCheckCount(inputTable, inputCount)
{
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

function getClass(teg, name)
{
	for(var i=0;i<teg.length;i++)if(teg[i].className == name) return teg[i];
	return false;
}// 클래스 탐색

function hideTd(td)
{
	for(var i=0;i<td.length;i++) td[i].style.fontSize = '0px';
}

function changeTdColor(td, colorValue)
{
	for(var i=0;i<td.length;i++) td[i].style.backgroundColor = colorValue;
}//td색 변경 (리스트의 한줄부분임)

