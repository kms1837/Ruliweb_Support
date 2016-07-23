
function save_json(jsonData) {
	var userNameKeys = {};
	var userIDKeys = {};
	
	$(jsonData).each(function(index, data) {
		if(data.name) userNameKeys[data.name] = index;
		if(data.ruliwebID) userIDKeys[data.ruliwebID] = index;
	});
	
	var dataFrom = {
		"userCellInfo": jsonData,
		"userNameKeys": userNameKeys, 
		"userIDKeys": userIDKeys
	}
	
	localStorage['aggrohuman'] = JSON.stringify(dataFrom);
}

function getDate()
{
  var date  = new Date();
  var year  = date.getFullYear();
  var month = date.getMonth()+1;
  var day   = date.getDate();

  if(month <10 ) month = '0' + month;
  if(day   <10 ) day   = '0' + day;

  return ''+year+'/'+month+'/'+day;
}//function getDate - 날짜값을 얻어옴