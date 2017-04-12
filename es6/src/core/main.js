
import BoardCheck from './board_check';
import MypiCheck from './mypi_check';
import Common from './common';

import StorageIO from '../common/storageIO';

class Core {
	constructor() {
		this.init();
		this.runChecking();
		
		this.init = this.init.bind(this);
		this.runChecking = this.runChecking.bind(this);
	}
	
	init() {
		chrome.extension.sendMessage({type: "load"});
	
		$(document).mousedown( event => {
			if (Common.seleteUser != undefined) {
				Common.seleteUser.removeAttr('style');
				Common.seleteUser = undefined;
			}
			
			if (event.button != 2 ) {
				let messageFrom = {
					type: "context",
					key: "doc_click"
				}
				chrome.extension.sendMessage(messageFrom);
			}
		});
	}
	
	runChecking() {
		let pageURL 		= window.location.href;
		let pageUrlElement  = pageURL.split('/');
		let rootPageStatuse = pageURL.split('.')[0].substr(7);
		let endPointStatuse	= pageUrlElement[pageUrlElement.length-1];
		let pageStatuse 	= pageUrlElement[3];
		let pageStatuseType	= pageUrlElement[pageUrlElement.length-2].substr(0, 4);
	
		//chrome.extension.sendRequest({method: "getLocalStorage", key: ''},
        StorageIO.getData( data => {
				if (Object.keys(data).length > 0) {
					let userList  = data.userList
					
					$.observer = new MutationObserver( (mutations) => {
						let tartgetName = $(mutations[0].target).attr('class');
						if (tartgetName === 'comment_view normal row') {
				    		BoardCheck.boardCommentCheck(data);
						}
					});
		
					let observerConfig = { childList: true};
								
					if (userList.length > 0) {
						if (pageStatuse === 'news' || endPointStatuse === 'review') {
							BoardCheck.boardCommentCheck(data);
							$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
							
						} else if (rootPageStatuse === 'mypi') {
							if(pageStatuse != '')	MypiCheck.mypiCheck(data);
							else					MypiCheck.mypiMainCheck(data);
							
						} else {
							BoardCheck.boardTableCheck(data);
							if (pageStatuseType === 'read') {
								BoardCheck.boardCommentCheck(data);
								$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
							}
						}
					}
				}
		});
	}
}

$(document).ready( () =>
{
	new Core;
});
