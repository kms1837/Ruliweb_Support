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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utility = __webpack_require__(1);

	var _utility2 = _interopRequireDefault(_utility);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Background = function () {
		function Background() {
			_classCallCheck(this, Background);
		}

		_createClass(Background, [{
			key: 'init',
			value: function init() {
				counts = [];
				contextFlag = false;
			}
		}, {
			key: 'messageProcess',
			value: function messageProcess(request, sender, sendResponse) {
				switch (request.type) {
					case 'load':
						this.init();
						break;
					case 'context':
						this.context(request);
						break;
					case 'count':
						this.count(request);
						break;
					case 'getCount':
						sendResponse(counts);
						break;
					default:
						break;
				}
			}
		}, {
			key: 'count',
			value: function count(inForm) {
				counts.push(inForm);
			}
		}, {
			key: 'context',
			value: function context(inForm) {
				if (inForm.key === 'adduser') {
					userInfo = inForm.userName;
					var userForm = {
						'title': '유저추가(' + userInfo + ')',
						'contexts': ['page', 'selection', 'link', 'editable', 'image'],
						onclick: _utility2.default.addUser
					};

					if (contextFlag) {
						chrome.contextMenus.update('adduser', userForm);
					} else {
						userForm['id'] = 'adduser';
						chrome.contextMenus.create(userForm);
					}

					contextFlag = true;
				} else {
					if (contextFlag) {
						chrome.contextMenus.remove('adduser');
						contextFlag = false;
					}
				}
			}
		}, {
			key: 'requestProcess',
			value: function requestProcess(request, sender, sendResponse) {
				if (request.method == "getLocalStorage") {
					var sendData = localStorage.length > 0 ? localStorage : undefined;
					sendResponse({ data: sendData });
				} else {
					sendResponse({});
				}
			}
		}, {
			key: 'addUser',
			value: function addUser(event) {
				var defaultUserForm = {
					ruliwebID: '',
					user_memo: '',
					settingType: 0,
					settingColor: '#ffffff'
				};

				if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {
					defaultUserForm.addDate = _utility2.default.getDate();
					defaultUserForm.name = userInfo;
					_utility2.default.saveJson([defaultUserForm]);

					alert('유저추가 완료');
				} else {
					var aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
					var addSwitch = true;
					var aggrohumanList = aggrohumanJson.userCellInfo;

					for (var i = 0; i < aggrohumanList.length; i++) {
						if (aggrohumanList[i].name === userInfo) {
							alert('이미 유저가 존재합니다.');
							addSwitch = false;
							break;
						}
					} //for - 중복체크

					if (addSwitch) {
						defaultUserForm.addDate = _utility2.default.getDate();
						defaultUserForm.name = userInfo;

						aggrohumanJson.userCellInfo.push(defaultUserForm);

						_utility2.default.saveJson(aggrohumanJson.userCellInfo);
						alert('유저추가 완료');
					}
				}
			}
		}]);

		return Background;
	}();

	var background = chrome.extension.getBackgroundPage();
	var userInfo = void 0;
	var counts = [];
	var contextFlag = false;

	chrome.runtime.onMessage.addListener(Background.messageProcess);
	chrome.extension.onRequest.addListener(Background.requestProcess);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Utillity = function () {
	    function Utillity() {
	        _classCallCheck(this, Utillity);
	    }

	    _createClass(Utillity, null, [{
	        key: "saveJson",
	        value: function saveJson(jsonData) {
	            var userNameKeys = {};
	            var userIDKeys = {};

	            $(jsonData).each(function (index, data) {
	                if (data.name) userNameKeys[data.name] = index;

	                if (data.ruliwebID) userIDKeys[data.ruliwebID] = index;
	            });

	            var dataFrom = {
	                "userCellInfo": jsonData,
	                "userNameKeys": userNameKeys,
	                "userIDKeys": userIDKeys
	            };

	            localStorage['aggrohuman'] = JSON.stringify(dataFrom);
	        }
	    }, {
	        key: "logPrint",
	        value: function logPrint(color, text) {
	            var log = $('#log')[0];
	            log.innerHTML = text;
	            log.style.color = color;
	        } //function logPrint - 페이지 로그 출력

	    }, {
	        key: "getDate",
	        value: function getDate() {
	            var date = new Date();
	            var year = date.getFullYear();
	            var month = date.getMonth() + 1;
	            var day = date.getDate();

	            if (month < 10) month = "0" + month;
	            if (day < 10) day = "0" + day;

	            return '' + year + '/' + month + '/' + day;
	        } //function getDate - 날짜값을 얻어옴

	    }, {
	        key: "settingToStrConvert",
	        value: function settingToStrConvert(settingType) {
	            var settingTypeStr = void 0;

	            switch (settingType) {
	                case 0:
	                    settingTypeStr = "설정없음";
	                    break;
	                case 1:
	                    settingTypeStr = "글 제거";
	                    break;
	                case 2:
	                    settingTypeStr = "글 가리기";
	                    break;
	                case 3:
	                    settingTypeStr = "줄 색칠";
	                    break;
	            }

	            return settingTypeStr;
	        }
	    }]);

	    return Utillity;
	}();

	exports.default = Utillity;

	/*
	    공통 사용 기타함수를 모아놨습니다.
	*/

/***/ }
/******/ ]);