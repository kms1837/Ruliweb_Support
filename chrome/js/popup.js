/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

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
        key: 'logPrint',
        value: function logPrint(color, text) {
            var log = $('#log')[0];
            log.innerHTML = text;
            log.style.color = color;
        } //function logPrint - 페이지 로그 출력

    }, {
        key: 'getDate',
        value: function getDate() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;

            return '' + year + '/' + month + '/' + day;
        } //function getDate - 날짜값을 얻어옴

    }, {
        key: 'settingToStrConvert',
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

/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utility = __webpack_require__(0);

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Popup = function () {
	function Popup() {
		_classCallCheck(this, Popup);

		chrome.runtime.sendMessage({ type: "getCount" }, this.render);
	}

	_createClass(Popup, [{
		key: 'render',
		value: function render(data) {
			var ele = $('#userCounter').find('ul')[0];

			if (data !== undefined && data !== null && data.length > 0) {
				$(data).each(function (index, object) {
					var addEle = '<li>\n\t\t\t\t\t\t\t\t<label class="title"> ' + object.title + ' </label>\n\t\t\t\t\t\t\t\t<span class="count">  ' + object.count + ' </span>\n\t\t\t\t\t\t\t\t<ul class="logs">';

					if (object.logs != undefined) {
						var logs = JSON.parse(object.logs);
						var keys = Object.keys(logs);

						if (keys.length > 0) {
							$(keys).each(function (index, key) {
								addEle = addEle + ('<li> \n\t\t\t\t\t\t\t\t\t\t\t\t <label class="title"> ' + logs[key].name + ' (' + logs[key].id + ') </label> \n\t\t\t\t\t\t\t\t\t\t\t\t <span class="count"> ' + logs[key].count + ' </span>\n\t\t\t\t\t\t\t\t\t\t\t   </li>');
							});
						} else {
							addEle = addEle + '<li> \n\t\t\t\t\t\t\t\t   <label class="title"> \uAD00\uB9AC \uC720\uC800 \uC5C6\uC74C </label> \n\t\t\t\t\t\t\t\t </li>';
						}
					}

					addEle = addEle + '</ul> </li>';
					$(ele).append(addEle);
				});
			}

			_utility2.default.logPrint('#005CFF', '정상 작동중');
		}
	}]);

	return Popup;
}();

$(document).ready(function () {
	new Popup();
});

/***/ })

/******/ });