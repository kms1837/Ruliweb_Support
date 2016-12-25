
class Utility
{
    tableAddID(table)
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
    
    convertID(mypiLink, cutchar)
    {
    	var returnData = mypiLink;
    	returnData = returnData.split(cutchar)[1];
    	returnData = returnData.substr(4, returnData.length);
    	return returnData;
    }//마이피 링크에서 ID 추출
    
    displayCheckCount(inputCountFrom)
    {
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
    
    getClass(teg, name)
    {
    	for(var i=0;i<teg.length;i++) if(teg[i].className == name) return teg[i];
    	return false;
    }// 클래스 탐색
    
    hideTd(td)
    {
    	for(var i=0;i<td.length;i++) td[i].style.fontSize = '0px';
    }
    
    changeTdColor(td, colorValue)
    {
    
    	for(var i=0;i<td.length;i++) {
    		$(td[i]).attr('style', 'background-color :' + colorValue + ' !important;');
    	}
    }//td색 변경 (리스트의 한줄부분임)
}

export default Utility