
$(document).ready(function()
{
	/*
	chrome.alarms.onAlarm.addListener(function(alarm) {
        appendToLog('예비!!');
     });
	*/

	var pageURL 		= location.href﻿;
	var pageUrlElement  = pageURL.split('/');
	var pagestatuse			= pageUrlElement[pageUrlElement.length-1].substr(0, 4);

	if(pagestatuse=='list' || pagestatuse == 'read'){
		//console.log("정상실행");
		chrome.extension.sendRequest({method: "getLocalStorage", key: "blockType"}, function(response){
			var blockType 		= response.data.blockType;
			var aggroHumanList  = JSON.parse(response.data.aggrohuman).userCellInfo;

			if(blockType != 0 && aggroHumanList!=''){
				BoardTableCheck(blockType, aggroHumanList);
				if(pagestatuse == 'read') BoardCommentCheck(blockType, aggroHumanList);	
			}
		});

	}
});

function BoardCommentCheck(blockType, aggroHumanList) //blockType, aggroHumanList
{
	var commentDocument = $('#commentFrame')[0].contentDocument;
	var commentTable 	= $(commentDocument).find('#commentTable')[0];
	commentTable = $(commentTable).find('tbody')[0];
	var commentTableCell = $(commentTable).find('tr');

	for(var i=0; i<commentTableCell.length-1; i++){
		if(commentTableCell[i].className != 'reply hide'){
			var selectCellName  = $(commentTableCell[i]).find('.nick_name')[0];
			selectCellName 		= $(selectCellName).find('.tit_name')[0];
			for(var y=0; y<aggroHumanList.length; y++){
				if(selectCellName.outerText==aggroHumanList[y].name){
					switch(blockType){
						case '1':
							commentTableCell[i].style.display = 'none';
							break;
						case '2':
							selectCellName.innerHTML += '(어글러)';
							break;
						case '3':
							changeTdColor(commentTableCell[i].getElementsByTagName('td'));
							break;
					}
				}
			}//for - 어글러 목록
		}//if - 'reply hide' 웬지모르게 껴있어서 처리
	}//for - 댓글 테이블 셀
	//commentTableCell.length에서 -1은 tempRow라는게 마지막에 붙어서 빼줌

}//function BoardCommentCheck - 댓글 어그로 체크

function BoardTableCheck(blockType, aggroHumanList)
{ 
	var getCenterTag = document.getElementById('mCenter'); // 센터 문서 객체 가져옴
	var getdiv = getCenterTag.getElementsByTagName('div'); // div를 모두 가져옴

	var searchTag;
	searchTag = getClass(getdiv, 'gaia').getElementsByTagName('table'); //gain의 모든 table를 가져옴
	searchTag = getClass(searchTag, 'tbl tbl_list_comm').getElementsByTagName('tbody'); //tbl tbl_list_comm 테이블에서 tbody를 가져옴
	searchTag = searchTag[0].getElementsByTagName('tr');
	if(searchTag[0].className != 'none'){
		for(var i=0;i<searchTag.length;i++){
			var temptd 			= searchTag[i].getElementsByTagName('td');
			var getWriterName 	= getClass(temptd, 'writer').getElementsByTagName('a');

			for(var y=0; y<aggroHumanList.length; y++){
				if(getWriterName[0].outerText==aggroHumanList[y].name){
					switch(blockType){
						case '1':
							searchTag[i].style.display = 'none';
							break;
						case '2':
							getWriterName[0].innerHTML += '(어글러)';
							break;
						case '3':
							changeTdColor(searchTag[i].getElementsByTagName('td'));
							break;
					}
				}
			}//for - 어글러 목록
		}//for - 어글러 추출및 블럭
	}//if - 게시물이 없을시

}//function BoadtTableCheck - 게시판 어그로 체크

function getClass(teg, name)
{
	for(var i=0;i<teg.length;i++)if(teg[i].className == name) return teg[i];
	return false;
}// 클래스 탐색

function changeTdColor(td)
{
	for(var i=0;i<td.length;i++) td[i].style.backgroundColor = 'rgba(255, 224, 0, 1)';
}//td색 변경 (리스트의 한줄부분임)

/*
function noteCheck()
{
	chrome.extension.sendRequest({method: "getLocalStorage", key: "noteCount"}, function(response){
		console.log(response);
		$.get('http://mypi.ruliweb.daum.net/memo.htm', function(data){
			temp 		= $(data).find(".my_pib4");
			temp 		= temp[3].outerText;
			var start 	= temp.search(':')  +1;
			var end 	= temp.search('개') -1;

			temp = temp.substring(start, end);
			temp = parseInt(temp);

			response.data.noteCount = temp;
			console.log(response.data);
		});

		// 쪽지알람
		window.setInterval(function(){
			$.get('http://mypi.ruliweb.daum.net/memo.htm', function(data){
				temp 		= $(data).find(".my_pib4");
				temp 		= temp[3].outerText;
				var start 	= temp.search(':')  +1;
				var end 	= temp.search('개') -1;

				temp = temp.substring(start, end);
				temp = parseInt(temp);
				console.log(temp);
				if(response.data.noteCount < temp){
					alert('쪽지도착');
					console.log(temp);
					response.data = temp;
				}
			});
		},  10000); //window.setInterval
	});//chrome.extension.sendRequest(쪽지알람 기능)
}//function 쪽지알람
*/

/*
function getNoteCount()
{
	$.get('http://mypi.ruliweb.daum.net/memo.htm', function(data){
		var temp;
		temp 		= $(data).find(".my_pib4");
		temp 		= temp[3].outerText;
		var start 	= temp.search(':')  +1;
		var end 	= temp.search('개') -1;

		temp = temp.substring(start, end);
		temp = parseInt(temp);
		console.log(temp);

		return temp;
	});
	return temp;
}
*/