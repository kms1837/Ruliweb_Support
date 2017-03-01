
import BoardCheck from './board_check';
import MypiCheck from './mypi_check';
import Commmon from './common'

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
			if (Commmon.seleteUser != undefined) {
				Commmon.seleteUser.removeAttr('style');
				Commmon.seleteUser = undefined;
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
	
		chrome.extension.sendRequest({method: "getLocalStorage", key: ''}, 
			response => {
				if (response.data != undefined) {
					let checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
					
					$.observer = new MutationObserver( (mutations) => {
						let tartgetName = $(mutations[0].target).attr('class');
						if (tartgetName === 'comment_view normal row') {
				    		BoardCheck.BoardCommentCheck(response);
						}
					});
		
					let observerConfig = { childList: true};
								
					if (checkUserList!='') {
						if (pageStatuse === 'news' || endPointStatuse === 'review') {
							BoardCheck.BoardCommentCheck(response);
							$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
							
						} else if (rootPageStatuse === 'mypi') {
							if(pageStatuse != '')	MypiCheck.mypiCheck(response);
							else					MypiCheck.mypiMainCheck(response);
							
						} else {
							BoardCheck.BoardTableCheck(response);
							if (pageStatuseType === 'read') {
								BoardCheck.BoardCommentCheck(response);
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