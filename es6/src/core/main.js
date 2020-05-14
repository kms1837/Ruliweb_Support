
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
		
		$(document).mouseover( () => {
			Common.resetContext();
		});

		$(document).mousedown(() => {
			Common.resetContext();
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
		let pageURL = window.location.href;
		let pageUrlElement = pageURL.split('/');
		let rootPageStatuse = pageURL.split('.')[0].substr(7);
		let endPointStatuse	= pageUrlElement[pageUrlElement.length-1];
		let pageStatuse = pageUrlElement[3];
		let pageStatuseType	= pageUrlElement[pageUrlElement.length-2].substr(0, 4);
		let parm = pageURL.split('?')[1];

		StorageIO.getData().then( data => {
			this.observer = new MutationObserver( mutations => {
				let tartgetName = $(mutations[0].target).attr('class');
				if (tartgetName === 'comment_container') {
					BoardCheck.boardCommentCheck(data);
				}
			});

			let observerConfig = {
				childList: true, 
				subtree: true
			};
			
			if (rootPageStatuse === 'mypi') {
				if(pageStatuse != '') {
					if (parm.split('=')[0] === 'cate')
						MypiCheck.mypiCateCheck(data);
					else
						MypiCheck.mypiCheck(data);
				}
				else {
					MypiCheck.mypiMainCheck(data);
				}
			} 
			else {
				BoardCheck.boardTableCheck(data);
				if (pageStatuseType === 'read') {
					BoardCheck.boardCommentCheck(data);
					this.observer.observe($('.comment_container')[0], observerConfig);
				}
			}
		});
	}
}

$(document).ready( () =>
{
	new Core;
});
