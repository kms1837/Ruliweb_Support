
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

	chrome.extension.sendRequest({method: "getLocalStorage", key: "blockType"}, function(response){
		var blockType 		= response.data.blockType;
		var checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
		
		if(blockType != 0 && checkUserList!='') {
			if(pageStatuse == 'news'){
				BoardCommentCheck(response);
				
			}else if(rootPageStatuse == 'mypi'){
				if(pageStatuseType == 'mypi')	mypiCheck(response);
				else					  		mypiMainCheck(response);
				
			} else {
				BoardTableCheck(response);
				if(pageStatuseType == 'read') BoardCommentCheck(response);
			}
		}
	});
}

function mypiMainCheck(response)
{
	var checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
	
	var mypiMainDocument = $('.m_recently').find('tr');
	var mainTdUserName;
	var mainTdUserId;
	var mainTdElement;
	
	var checkCount = 0;
	
	for(var i=0; i<mypiMainDocument.length;i ++) {
		mainTdElement 	= $(mypiMainDocument[i]).find('td'); 
		mainTdUserName 	= mainTdElement[1];
		mainTdUserId 	= mainTdElement.find('a')[0].href.split('&')[1].substr(3);
		
		for(var y=0; y<checkUserList.length; y++) {
			if(mainTdUserName.outerText == checkUserList[y].name || mainTdUserId == 'asd') {
				checkCount++;
				switch(blockType){
					case '1': //글 제거
						mypiMainDocument[i].style.display = 'none';
						break;
					case '2': //글 가리기
						mainTdElement[0].style.fontSize = '0px';
						mainTdElement[1].style.fontSize = '0px';
						break;
					case '3':
						mainTdUserName.innerHTML += '(어글러)';
						break;
					case '4':
						mypiMainDocument[i].style.backgroundColor = blockColor;
						break;
				}
			}
		}
	}
}//마이피 메인

function mypiCheck(response)
{
	var checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
	
	var commentDocument = $('.mypiReply').find('div');
	var commentUserClass;
	var commentUserName;
	var commentUserId;
	var checkCount = 0;
	
	for(var i=0; i<commentDocument.length; i=i+2) {
		commentUserClass = $(commentDocument[i]).find('.cm01');
		commentUserName  = commentUserClass.find('b')[0];
		commentUserId	 = commentUserClass.find('a')[0].href.split('?')[1].substr(3);
		
		for(var y=0; y<checkUserList.length; y++) {
			if(commentUserName.outerText == checkUserList[y].name || commentUserId == 'asd'){
				checkCount++;
				switch(blockType){
					case '1': //글 제거
						commentDocument[i].style.display = 'none';
						commentDocument[i+1].style.display = 'none';
						break;
					case '2': //글 가리기
						commentDocument[i].style.fontSize = '0px';
						commentDocument[i+1].style.fontSize = '0px';
						break;
					case '3':
						commentUserName.innerHTML += '(어글러)';
						break;
					case '4':
						commentDocument[i].style.backgroundColor 	= blockColor;
						commentDocument[i+1].style.backgroundColor  = blockColor;
						break;
				}
			}
		}
	}
}//마이피 체크

function BoardCommentCheck(response) //blockType, checkUserList
{
	var checkUserList   = JSON.parse(response.data.aggrohuman).userCellInfo;
	var commentTable	= $('.comment_view_wrapper .comment_view.normal.row tbody tr')
	
	$(commentTable).each(function(index, object){
		var writerName  = $(object).find('.user_inner_wrapper .nick a').text();
		var writerID	= $(object).find('.user_inner_wrapper .member_srl').text();
		var subject = object;
		
		writerID = writerID.substr(1, writerID.length-2);
		
		$(checkUserList).each(function(index, object){
			if(writerName === object.name || writerID === object.ruliwebID) {
				switch(parseInt(object.settingType)){
					case 1: // 글 제거
						$(subject).css('display', 'none');
						break;
					case 2: // 글 가리기
						hideTd($(subject).find('td'));
						break;
					case 3:
						changeTdColor($(subject).find('td'), object.settingColor);
						break;
					case 4:
						$(object).find('.writer a').text('어그로');
						break;
				}
			}
		});
	});
}//function BoardCommentCheck - 댓글 어그로 체크

function BoardTableCheck(response)
{ 
	var checkUserList = JSON.parse(response.data.aggrohuman).userCellInfo;
	var boardTable = $('.board_list_table tbody tr');
	
	$(boardTable).each(function(index, object){
		var writerName = $(object).find('.writer a').text();
		var subject = object;
		$(checkUserList).each(function(index, object){
			if(writerName === object.name) {
				switch(parseInt(object.settingType)){
					case 1: // 글 제거
						$(subject).css('display', 'none');
						break;
					case 2: // 글 가리기
						hideTd($(subject).find('td'));
						break;
					case 3:
						changeTdColor($(subject).find('td'), object.settingColor);
						break;
					case 4:
						$(object).find('.writer a').text('어그로');
						break;
				}
			}
		});
	});
}//function BoadtTableCheck - 게시판 어그로 체크

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

