

$(document).ready(function()
{
	/*
	chrome.alarms.onAlarm.addListener(function(alarm) {
        appendToLog('예비!!');
     });
	*/
	runChecking();
	
});

function runChecking()
{
	var pageURL 		= location.href﻿;
	var pageUrlElement  = pageURL.split('/');
	var rootPageStatuse = pageURL.split('.')[0].substr(7);
	var pageStatuse 	= pageUrlElement[3];
	var pageStatuseType	= pageUrlElement[pageUrlElement.length-1].substr(0, 4);

	chrome.extension.sendRequest({method: "getLocalStorage", key: "blockType"}, function(response){
		var blockType 		= response.data.blockType;
		var aggroHumanList  = JSON.parse(response.data.aggrohuman).userCellInfo;
		console.log(pageUrlElement);
		console.log(rootPageStatuse);
		console.log(pageStatuse);
		console.log(pageStatuseType);
		
		if(blockType != 0 && aggroHumanList!='') {
			if(pageStatuse == "gaia") {
				BoardTableCheck(blockType, aggroHumanList);
				if(pageStatuseType == 'read') BoardCommentCheck(blockType, aggroHumanList);	
			}else if(pageStatuse == "news"){
				BoardCommentCheck(blockType, aggroHumanList);		
			}else if(rootPageStatuse == "mypi"){
				 console.log("마이피여");
				if(pageStatuseType == "mypi")	mypiCheck(blockType, aggroHumanList);
				else					  		mypiMainCheck(blockType, aggroHumanList);
			}
		}
	});
}

function mypiMainCheck(blockType, aggroHumanList)
{
	console.log('마이피 메인을 체크합니다.');
	var mypiMainDocument = $('.m_recently').find('tr');
	var mainTdUserName;
	var mainTdUserId;
	var mainTdElement;
	
	var checkCount = 0;
	
	for(var i=0; i<mypiMainDocument.length;i ++) {
		mainTdElement 	= $(mypiMainDocument[i]).find('td'); 
		mainTdUserName 	= mainTdElement[1];
		mainTdUserId 	= mainTdElement.find('a')[0].href.split('&')[1].substr(3);
		
		for(var y=0; y<aggroHumanList.length; y++) {
			if(mainTdUserName.outerText == aggroHumanList[y].name || mainTdUserId == 'asd') {
				checkCount++;
				switch(blockType){
					case '1': //글 제거
						mainTdElement[0].style.display = 'none';
						mainTdElement[1].style.display = 'none';
						break;
					case '2': //글 가리기
						mainTdElement[0].style.fontSize = '0px';
						mainTdElement[1].style.fontSize = '0px';
						break;
					case '3':
						mainTdUserName.innerHTML += '(어글러)';
						break;
					case '4':
						mypiMainDocument[i].style.backgroundColor = 'rgba(255, 224, 0, 1)';
						break;
				}
			}
		}
	}
}//마이피 메인

function mypiCheck(blockType, aggroHumanList)
{
	console.log("마이피를 체크합니다.");
	var commentDocument = $('.mypiReply').find('div');
	var commentUserClass;
	var commentUserName;
	var commentUserId;
	var checkCount = 0;
	
	for(var i=0; i<commentDocument.length; i=i+2) {
		commentUserClass = $(commentDocument[i]).find('.cm01');
		commentUserName  = commentUserClass.find('b')[0];
		commentUserId	 = commentUserClass.find('a')[0].href.split('?')[1].substr(3);
		
		for(var y=0; y<aggroHumanList.length; y++) {
			if(commentUserName.outerText == aggroHumanList[y].name || commentUserId == 'asd'){
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
						commentDocument[i].style.backgroundColor = 'rgba(255, 224, 0, 1)';
						commentDocument[i+1].style.backgroundColor = 'rgba(255, 224, 0, 1)';
						break;
				}
			}
		}
		
		console.log(commentUserName);
		console.log(commentUserId);
	}
	//console.log(commentDocument);
}//마이피 체크

