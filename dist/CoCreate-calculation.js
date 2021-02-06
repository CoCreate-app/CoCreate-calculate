(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["calculation"] = factory();
	else
		root["CoCreate"] = root["CoCreate"] || {}, root["CoCreate"]["calculation"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/CoCreate-calculation.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CoCreate-calculation.js":
/*!*************************************!*\
  !*** ./src/CoCreate-calculation.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar CoCreateCalculation = {\n  init: function init() {\n    this.initCalculationElements();\n  },\n  initCalculationElements: function initCalculationElements(container) {\n    var mainContainer = container || document;\n\n    if (!mainContainer.querySelectorAll) {\n      return;\n    }\n\n    var calculationElements = mainContainer.querySelectorAll('[data-calculation]') || [];\n    calculationElements = Array.from(calculationElements);\n\n    if (mainContainer != document && mainContainer.hasAttribute('data-calculation')) {\n      calculationElements.push(mainContainer);\n    }\n\n    for (var i = 0; i < calculationElements.length; i++) {\n      if (CoCreate.observer.getInitialized(calculationElements[i], \"calculation_init\")) {\n        return;\n      }\n\n      CoCreate.observer.setInitialized(calculationElements[i], \"calculation_init\");\n      this.initCalculationElement(calculationElements[i]);\n    }\n  },\n  initCalculationElement: function initCalculationElement(ele) {\n    var self = this;\n    var data_calculation = ele.getAttribute('data-calculation');\n    var ids = this.getIds(data_calculation);\n\n    for (var i = 0; i < ids.length; i++) {\n      var id = ids[i];\n      var input = document.getElementById(id);\n\n      if (input) {\n        input.addEventListener('input', function () {\n          self.setCalcationResult(ele);\n        });\n        input.addEventListener('CoCreateInput-setvalue', function () {\n          console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');\n          self.setCalcationResult(ele);\n        });\n      }\n    }\n  },\n  setCalcationResult: function setCalcationResult(ele) {\n    var data_calculation = ele.getAttribute('data-calculation');\n    var calString = this.replaceIdWithValue(data_calculation);\n    console.log(calString);\n\n    if (calString) {\n      var result = calculation(calString);\n\n      if (ele.tagName == 'INPUT' || ele.tagName == 'TEXTAREA' || ele.tagName == 'SELECT') {\n        ele.value = result; // if (window.CoCreateInput) {\n        //   window.CoCreateInput.save(ele)\n        // }\n      } else {\n        ele.innerHTML = result; // if (window.CoCreateHtmlTags) {\n        //   window.CoCreateHtmlTags.save(ele);\n        // }\n      }\n    }\n  },\n  replaceIdWithValue: function replaceIdWithValue(data_calculation) {\n    var ids = this.getIds(data_calculation);\n\n    for (var i = 0; i < ids.length; i++) {\n      var id = ids[i];\n      var input = document.getElementById(id);\n\n      if (input) {\n        var value = Number(input.value);\n        data_calculation = data_calculation.replace(new RegExp('{' + id + '}', 'g'), value);\n      }\n    }\n\n    return data_calculation;\n  },\n  getIds: function getIds(string) {\n    var tmp = string;\n    var ids = [];\n    if (!tmp) return ids;\n\n    while (tmp.length > 0) {\n      var firstIndex = tmp.indexOf('{');\n      var secondIndex = tmp.indexOf('}', firstIndex);\n\n      if (firstIndex > -1 && secondIndex > -1) {\n        var id = tmp.substring(firstIndex + 1, secondIndex);\n        if (ids.indexOf(id) == -1) ids.push(id);\n        tmp = tmp.substring(secondIndex + 1);\n      } else {\n        return ids;\n      }\n    }\n\n    return ids;\n  }\n};\n\nfunction calculation(string) {\n  var index1, index2, index3, index4;\n  index1 = string.indexOf('+');\n  index2 = string.indexOf('-');\n  index3 = string.indexOf('*');\n  index4 = string.indexOf('/');\n\n  if (index1 > -1) {\n    var lStr = string.substr(0, index1);\n    var rStr = string.substr(index1 + 1);\n    return calculation(lStr) + calculation(rStr);\n  } else if (index2 > -1) {\n    var _lStr = string.substr(0, index2);\n\n    var _rStr = string.substr(index2 + 1);\n\n    return calculation(_lStr) - calculation(_rStr);\n  } else if (index3 > -1) {\n    var _lStr2 = string.substr(0, index3);\n\n    var _rStr2 = string.substr(index3 + 1);\n\n    return calculation(_lStr2) * calculation(_rStr2);\n  } else if (index4 > -1) {\n    var _lStr3 = string.substr(0, index4);\n\n    var _rStr3 = string.substr(index4 + 1);\n\n    var lValue = calculation(_lStr3);\n    var rValue = calculation(_rStr3);\n\n    if (rValue == 0) {\n      return 0;\n    } else {\n      return lValue / rValue;\n    }\n  } else {\n    var result = Number(string);\n\n    if (isNaN(result)) {\n      return 0;\n    } else {\n      return result;\n    }\n  }\n}\n\nCoCreateCalculation.init();\nCoCreate.observer.add({\n  name: 'CoCreateCalculationChangeValue',\n  observe: ['attributes'],\n  attributes: ['value'],\n  include: 'input',\n  task: function task(mutation) {\n    console.log('-----------------------------------------------------');\n    console.log(mutation.target);\n  }\n});\nCoCreate.observer.add({\n  name: 'CoCreateCalculationInit',\n  observe: ['subtree', 'childList'],\n  include: '[data-calculation]',\n  task: function task(mutation) {\n    CoCreateCalculation.initCalculationElements(mutation.target);\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (CoCreateCalculation);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Db0NyZWF0ZS5jYWxjdWxhdGlvbi8uL3NyYy9Db0NyZWF0ZS1jYWxjdWxhdGlvbi5qcz8wNWQ3Il0sIm5hbWVzIjpbIkNvQ3JlYXRlQ2FsY3VsYXRpb24iLCJpbml0IiwiaW5pdENhbGN1bGF0aW9uRWxlbWVudHMiLCJjb250YWluZXIiLCJtYWluQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2FsY3VsYXRpb25FbGVtZW50cyIsIkFycmF5IiwiZnJvbSIsImhhc0F0dHJpYnV0ZSIsInB1c2giLCJpIiwibGVuZ3RoIiwiQ29DcmVhdGVPYnNlcnZlciIsImdldEluaXRpYWxpemVkIiwic2V0SW5pdGlhbGl6ZWQiLCJpbml0Q2FsY3VsYXRpb25FbGVtZW50IiwiZWxlIiwic2VsZiIsImRhdGFfY2FsY3VsYXRpb24iLCJnZXRBdHRyaWJ1dGUiLCJpZHMiLCJnZXRJZHMiLCJpZCIsImlucHV0IiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0Q2FsY2F0aW9uUmVzdWx0IiwiY29uc29sZSIsImxvZyIsImNhbFN0cmluZyIsInJlcGxhY2VJZFdpdGhWYWx1ZSIsInJlc3VsdCIsImNhbGN1bGF0aW9uIiwidGFnTmFtZSIsInZhbHVlIiwiaW5uZXJIVE1MIiwiTnVtYmVyIiwicmVwbGFjZSIsIlJlZ0V4cCIsInN0cmluZyIsInRtcCIsImZpcnN0SW5kZXgiLCJpbmRleE9mIiwic2Vjb25kSW5kZXgiLCJzdWJzdHJpbmciLCJpbmRleDEiLCJpbmRleDIiLCJpbmRleDMiLCJpbmRleDQiLCJsU3RyIiwic3Vic3RyIiwiclN0ciIsImxWYWx1ZSIsInJWYWx1ZSIsImlzTmFOIiwiYWRkIiwibmFtZSIsIm9ic2VydmUiLCJhdHRyaWJ1dGVzIiwiaW5jbHVkZSIsInRhc2siLCJtdXRhdGlvbiIsInRhcmdldCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxJQUFJQSxtQkFBbUIsR0FBRztBQUN4QkMsTUFB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Q0FBQ0csTUFBRCxDQUFuQjs7QUFFQSxRQUFJZSxLQUFLLENBQUN2QixNQUFELENBQVQsRUFBbUI7QUFDakIsYUFBTyxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBT0EsTUFBUDtBQUNEO0FBR0Y7QUFFRjs7QUFFRGpDLG1CQUFtQixDQUFDQyxJQUFwQjtBQUVBYSxnQkFBZ0IsQ0FBQzJDLEdBQWpCLENBQXFCO0FBQ3BCQyxNQUFJLEVBQUUsZ0NBRGM7QUFFcEJDLFNBQU8sRUFBRSxDQUFDLFlBQUQsQ0FGVztBQUdwQkMsWUFBVSxFQUFFLENBQUMsT0FBRCxDQUhRO0FBSW5CQyxTQUFPLEVBQUUsT0FKVTtBQUtwQkMsTUFBSSxFQUFFLGNBQVNDLFFBQVQsRUFBbUI7QUFDdkJsQyxXQUFPLENBQUNDLEdBQVIsQ0FBWSx1REFBWjtBQUNERCxXQUFPLENBQUNDLEdBQVIsQ0FBWWlDLFFBQVEsQ0FBQ0MsTUFBckI7QUFDQTtBQVJtQixDQUFyQjtBQVdBbEQsZ0JBQWdCLENBQUMyQyxHQUFqQixDQUFxQjtBQUNwQkMsTUFBSSxFQUFFLHlCQURjO0FBRXBCQyxTQUFPLEVBQUUsQ0FBQyxTQUFELEVBQVksV0FBWixDQUZXO0FBR25CRSxTQUFPLEVBQUUsb0JBSFU7QUFJcEJDLE1BQUksRUFBRSxjQUFTQyxRQUFULEVBQW1CO0FBQ3hCL0QsdUJBQW1CLENBQUNFLHVCQUFwQixDQUE0QzZELFFBQVEsQ0FBQ0MsTUFBckQ7QUFDQTtBQU5tQixDQUFyQjtBQVNlaEUsa0ZBQWYiLCJmaWxlIjoiLi9zcmMvQ29DcmVhdGUtY2FsY3VsYXRpb24uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ29DcmVhdGVDYWxjdWxhdGlvbiA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbml0Q2FsY3VsYXRpb25FbGVtZW50cygpO1xuICB9LFxuICAgIFxuICAgIFxuICBpbml0Q2FsY3VsYXRpb25FbGVtZW50czogZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgY29uc3QgbWFpbkNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudDtcbiAgICBpZiAoIW1haW5Db250YWluZXIucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgY2FsY3VsYXRpb25FbGVtZW50cyA9IG1haW5Db250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2FsY3VsYXRpb25dJykgfHwgW107XG4gICAgY2FsY3VsYXRpb25FbGVtZW50cyA9IEFycmF5LmZyb20oY2FsY3VsYXRpb25FbGVtZW50cyk7XG4gICAgXG4gICAgaWYgKG1haW5Db250YWluZXIgIT0gZG9jdW1lbnQgJiYgbWFpbkNvbnRhaW5lci5oYXNBdHRyaWJ1dGUoJ2RhdGEtY2FsY3VsYXRpb24nKSkge1xuICAgICAgY2FsY3VsYXRpb25FbGVtZW50cy5wdXNoKG1haW5Db250YWluZXIpOyAgXG4gICAgfVxuICAgIFxuICAgIGZvciAobGV0IGk9MDsgaTxjYWxjdWxhdGlvbkVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgXHRpZiAoQ29DcmVhdGVPYnNlcnZlci5nZXRJbml0aWFsaXplZChjYWxjdWxhdGlvbkVsZW1lbnRzW2ldLCBcImNhbGN1bGF0aW9uX2luaXRcIikpIHtcbiAgXHRcdFx0cmV0dXJuO1xuICBcdFx0fVxuICBcdFx0Q29DcmVhdGVPYnNlcnZlci5zZXRJbml0aWFsaXplZChjYWxjdWxhdGlvbkVsZW1lbnRzW2ldLCBcImNhbGN1bGF0aW9uX2luaXRcIilcbiAgXHRcdFxuICAgICAgdGhpcy5pbml0Q2FsY3VsYXRpb25FbGVtZW50KGNhbGN1bGF0aW9uRWxlbWVudHNbaV0pOyAgXG4gICAgfVxuICAgIFxuICB9LFxuICAgIFxuICBpbml0Q2FsY3VsYXRpb25FbGVtZW50OiBmdW5jdGlvbihlbGUpIHtcbiAgICBcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgbGV0IGRhdGFfY2FsY3VsYXRpb24gPSBlbGUuZ2V0QXR0cmlidXRlKCdkYXRhLWNhbGN1bGF0aW9uJyk7XG4gICAgICBsZXQgaWRzID0gdGhpcy5nZXRJZHMoZGF0YV9jYWxjdWxhdGlvbik7IFxuICAgICAgXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaWQgPSBpZHNbaV07XG4gICAgICAgIFxuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnNldENhbGNhdGlvblJlc3VsdChlbGUpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgXG4gICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignQ29DcmVhdGVJbnB1dC1zZXR2YWx1ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYnKVxuICAgICAgICAgICAgICBzZWxmLnNldENhbGNhdGlvblJlc3VsdChlbGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gIH0sXG4gIFxuICAgIFxuICBzZXRDYWxjYXRpb25SZXN1bHQ6IGZ1bmN0aW9uKGVsZSkge1xuICAgIGxldCBkYXRhX2NhbGN1bGF0aW9uID0gZWxlLmdldEF0dHJpYnV0ZSgnZGF0YS1jYWxjdWxhdGlvbicpO1xuICAgIFxuICAgIGxldCBjYWxTdHJpbmcgPSB0aGlzLnJlcGxhY2VJZFdpdGhWYWx1ZShkYXRhX2NhbGN1bGF0aW9uKTtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhjYWxTdHJpbmcpO1xuICAgIGlmIChjYWxTdHJpbmcpIHtcbiAgICAgIGxldCByZXN1bHQgPSBjYWxjdWxhdGlvbihjYWxTdHJpbmcpO1xuICAgICAgaWYgKGVsZS50YWdOYW1lID09ICdJTlBVVCcgfHwgZWxlLnRhZ05hbWUgPT0gJ1RFWFRBUkVBJyB8fCBlbGUudGFnTmFtZSA9PSAnU0VMRUNUJykge1xuICAgICAgICBlbGUudmFsdWUgPSByZXN1bHRcbiAgICAgICAgLy8gaWYgKHdpbmRvdy5Db0NyZWF0ZUlucHV0KSB7XG4gICAgICAgIC8vICAgd2luZG93LkNvQ3JlYXRlSW5wdXQuc2F2ZShlbGUpXG4gICAgICAgIC8vIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZS5pbm5lckhUTUwgPSByZXN1bHQ7XG4gICAgICAgIC8vIGlmICh3aW5kb3cuQ29DcmVhdGVIdG1sVGFncykge1xuICAgICAgICAvLyAgIHdpbmRvdy5Db0NyZWF0ZUh0bWxUYWdzLnNhdmUoZWxlKTtcbiAgICAgICAgLy8gfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgfSxcbiAgICBcbiAgcmVwbGFjZUlkV2l0aFZhbHVlOiBmdW5jdGlvbihkYXRhX2NhbGN1bGF0aW9uKSB7XG4gICAgbGV0IGlkcyA9IHRoaXMuZ2V0SWRzKGRhdGFfY2FsY3VsYXRpb24pO1xuICAgIFxuICAgIGZvciAobGV0IGk9MDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGlkID0gaWRzW2ldO1xuICAgICAgXG4gICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gTnVtYmVyKGlucHV0LnZhbHVlKTtcbiAgICAgIFxuICAgICAgICBkYXRhX2NhbGN1bGF0aW9uID0gZGF0YV9jYWxjdWxhdGlvbi5yZXBsYWNlKG5ldyBSZWdFeHAoJ3snICsgaWQgKyAnfScsICdnJyksIHZhbHVlKTsgICBcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGRhdGFfY2FsY3VsYXRpb247XG4gIH0sXG4gICAgXG4gIGdldElkczogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgbGV0IHRtcCA9IHN0cmluZztcbiAgICBcbiAgICBsZXQgaWRzID0gW11cbiAgICBpZiAoIXRtcCkgcmV0dXJuIGlkcztcbiAgICB3aGlsZSAodG1wLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBmaXJzdEluZGV4ID0gdG1wLmluZGV4T2YoJ3snKTtcbiAgICAgIGxldCBzZWNvbmRJbmRleCA9IHRtcC5pbmRleE9mKCd9JywgZmlyc3RJbmRleCk7XG4gICAgICBcbiAgICAgIGlmIChmaXJzdEluZGV4ID4gLTEgJiYgc2Vjb25kSW5kZXggPiAtMSkge1xuICAgICAgICBsZXQgaWQgPSB0bXAuc3Vic3RyaW5nKGZpcnN0SW5kZXggKyAxLCBzZWNvbmRJbmRleCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoaWRzLmluZGV4T2YoaWQpID09IC0xKSBpZHMucHVzaChpZCk7XG4gIFxuICAgICAgICB0bXAgPSB0bXAuc3Vic3RyaW5nKHNlY29uZEluZGV4ICsgMSk7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlkcztcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGlkcztcbiAgfSxcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRpb24oc3RyaW5nKSB7XG4gIGxldCBpbmRleDEsIGluZGV4MiwgaW5kZXgzLCBpbmRleDQ7XG4gIFxuICBpbmRleDEgPSBzdHJpbmcuaW5kZXhPZignKycpO1xuICBpbmRleDIgPSBzdHJpbmcuaW5kZXhPZignLScpO1xuICBpbmRleDMgPSBzdHJpbmcuaW5kZXhPZignKicpO1xuICBpbmRleDQgPSBzdHJpbmcuaW5kZXhPZignLycpO1xuICBcbiAgXG4gIGlmIChpbmRleDEgPiAtMSkge1xuICAgIGxldCBsU3RyID0gc3RyaW5nLnN1YnN0cigwLCBpbmRleDEpO1xuICAgIGxldCByU3RyID0gc3RyaW5nLnN1YnN0cihpbmRleDEgKyAxKTtcbiAgICBcbiAgICByZXR1cm4gY2FsY3VsYXRpb24obFN0cikgKyBjYWxjdWxhdGlvbihyU3RyKTtcbiAgICBcbiAgfSBlbHNlIGlmIChpbmRleDIgPiAtMSkge1xuICAgIGxldCBsU3RyID0gc3RyaW5nLnN1YnN0cigwLCBpbmRleDIpO1xuICAgIGxldCByU3RyID0gc3RyaW5nLnN1YnN0cihpbmRleDIgKyAxKTtcbiAgICBcbiAgICByZXR1cm4gY2FsY3VsYXRpb24obFN0cikgLSBjYWxjdWxhdGlvbihyU3RyKTtcbiAgICBcbiAgfSBlbHNlIGlmIChpbmRleDMgPiAtMSkge1xuICAgIGxldCBsU3RyID0gc3RyaW5nLnN1YnN0cigwLCBpbmRleDMpO1xuICAgIGxldCByU3RyID0gc3RyaW5nLnN1YnN0cihpbmRleDMgKyAxKTtcbiAgICBcbiAgICByZXR1cm4gY2FsY3VsYXRpb24obFN0cikgKiBjYWxjdWxhdGlvbihyU3RyKTtcbiAgfSBlbHNlIGlmIChpbmRleDQgPiAtMSkge1xuICAgIGxldCBsU3RyID0gc3RyaW5nLnN1YnN0cigwLCBpbmRleDQpO1xuICAgIGxldCByU3RyID0gc3RyaW5nLnN1YnN0cihpbmRleDQgKyAxKTtcbiAgICBcbiAgICBsZXQgbFZhbHVlID0gY2FsY3VsYXRpb24obFN0cik7XG4gICAgbGV0IHJWYWx1ZSA9IGNhbGN1bGF0aW9uKHJTdHIpO1xuICAgIFxuICAgIGlmIChyVmFsdWUgPT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsVmFsdWUgLyByVmFsdWU7XG4gICAgfVxuICAgIFxuICB9IGVsc2Uge1xuICAgIGxldCByZXN1bHQgPSBOdW1iZXIoc3RyaW5nKTtcbiAgICBcbiAgICBpZiAoaXNOYU4ocmVzdWx0KSkge1xuICAgICAgcmV0dXJuIDA7IFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBcbiAgICBcbiAgfVxuICBcbn1cblxuQ29DcmVhdGVDYWxjdWxhdGlvbi5pbml0KCk7XG5cbkNvQ3JlYXRlT2JzZXJ2ZXIuYWRkKHsgXG5cdG5hbWU6ICdDb0NyZWF0ZUNhbGN1bGF0aW9uQ2hhbmdlVmFsdWUnLCBcblx0b2JzZXJ2ZTogWydhdHRyaWJ1dGVzJ10sXG5cdGF0dHJpYnV0ZXM6IFsndmFsdWUnXSxcbiAgaW5jbHVkZTogJ2lucHV0Jyxcblx0dGFzazogZnVuY3Rpb24obXV0YXRpb24pIHtcblx0ICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuXHRcdGNvbnNvbGUubG9nKG11dGF0aW9uLnRhcmdldClcblx0fVxufSk7XG5cbkNvQ3JlYXRlT2JzZXJ2ZXIuYWRkKHsgXG5cdG5hbWU6ICdDb0NyZWF0ZUNhbGN1bGF0aW9uSW5pdCcsIFxuXHRvYnNlcnZlOiBbJ3N1YnRyZWUnLCAnY2hpbGRMaXN0J10sXG4gIGluY2x1ZGU6ICdbZGF0YS1jYWxjdWxhdGlvbl0nLFxuXHR0YXNrOiBmdW5jdGlvbihtdXRhdGlvbikge1xuXHRcdENvQ3JlYXRlQ2FsY3VsYXRpb24uaW5pdENhbGN1bGF0aW9uRWxlbWVudHMobXV0YXRpb24udGFyZ2V0KVxuXHR9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ29DcmVhdGVDYWxjdWxhdGlvbjsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/CoCreate-calculation.js\n");

/***/ })

/******/ })["default"];
});