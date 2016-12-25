
$(document).ready(function()
{
	init()
	runChecking();	
});

function init() 
{
	chrome.extension.sendMessage({type: "load"});

	$(document).mousedown(function(event) {
		if (seleteUser != undefined) {
			seleteUser.removeAttr('style');
			seleteUser = undefined;
		}
		
		if (event.button != 2 ) {
			var messageFrom = {
				type: "context",
				key: "doc_click"
			}
			chrome.extension.sendMessage(messageFrom);
		}
	});
}

function runChecking()
{
	var pageURL 		= window.location.href;
	var pageUrlElement  = pageURL.split('/');
	var rootPageStatuse = pageURL.split('.')[0].substr(7);
	var endPointStatuse	= pageUrlElement[pageUrlElement.length-1];
	var pageStatuse 	= pageUrlElement[3];
	var pageStatuseType	= pageUrlElement[pageUrlElement.length-2].substr(0, 4);

	chrome.extension.sendRequest({method: "getLocalStorage", key: ''}, function(response) {
		if (response.data != undefined) {
			var checkUserList  = JSON.parse(response.data.aggrohuman).userCellInfo;
			
			$.observer = new MutationObserver(function(mutations) {
				var tartgetName = $(mutations[0].target).attr('class');
				if (tartgetName === 'comment_view normal row') {
		    		BoardCommentCheck(response);
				}
			});

			var observerConfig = { childList: true};
						
			if (checkUserList!='') {
				if (pageStatuse === 'news' || endPointStatuse === 'review') {
					BoardCommentCheck(response);
					$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
					
				} else if (rootPageStatuse === 'mypi') {
					if(pageStatuse != '')	mypiCheck(response);
					else					mypiMainCheck(response);
					
				} else {
					BoardTableCheck(response);
					if (pageStatuseType === 'read') {
						BoardCommentCheck(response);
						$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
					}
				}
			}
		}
	});
}