function BoardCommentCheck(blockType, aggroHumanList) //blockType, aggroHumanList
{
	var commentDocument = $('#commentFrame')[0].contentDocument;
	var commentTable 	= $(commentDocument).find('#commentTable')[0];
	commentTable = $(commentTable).find('tbody')[0];
	var commentTableCell = $(commentTable).find('tr');
	
	$('#commentFrame').bind("load", runChecking);
	
	var checkCount = 0;
	
	console.log("2동작");
	
	for(var i=0; i<commentTableCell.length-1; i++) {
		if(commentTableCell[i].className != 'reply hide') {
			var selectCellName  = $(commentTableCell[i]).find('.nick_name')[0];
			selectCellName 		= $(selectCellName).find('.tit_name')[0];
			for(var y=0; y<aggroHumanList.length; y++) {
				if(selectCellName.outerText == aggroHumanList[y].name) {
					checkCount++;
					switch(blockType){
						case '1': //글 제거
							commentTableCell[i].style.display = 'none';
							break;
						case '2': //글 가리기
							hideTd(commentTableCell[i].getElementsByTagName('td'));
							break;
						case '3':
							selectCellName.innerHTML += '(어글러)';
							break;
						case '4':
							changeTdColor(commentTableCell[i].getElementsByTagName('td'));
							break;
					}
				}
			}//for - 어글러 목록
		}//if - 'reply hide' 웬지모르게 껴있어서 처리
	}//for - 댓글 테이블 셀
	//commentTableCell.length에서 -1은 tempRow라는게 마지막에 붙어서 빼줌
	
	if(checkCount > 0) displayCheckCount(commentTable, checkCount);

}//function BoardCommentCheck - 댓글 어그로 체크

function BoardTableCheck(blockType, aggroHumanList)
{ 
	console.log("동작");
	var searchTag;
	var getCenterTag = document.getElementById('mCenter'); // 센터 문서 객체 가져옴
	var getTable = getCenterTag.getElementsByTagName('table');
	var boardTable = getClass(getTable, 'tbl tbl_list_comm');
	
	searchTag = getClass(getTable, 'tbl tbl_list_comm').getElementsByTagName('tbody'); //tbl tbl_list_comm 테이블에서 tbody를 가져옴
	searchTag = searchTag[0].getElementsByTagName('tr');
	
	var checkCount = 0;
	
	if(searchTag[0].className != 'none') {
		for(var i=0;i<searchTag.length;i++) {
			var temptd 			= searchTag[i].getElementsByTagName('td');
			var getWriterName 	= getClass(temptd, 'writer').getElementsByTagName('a');

			for(var y=0; y<aggroHumanList.length; y++) {
				if(getWriterName[0].outerText==aggroHumanList[y].name){
					checkCount++;
					
					switch(blockType){
						case '1': // 글 제거
							searchTag[i].style.display = 'none';
							break;
						case '2': // 글 가리기
							hideTd(searchTag[i].getElementsByTagName('td'));
							break;
						case '3':
							getWriterName[0].innerHTML += '(어글러)';
							break;
						case '4':
							changeTdColor(searchTag[i].getElementsByTagName('td'));
							break;
					}
				}
			}//for - 어글러 목록
		}//for - 어글러 추출및 블럭
		
		if(checkCount > 0) displayCheckCount(boardTable, checkCount);	
	}//if - 게시물이 없을시
	
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
	inputTable.innerHTML = '<div id="checkResult"' +
							'style="position: absolute; right: 0; padding: 7px; background-color: #fff; width: 180px;' +
							'text-align: right; border: 3px solid rgba(0, 152, 207, 0.53);"' +
							'><p>' + inputCount + '개 차단완료</p></div>' + inputTable.innerHTML;
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

function changeTdColor(td)
{
	for(var i=0;i<td.length;i++) td[i].style.backgroundColor = 'rgba(255, 224, 0, 1)';
}//td색 변경 (리스트의 한줄부분임)

