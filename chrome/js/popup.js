$(function() {
	chrome.runtime.sendMessage({type: "getCount"}, function(data) {
		var ele = $('#userCounter').find('ul')[0];

		if(data.length > 0) {
			$(data).each(function(index, object) {
				var addEle = '<li>' +
								'<label class="title">' + object.title + '</label>' +
								'<span class="count">'  + object.count + '</span>' +
								'<ul class="logs">';

				if(object.logs != undefined) {
					var logs = JSON.parse(object.logs);
					var keys = Object.keys(logs);
					if(keys.length > 0) {
						$(keys).each(function(index, key) {
							addEle = addEle + '<li>' + 
												'<label class="title">' + logs[key].name + '</label>' + 
												'<span class="count">' + logs[key].count + '</span>' + 
											'</li>';
						});
					} else {
						addEle = addEle + '<li>' + 
											'<label class="title"> 관리 유저 없음 </label>' + 
										'</li>';
					}
				}

				addEle = addEle + '</ul> </li>'
				$(ele).append(addEle);

				
			});
		}

		
		logPrint('#005CFF', '정상 작동중');
	});
});
