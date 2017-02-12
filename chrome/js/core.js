/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _board_check = __webpack_require__(2);

	var _board_check2 = _interopRequireDefault(_board_check);

	var _mypi_check = __webpack_require__(4);

	var _mypi_check2 = _interopRequireDefault(_mypi_check);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	$(document).ready(function () {
		init();
		runChecking();
	});

	function init() {
		chrome.extension.sendMessage({ type: "load" });

		$(document).mousedown(function (event) {
			if (seleteUser != undefined) {
				seleteUser.removeAttr('style');
				seleteUser = undefined;
			}

			if (event.button != 2) {
				var messageFrom = {
					type: "context",
					key: "doc_click"
				};
				chrome.extension.sendMessage(messageFrom);
			}
		});
	}

	function runChecking() {
		var pageURL = window.location.href;
		var pageUrlElement = pageURL.split('/');
		var rootPageStatuse = pageURL.split('.')[0].substr(7);
		var endPointStatuse = pageUrlElement[pageUrlElement.length - 1];
		var pageStatuse = pageUrlElement[3];
		var pageStatuseType = pageUrlElement[pageUrlElement.length - 2].substr(0, 4);

		chrome.extension.sendRequest({ method: "getLocalStorage", key: '' }, function (response) {
			if (response.data != undefined) {
				var checkUserList = JSON.parse(response.data.aggrohuman).userCellInfo;

				$.observer = new MutationObserver(function (mutations) {
					var tartgetName = $(mutations[0].target).attr('class');
					if (tartgetName === 'comment_view normal row') {
						_board_check2.default.BoardCommentCheck(response);
					}
				});

				var observerConfig = { childList: true };

				if (checkUserList != '') {
					if (pageStatuse === 'news' || endPointStatuse === 'review') {
						_board_check2.default.BoardCommentCheck(response);
						$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
					} else if (rootPageStatuse === 'mypi') {
						if (pageStatuse != '') _mypi_check2.default.mypiCheck(response);else _mypi_check2.default.mypiMainCheck(response);
					} else {
						_board_check2.default.BoardTableCheck(response);
						if (pageStatuseType === 'read') {
							_board_check2.default.BoardCommentCheck(response);
							$.observer.observe($('.comment_view_wrapper .comment_view.normal.row')[0], observerConfig);
						}
					}
				}
			}
		});
	}

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utility = __webpack_require__(3);

	var _utility2 = _interopRequireDefault(_utility);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BoardCheck = function () {
	    function BoardCheck() {
	        _classCallCheck(this, BoardCheck);
	    }

	    _createClass(BoardCheck, null, [{
	        key: 'boardTableCheck',
	        value: function boardTableCheck(response) {
	            var boardTable = $('.board_list_table tbody tr');
	            var count = 0;
	            var logs = {};

	            _utility2.default.tableAddID(boardTable);

	            $(boardTable).each(function (index, object) {
	                var writerEle = $(object).find('.writer');
	                var writerName = $(object).find('.writer a').text();
	                var writerID = $(object).attr('itemID');
	                var subject = object;

	                if (writerName === '') {
	                    writerName = $(object).find('.writer').text();
	                    writerEle.contextmenu(contextMenu);
	                } else {
	                    $(object).find('.writer a').contextmenu(contextMenu);
	                }

	                var userInfo = {
	                    writerName: writerName,
	                    writerID: writerID
	                };

	                var countFlag = _utility2.default.userNodeCheck(response.data.aggrohuman, subject, userInfo);

	                if (countFlag) {
	                    var defaultInfo = {
	                        name: writerName,
	                        id: writerID,
	                        count: 0
	                    };
	                    if (logs[writerName] === undefined) logs[writerName] = defaultInfo;
	                    logs[writerName].count = parseInt(logs[writerName].count) + 1;
	                }

	                count = countFlag ? count + 1 : count;
	            });

	            var countFrom = {
	                title: 'board',
	                count: count,
	                logs: JSON.stringify(logs)
	            };

	            _utility2.default.displayCheckCount(countFrom);
	        } //function BoadtTableCheck - 게시판 어그로 체크

	    }, {
	        key: 'BoardCommentCheck',
	        value: function BoardCommentCheck(response) //blockType, checkUserList
	        {
	            var commentTable = $('.comment_view_wrapper .comment_view.normal.row tbody tr');
	            var commentBast = $('.comment_view_wrapper .comment_view.best.row tbody tr');
	            var count = 0;
	            var logs = {};

	            $(commentBast).each(function (index, object) {
	                var writerName = $(object).find('.user_inner_wrapper .nick a').text();
	                var writerID = $(object).find('.user_inner_wrapper .member_srl').text();
	                var subject = object;

	                writerID = writerID.substr(1, writerID.length - 2);

	                $(object).find('.user_inner_wrapper .nick a').contextmenu(contextMenu);

	                var userInfo = {
	                    writerName: writerName,
	                    writerID: writerID
	                };

	                var countFlag = _utility2.default.userNodeCheck(response.data.aggrohuman, subject, userInfo);

	                if (countFlag) {
	                    var defaultInfo = {
	                        name: writerName,
	                        id: writerID,
	                        count: 0
	                    };
	                    if (logs[writerName] === undefined) logs[writerName] = defaultInfo;
	                    logs[writerName].count = parseInt(logs[writerName].count) + 1;
	                }

	                count = countFlag ? count + 1 : count;
	            });

	            $(commentTable).each(function (index, object) {
	                var writerName = $(object).find('.user_inner_wrapper .nick a').text();
	                var writerID = $(object).find('.user_inner_wrapper .member_srl').text();
	                var subject = object;

	                writerID = writerID.substr(1, writerID.length - 2);

	                $(object).find('.user_inner_wrapper .nick a').contextmenu(contextMenu);

	                var userInfo = {
	                    writerName: writerName,
	                    writerID: writerID
	                };

	                var countFlag = _utility2.default.userNodeCheck(response.data.aggrohuman, subject, userInfo);

	                if (countFlag) {
	                    var defaultInfo = {
	                        name: writerName,
	                        id: writerID,
	                        count: 0
	                    };

	                    if (logs[writerName] === undefined) logs[writerName] = defaultInfo;
	                    logs[writerName].count = parseInt(logs[writerName].count) + 1;
	                }

	                count = countFlag ? count + 1 : count;
	            });

	            var countFrom = {
	                title: 'comment',
	                count: count,
	                logs: JSON.stringify(logs)
	            };

	            _utility2.default.displayCheckCount(countFrom);
	        } //function BoardCommentCheck - 댓글 어그로 체크

	    }]);

	    return BoardCheck;
	}();

	exports.default = BoardCheck;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	    core의 기타함수를 모아놨습니다.
	*/

	var Utility = function () {
	    function Utility() {
	        _classCallCheck(this, Utility);
	    }

	    _createClass(Utility, null, [{
	        key: 'tableAddID',
	        value: function tableAddID(table) {
	            var boardTable = table;

	            $(boardTable).each(function (index, object) {
	                var writerID = $(object).find('.writer.text_over a').attr('onclick');
	                if (typeof writerID === "string") {
	                    writerID = writerID.split(',')[2];
	                    writerID = writerID.split("'")[1];
	                    $(object).attr('itemID', writerID);
	                }
	            });
	        }
	    }, {
	        key: 'convertID',
	        value: function convertID(mypiLink, cutchar) {
	            var returnData = mypiLink;
	            returnData = returnData.split(cutchar)[1];
	            returnData = returnData.substr(4, returnData.length);
	            return returnData;
	        } //마이피 링크에서 ID 추출

	    }, {
	        key: 'displayCheckCount',
	        value: function displayCheckCount(inputCountFrom) {
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
	    }, {
	        key: 'getClass',
	        value: function getClass(teg, name) {
	            for (var i = 0; i < teg.length; i++) {
	                if (teg[i].className == name) return teg[i];
	            }
	            return false;
	        } // 클래스 탐색

	    }, {
	        key: 'hideTd',
	        value: function hideTd(td) {
	            for (var i = 0; i < td.length; i++) {
	                td[i].style.fontSize = '0px';
	            }
	        }
	    }, {
	        key: 'changeTdColor',
	        value: function changeTdColor(td, colorValue) {

	            for (var i = 0; i < td.length; i++) {
	                $(td[i]).attr('style', 'background-color: ' + colorValue + ' !important;');
	            }
	        } //td색 변경 (리스트의 한줄부분임)

	    }]);

	    return Utility;
	}();

	exports.default = Utility;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utility = __webpack_require__(3);

	var _utility2 = _interopRequireDefault(_utility);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MypiCheck = function () {
	    function MypiCheck() {
	        _classCallCheck(this, MypiCheck);
	    }

	    _createClass(MypiCheck, [{
	        key: 'mypiMainCheck',
	        value: function mypiMainCheck(response) {
	            var mypiMainTable = $('.m_recently tbody tr');
	            var count = 0;
	            var logs = {};

	            $(mypiMainTable).each(function (index, object) {
	                var subject = object;
	                var userTd = $(object).find('td');
	                var writerName = userTd.eq(1).text();
	                var writerID = $(object).find('a')[0].href;

	                writerID = _utility2.default.convertID(writerID, '&');

	                var userInfo = {
	                    writerName: writerName,
	                    writerID: writerID
	                };

	                var countFlag = _utility2.default.userNodeCheck(response.data.aggrohuman, subject, userInfo);

	                if (countFlag) {
	                    var defaultInfo = {
	                        name: writerName,
	                        id: writerID,
	                        count: 0
	                    };
	                    if (logs[writerName] === undefined) logs[writerName] = defaultInfo;
	                    logs[writerName].count = parseInt(logs[writerName].count) + 1;
	                }

	                count = countFlag ? count + 1 : count;
	            });

	            var countFrom = {
	                title: 'MypiMain',
	                count: count,
	                logs: JSON.stringify(logs)
	            };

	            _utility2.default.displayCheckCount(countFrom);
	        } //마이피 메인

	    }, {
	        key: 'mypiCheck',
	        value: function mypiCheck(response) {
	            var data = JSON.parse(response.data.aggrohuman);
	            var userInfoList = data.userCellInfo;
	            var count = 0;
	            var logs = {};

	            var commentDocument = $('#mCenter tbody .mypiReply').find('div');
	            var commentUserClass = void 0;
	            var commentUserName = void 0;
	            var commentUserId = void 0;

	            for (var i = 0; i < commentDocument.length; i = i + 2) {
	                commentUserClass = $(commentDocument[i]).find('.cm01');
	                commentUserName = commentUserClass.find('b')[0];
	                commentUserId = commentUserClass.find('a')[0].href.split('?')[1].substr(3);

	                var infoIndex = data.userNameKeys[commentUserName] ? data.userNameKeys[commentUserName] : data.userIDKeys[commentUserId];

	                if (infoIndex != undefined) {
	                    var user = userInfoList[infoIndex];
	                    switch (parseInt(user.settingType)) {
	                        case '1':
	                            //글 제거
	                            commentDocument[i].style.display = 'none';
	                            commentDocument[i + 1].style.display = 'none';
	                            break;
	                        case '2':
	                            //글 가리기
	                            commentDocument[i].style.fontSize = '0px';
	                            commentDocument[i + 1].style.fontSize = '0px';
	                            break;
	                        case '3':
	                            commentDocument[i].style.backgroundColor = user.settingColor;
	                            commentDocument[i + 1].style.backgroundColor = user.settingColor;
	                            break;
	                        case '4':
	                            commentUserName.innerHTML += '(어글러)';
	                            break;
	                    }
	                    var defaultInfo = {
	                        name: writerName,
	                        id: writerID,
	                        count: 0
	                    };
	                    if (logs[writerName] === undefined) logs[writerName] = defaultInfo;
	                    logs[writerName].count = parseInt(logs[writerName].count) + 1;
	                    count++;
	                }
	            }

	            var countFrom = {
	                title: 'MypiComment',
	                count: count,
	                logs: JSON.stringify(logs)
	            };

	            _utility2.default.displayCheckCount(countFrom);
	        } //마이피 체크

	    }, {
	        key: 'mypiCateCheck',
	        value: function mypiCateCheck(response) {
	            var mypiCateTable = $('#mypilist tbody tr');
	            var count = 0;
	            var logs = {};

	            $(mypiCateTable).each(function (index, object) {
	                var subject = object;
	                var userTd = $(object).find('td');
	                var writerName = userTd.eq(1).text();
	                var writerID = userTd.eq(0).find('.mypicto3').find('a')[0];

	                writerID = writerID ? _utility2.default.convertID(writerID.href.split('?')[1], '&') : '';

	                var userInfo = {
	                    writerName: writerName,
	                    writerID: writerID
	                };

	                var countFlag = _utility2.default.userNodeCheck(response.data.aggrohuman, subject, userInfo);

	                if (countFlag) {
	                    var defaultInfo = {
	                        name: writerName,
	                        id: writerID,
	                        count: 0
	                    };
	                    if (logs[writerName] === undefined) logs[writerName] = defaultInfo;
	                    logs[writerName].count = parseInt(logs[writerName].count) + 1;
	                }

	                count = countFlag ? count + 1 : count;
	            });

	            var countFrom = {
	                title: 'MypiCate',
	                count: count,
	                logs: JSON.stringify(logs)
	            };

	            _utility2.default.displayCheckCount(countFrom);
	        }
	    }]);

	    return MypiCheck;
	}();

	;

	exports.default = MypiCheck;

/***/ }
/******/ ]);