/*window.onload = function(){ //document.body.onload == window.onload
}
*/

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage")
		if(request.key == "noteCount") sendResponse({data: localStorage['noteCount']});
		else sendResponse({data: localStorage});
		//[request.key]
		
	else
		sendResponse({});
});