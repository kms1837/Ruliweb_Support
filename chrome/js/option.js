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

	var _userIO = __webpack_require__(5);

	var _userIO2 = _interopRequireDefault(_userIO);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Option = function () {
		function Option() {
			_classCallCheck(this, Option);

			this.nowMenuNumber = 0; //현재 선택된 메뉴
			this.eventBind();

			// object bind
			this.eventBind = this.eventBind.bind(this);
			this.changeMenu = this.changeMenu.bind(this);
			this.deleteCell = this.deleteCell.bind(this);
			this.userOptionsAllChange = this.userOptionsAllChange.bind(this);
		}

		_createClass(Option, [{
			key: 'eventBind',
			value: function eventBind() {
				var _this = this;

				$(document).on('click', '#addBadUser', function () {
					var aggroUserNameTextBox = document.getElementById('aggrohuman');
					var aggroUserName = aggroUserNameTextBox.value;
					var blockColor = document.getElementById('blockColor');
					var blockTypeValue = $('#blockTypeSelect').val();

					if (aggroUserName.length > 0) {
						var addUserForm = Object.assign(_userIO2.default.defaultUserForm, {
							name: aggroUserName,
							settingType: blockTypeValue,
							settingColor: blockColor.value,
							addDate: _utility2.default.getDate()
						});

						_userIO2.default.addUser(addUserForm, function (userData) {
							aggroUserNameTextBox.value = '';

							_this.addCell(userData);
							$('.deleteCellBtn').click(_this.deleteCell); //삭제 버튼 이벤트
							_this.restoreOptions();

							_utility2.default.logPrint('#005CFF', '어그로 유저 추가');
						});
					} else {
						_utility2.default.logPrint('red', '이름이 비어있음');
					}
				});

				$(document).on('change', '#importOption', _userIO2.default.importOption);

				$(document).on('click', '.choiceSetting input[type="radio"]', function (data) {
					var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
					var userid = $('.select').attr('userid');

					aggrohuman[userid].settingType = data.target.value;
					_utility2.default.saveJson(aggrohuman);

					var setType = _this.settingToStrConvert(parseInt(data.target.value));

					$('.select .userState').text(setType);
					_utility2.default.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
				});

				$(document).on('change', '.choiceSetting input[type="color"]', function (data) {
					var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
					var userid = $('.select').attr('userid');

					aggrohuman[userid].settingColor = data.target.value;
					_utility2.default.saveJson(aggrohuman);

					_utility2.default.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
				});

				$(document).on('keyup', '.choiceSetting #userID', function (data) {
					var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
					var userid = $('.select').attr('userid');
					var inID = data.target.value;
					data.target.value = inID.replace(/[^0-9]/, "");

					aggrohuman[userid].ruliwebID = data.target.value;

					_utility2.default.saveJson(aggrohuman);
				});

				$(document).on('change', '.choiceSetting #userID', function () {
					var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
					var userid = $('.select').attr('userid');

					$('.select .userID').text(aggrohuman[userid].ruliwebID);
					_utility2.default.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + 'ID 변경');
				});

				$(document).on('keyup', '.choiceSetting #userMemo', function (data) {
					var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
					var userid = $('.select').attr('userid');
					var inID = data.target.value;

					aggrohuman[userid].user_memo = data.target.value;

					_utility2.default.saveJson(aggrohuman);
				});

				$(document).on('change', '.choiceSetting #userMemo', function () {
					var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
					var userid = $('.select').attr('userid');

					_utility2.default.logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '유저 메모 추가');
				});

				$(document).on('click', '.choiceBadUserOption ul.badUserList li', function (data) {
					var userid = $(data.currentTarget).attr('userid');
					_this.userChoice(data.currentTarget, userid);
				});

				$('#left_menu ul li').click(function (e) {
					var clickMenuID = e.target.getAttribute('itemprop');
					_this.changeMenu(clickMenuID);
				});

				this.changeMenu(1);
			}
		}, {
			key: 'userOptionsAllChange',
			value: function userOptionsAllChange() {
				var allSwitch = confirm("정말 일괄로 적용하겠습니까?");

				if (allSwitch) {
					var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
					var blockColor = document.getElementById('blockColor');
					var blockTypeValue = $('#blockTypeSelect').val();

					for (var i = 0; i < aggrohuman.length; i++) {
						aggrohuman[i].settingType = blockTypeValue;
						aggrohuman[i].settingColor = blockColor.value;
					}

					_utility2.default.saveJson(aggrohuman);

					$('.badUserList').html('');

					this.restoreOptions();
					_utility2.default.logPrint('#005CFF', '일괄처리 완료');
				}
			} //function restoreOptions - 옵션 저장

		}, {
			key: 'userChoice',
			value: function userChoice(cellObj, userNumber) {
				var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
				var radiobox = document.getElementsByName('blockTypeRadio');

				var blockgroup = $('.blockGroup');

				blockgroup.removeClass();
				blockgroup.addClass('blockGroup');

				$('#userID')[0].value = '';

				$('.select').removeClass();
				$(cellObj).addClass('select');
				$('.choiceSetting .choiceUserName').text(aggrohuman[userNumber].name);
				$('#userID')[0].value = aggrohuman[userNumber].ruliwebID;
				$('#blockColor')[0].value = aggrohuman[userNumber].settingColor;
				$('#userMemo')[0].value = aggrohuman[userNumber].userMemo;

				var settingType = aggrohuman[userNumber].settingType;

				radiobox[settingType].checked = true;
			}
		}, {
			key: 'changeMenu',
			value: function changeMenu(menuNumber) {
				var _this2 = this;

				if (menuNumber != this.nowMenuNumber) {
					$('#content').load('option_menu' + menuNumber + '.html', function () {
						$("#left_menu #selectedMenuItem").removeAttr('id');
						$("#left_menu li")[menuNumber - 1].id = 'selectedMenuItem';

						_this2.nowMenuNumber = menuNumber;

						if (_this2.nowMenuNumber <= 2) _this2.restoreOptions();

						switch (parseInt(menuNumber)) {
							case 1:
								document.querySelector('#save').addEventListener('click', _this2.userOptionsAllChange);
								document.querySelector('#reset').addEventListener('click', _this2.optionReset);
								break;
							case 3:
								document.querySelector('#export_option').addEventListener('click', _userIO2.default.exportOption);
								break;
						} //페이지 셋팅
					});
				}
			} //function changeMenu - 옵션메뉴 변경

		}, {
			key: 'restoreOptions',
			value: function restoreOptions() {
				var userList = $('.badUserList');
				var aggrohuman = localStorage['aggrohuman']; //어그로 목록

				userList[0].innerHTML = '';

				if (aggrohuman != undefined) {
					var date = _utility2.default.getDate();
					var _aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;

					for (var i = 0; i < _aggrohuman.length; i++) {
						this.addCell(_aggrohuman[i]);
					}$('.badUserList li').each(function (index, li) {
						$(li).attr('itemprop', index);
					});

					$('.deleteCellBtn').click(this.deleteCell); //삭제 버튼 이벤트
				}
			} //function restoreOptions - 페이지 로드

		}, {
			key: 'addCell',
			value: function addCell(celldata) {
				var userList = $('.badUserList');
				userList[0].innerHTML += this.userCellForm(celldata);
			} //function addCell - 리스트 셀 형식

		}, {
			key: 'userCellForm',
			value: function userCellForm(celldata) {
				//TODO - 선택할때 순서 DOM에 부여 못하고 있음 수정할것.
				var settingTypeStr = _utility2.default.settingToStrConvert(parseInt(celldata.settingType));
				// { id, date, name, ruliwebID, settingType, cellNumber }
				var index = 0;

				return '<li>\n\t\t  \t\t\t<div class="cellState">\n\t\t\t    \t\t<p class="date">' + celldata.addDate + '</p>\n\t\t\t    \t\t<p class="userState">' + settingTypeStr + '</p>\n\t\t\t    \t</div>\n\t\t\t    \t<div class="badUserName">\n\t\t\t    \t\t<p class="userName">' + celldata.name + '</p>\n\t\t\t    \t\t<p class="userID">' + celldata.ruliwebID + '</p>\n\t\t\t    \t</div>\n\t\t\t    \t<button class="deleteCellBtn">\uC0AD\uC81C</button>\n\t\t\t      </li>';
			}
		}, {
			key: 'optionReset',
			value: function optionReset() {
				var resetSwitch = confirm("정말 옵션을 초기화 하시겠습니까? (추가하신 모든 리스트가 사라집니다.)");

				if (resetSwitch) {
					var aggroUserName = document.getElementById('aggrohuman');
					var radiobox = document.getElementsByName('blockTypeRadio');
					var badUserList = $('.badUserList');

					delete localStorage['aggrohuman'];

					badUserList[0].innerHTML = '';
					radiobox[0].checked = true;
					aggroUserName.value = '';
					_utility2.default.logPrint('#005CFF', '옵션 초기화 완료');
				}
			} //function optionReset - 옵션 초기화

		}, {
			key: 'deleteCell',
			value: function deleteCell(data) {
				var deleteCellNumber = data.currentTarget.closest('li').getAttribute('itemprop');
				var aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
				var aggrohumanList = aggrohumanJson.userCellInfo;

				aggrohumanList.splice(deleteCellNumber, 1);
				aggrohumanJson.userCellInfo = aggrohumanList;

				_utility2.default.saveJson(aggrohumanJson.userCellInfo);
				_utility2.default.logPrint('#005CFF', '셀 삭제 완료');

				this.restoreOptions();
			}
		}]);

		return Option;
	}();

	window.onload = function () {
		var option = new Option();
		window.ruliwebSupportOption = option;
	};

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
	            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

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

	            callback();
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

	            switch (parseInt(settingType)) {
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

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utility = __webpack_require__(1);

	var _utility2 = _interopRequireDefault(_utility);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var defaultUserForm = {
	  ruliwebID: '',
	  name: '',
	  userMemo: '',
	  settingType: 0,
	  settingColor: '#ffffff',
	  addDate: ''
	};

	var UserIo = function () {
	  function UserIo() {
	    _classCallCheck(this, UserIo);
	  }

	  _createClass(UserIo, null, [{
	    key: 'importOption',
	    value: function importOption(event) {
	      var _this = this;

	      var optionFile = event.target.files[0];
	      var reader = new FileReader();

	      reader.onload = function (file) {
	        try {
	          var userData = JSON.parse(file.target.result);
	          $(userData).each(function (index, object) {
	            _this.addUser(object.name, object);
	          });
	          _utility2.default.logPrint('#005CFF', '유저 추가');
	        } catch (err) {
	          _utility2.default.logPrint('red', '파일내용을 확인해 주세요');
	        }
	      };

	      reader.readAsText(optionFile);
	    }
	  }, {
	    key: 'exportOption',
	    value: function exportOption() {
	      var result = JSON.parse(localStorage['aggrohuman']);
	      var url = 'data:application/json;base64,' + btoa(unescape(encodeURIcomponent(JSON.stringify(result.userCellInfo))));
	      chrome.downloads.download({
	        url: url,
	        filename: 'user-list.json'
	      });
	    }
	  }, {
	    key: 'addUser',
	    value: function addUser() {
	      var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

	      if (localStorage['aggrohuman'] == '' || localStorage['aggrohuman'] == null) {
	        _utility2.default.saveJson([form]);
	        callback(form);
	        // 최초 추가
	      } else {
	        var aggrohumanJson = JSON.parse(localStorage['aggrohuman']);
	        var addSwitch = true;
	        var aggrohumanList = aggrohumanJson.userCellInfo;

	        for (var i = 0; i < aggrohumanList.length; i++) {
	          if (aggrohumanList[i].name == form.name) {
	            addSwitch = false;
	            _utility2.default.logPrint('red', '리스트에 이미 존재함');
	            return;
	          }
	        } //for - 중복체크

	        if (addSwitch) {
	          aggrohumanJson.userCellInfo.push(form);
	          _utility2.default.saveJson(aggrohumanJson.userCellInfo);
	          callback(form);
	        }
	      }
	    }
	  }, {
	    key: 'defaultUserForm',
	    get: function get() {
	      return defaultUserForm;
	    }
	  }]);

	  return UserIo;
	}();

	exports.default = UserIo;

/***/ }
/******/ ]);