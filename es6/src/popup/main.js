import Utility from '../common/utility';

class Popup {
    constructor() {
		chrome.runtime.sendMessage({type: "getCount"}, this.render);
    }
    
    render(data) {
        let ele = $('#userCounter').find('ul')[0];
    
		if (data.length > 0) {
			$(data).each((index, object) => {
			    console.log(object);
				let addEle = `<li>
								<label class="title"> ${object.title} </label>
								<span class="count">  ${object.count} </span>
								<ul class="logs">`;

				if (object.logs != undefined) {
					let logs = JSON.parse(object.logs);
					let keys = Object.keys(logs);
					
					if (keys.length > 0) {
						$(keys).each(function(index, key) {
							addEle = addEle + `<li> 
												 <label class="title"> ${logs[key].name} </label> 
												 <span class="count"> ${logs[key].count} </span>
											   </li>`;
						});
					} else {
						addEle = addEle `<li> 
											<label class="title"> 관리 유저 없음 </label> 
										 </li>`;
					}
				}

				addEle = addEle + '</ul> </li>'
				$(ele).append(addEle);
			});
		}
		
		Utility.logPrint('#005CFF', '정상 작동중');
    }
}

$(document).ready( () =>
{
	new Popup;
});