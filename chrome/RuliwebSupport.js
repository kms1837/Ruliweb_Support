

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
	var rootPageStatuse = pageURL.split('.')[0].substr(7);;
	var pageStatuse		= pageUrlElement[pageUrlElement.length-1].substr(0, 4);

	chrome.extension.sendRequest({method: "getLocalStorage", key: "blockType"}, function(response){
		var blockType 		= response.data.blockType;
		var aggroHumanList  = JSON.parse(response.data.aggrohuman).userCellInfo;
		
		if(rootPageStatuse == "ruliweb" || rootPageStatuse == "bbs2") {
			if(pageStatuse =='list' || pageStatuse == 'read'){
				//console.log("정상실행");
				if(blockType != 0 && aggroHumanList!=''){
					BoardTableCheck(blockType, aggroHumanList);
					if(pageStatuse == 'read') BoardCommentCheck(blockType, aggroHumanList);	
				}
			}
		}else if(rootPageStatuse == "mypi"){
			//TO-DO : 마이피 차단
		}
	});
}

function BoardCommentCheck(blockType, aggroHumanList) //blockType, aggroHumanList
{
	var commentDocument = $('#commentFrame')[0].contentDocument;
	var commentTable 	= $(commentDocument).find('#commentTable')[0];
	commentTable = $(commentTable).find('tbody')[0];
	var commentTableCell = $(commentTable).find('tr');
	
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
							commentTableCell[i].style.fontSize = '0px';
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

function mypiBoardTableCheck()
{

}//function mypiBoardTableCheck - 마이피 게시판 어그로 체크

function BoardTableCheck(blockType, aggroHumanList)
{ 
	console.log("동작");
	var getCenterTag = document.getElementById('mCenter'); // 센터 문서 객체 가져옴
	var getdiv = getCenterTag.getElementsByTagName('div'); // div를 모두 가져옴

	var searchTag;
	searchTag = getClass(getdiv, 'gaia').getElementsByTagName('table'); //gain의 모든 table를 가져옴
	
	var boardTable = getClass(searchTag, 'tbl tbl_list_comm');
	searchTag = getClass(searchTag, 'tbl tbl_list_comm').getElementsByTagName('tbody'); //tbl tbl_list_comm 테이블에서 tbody를 가져옴
	searchTag = searchTag[0].getElementsByTagName('tr');
	
	var checkCount = 0;
	
	if(searchTag[0].className != 'none'){
		for(var i=0;i<searchTag.length;i++){
			var temptd 			= searchTag[i].getElementsByTagName('td');
			var getWriterName 	= getClass(temptd, 'writer').getElementsByTagName('a');

			for(var y=0; y<aggroHumanList.length; y++){
				if(getWriterName[0].outerText==aggroHumanList[y].name){
					checkCount++;
					
					switch(blockType){
						case '1': // 글 제거
							searchTag[i].style.display = 'none';
							break;
						case '2': // 글 가리기
							searchTag[i].style.fontsize = '0px';
							break;
						case '3':
							getWriterName[0].innerHTML += '(어글러)';
							break;
						case '3':
							changeTdColor(searchTag[i].getElementsByTagName('td'));
							break;
					}
				}
			}//for - 어글러 목록
		}//for - 어글러 추출및 블럭
		
		if(checkCount > 0) displayCheckCount(boardTable, checkCount);
		
	}//if - 게시물이 없을시
	
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

}//function BoadtTableCheck - 게시판 어그로 체크

function displayCheckCount(inputTable, inputCount)
{
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

function changeTdColor(td)
{
	for(var i=0;i<td.length;i++) td[i].style.backgroundColor = 'rgba(255, 224, 0, 1)';
}//td색 변경 (리스트의 한줄부분임)

