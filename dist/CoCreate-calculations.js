(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["calculations"] = factory();
	else
		root["CoCreate"] = root["CoCreate"] || {}, root["CoCreate"]["calculations"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "../CoCreate-components/CoCreate-calculation/src/CoCreate-calculation.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../CoCreate-components/CoCreate-calculation/src/CoCreate-calculation.js":
/*!*******************************************************************************!*\
  !*** ../CoCreate-components/CoCreate-calculation/src/CoCreate-calculation.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar CoCreateCalculation = {\n  init: function init() {\n    this.initCalculationElements();\n  },\n  initCalculationElements: function initCalculationElements(container) {\n    var mainContainer = container || document;\n\n    if (!mainContainer.querySelectorAll) {\n      return;\n    }\n\n    var calculationElements = mainContainer.querySelectorAll('[data-calculation]') || [];\n    calculationElements = Array.from(calculationElements);\n\n    if (mainContainer != document && mainContainer.hasAttribute('data-calculation')) {\n      calculationElements.push(mainContainer);\n    }\n\n    for (var i = 0; i < calculationElements.length; i++) {\n      if (CoCreate.observer.getInitialized(calculationElements[i], \"calculation_init\")) {\n        return;\n      }\n\n      CoCreate.observer.setInitialized(calculationElements[i], \"calculation_init\");\n      this.initCalculationElement(calculationElements[i]);\n    }\n  },\n  initCalculationElement: function initCalculationElement(ele) {\n    var self = this;\n    var data_calculation = ele.getAttribute('data-calculation');\n    var ids = this.getIds(data_calculation);\n\n    for (var i = 0; i < ids.length; i++) {\n      var id = ids[i];\n      var input = document.getElementById(id);\n\n      if (input) {\n        input.addEventListener('input', function () {\n          self.setCalcationResult(ele);\n        });\n        input.addEventListener('CoCreateInput-setvalue', function () {\n          console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');\n          self.setCalcationResult(ele);\n        });\n      }\n    }\n  },\n  setCalcationResult: function setCalcationResult(ele) {\n    var data_calculation = ele.getAttribute('data-calculation');\n    var calString = this.replaceIdWithValue(data_calculation);\n    console.log(calString);\n\n    if (calString) {\n      var result = calculation(calString);\n\n      if (ele.tagName == 'INPUT' || ele.tagName == 'TEXTAREA' || ele.tagName == 'SELECT') {\n        ele.value = result; // if (window.CoCreateInput) {\n        //   window.CoCreateInput.save(ele)\n        // }\n      } else {\n        ele.innerHTML = result; // if (window.CoCreateHtmlTags) {\n        //   window.CoCreateHtmlTags.save(ele);\n        // }\n      }\n    }\n  },\n  replaceIdWithValue: function replaceIdWithValue(data_calculation) {\n    var ids = this.getIds(data_calculation);\n\n    for (var i = 0; i < ids.length; i++) {\n      var id = ids[i];\n      var input = document.getElementById(id);\n\n      if (input) {\n        var value = Number(input.value);\n        data_calculation = data_calculation.replace(new RegExp('{' + id + '}', 'g'), value);\n      }\n    }\n\n    return data_calculation;\n  },\n  getIds: function getIds(string) {\n    var tmp = string;\n    var ids = [];\n    if (!tmp) return ids;\n\n    while (tmp.length > 0) {\n      var firstIndex = tmp.indexOf('{');\n      var secondIndex = tmp.indexOf('}', firstIndex);\n\n      if (firstIndex > -1 && secondIndex > -1) {\n        var id = tmp.substring(firstIndex + 1, secondIndex);\n        if (ids.indexOf(id) == -1) ids.push(id);\n        tmp = tmp.substring(secondIndex + 1);\n      } else {\n        return ids;\n      }\n    }\n\n    return ids;\n  }\n};\n\nfunction calculation(string) {\n  var index1, index2, index3, index4;\n  index1 = string.indexOf('+');\n  index2 = string.indexOf('-');\n  index3 = string.indexOf('*');\n  index4 = string.indexOf('/');\n\n  if (index1 > -1) {\n    var lStr = string.substr(0, index1);\n    var rStr = string.substr(index1 + 1);\n    return calculation(lStr) + calculation(rStr);\n  } else if (index2 > -1) {\n    var _lStr = string.substr(0, index2);\n\n    var _rStr = string.substr(index2 + 1);\n\n    return calculation(_lStr) - calculation(_rStr);\n  } else if (index3 > -1) {\n    var _lStr2 = string.substr(0, index3);\n\n    var _rStr2 = string.substr(index3 + 1);\n\n    return calculation(_lStr2) * calculation(_rStr2);\n  } else if (index4 > -1) {\n    var _lStr3 = string.substr(0, index4);\n\n    var _rStr3 = string.substr(index4 + 1);\n\n    var lValue = calculation(_lStr3);\n    var rValue = calculation(_rStr3);\n\n    if (rValue == 0) {\n      return 0;\n    } else {\n      return lValue / rValue;\n    }\n  } else {\n    var result = Number(string);\n\n    if (isNaN(result)) {\n      return 0;\n    } else {\n      return result;\n    }\n  }\n}\n\nCoCreateCalculation.init();\nCoCreate.observer.add({\n  name: 'CoCreateCalculationChangeValue',\n  observe: ['attributes'],\n  attributes: ['value'],\n  include: 'input',\n  callback: function callback(mutation) {\n    console.log('-----------------------------------------------------');\n    console.log(mutation.target);\n  }\n});\nCoCreate.observer.add({\n  name: 'CoCreateCalculationInit',\n  observe: ['subtree', 'childList'],\n  include: '[data-calculation]',\n  callback: function callback(mutation) {\n    CoCreateCalculation.initCalculationElements(mutation.target);\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (CoCreateCalculation);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Db0NyZWF0ZS5jYWxjdWxhdGlvbnMvLi4vQ29DcmVhdGUtY29tcG9uZW50cy9Db0NyZWF0ZS1jYWxjdWxhdGlvbi9zcmMvQ29DcmVhdGUtY2FsY3VsYXRpb24uanM/YTk2ZiJdLCJuYW1lcyI6WyJDb0NyZWF0ZUNhbGN1bGF0aW9uIiwiaW5pdCIsImluaXRDYWxjdWxhdGlvbkVsZW1lbnRzIiwiY29udGFpbmVyIiwibWFpbkNvbnRhaW5lciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNhbGN1bGF0aW9uRWxlbWVudHMiLCJBcnJheSIsImZyb20iLCJoYXNBdHRyaWJ1dGUiLCJwdXNoIiwiaSIsImxlbmd0aCIsIkNvQ3JlYXRlIiwib2JzZXJ2ZXIiLCJnZXRJbml0aWFsaXplZCIsInNldEluaXRpYWxpemVkIiwiaW5pdENhbGN1bGF0aW9uRWxlbWVudCIsImVsZSIsInNlbGYiLCJkYXRhX2NhbGN1bGF0aW9uIiwiZ2V0QXR0cmlidXRlIiwiaWRzIiwiZ2V0SWRzIiwiaWQiLCJpbnB1dCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldENhbGNhdGlvblJlc3VsdCIsImNvbnNvbGUiLCJsb2ciLCJjYWxTdHJpbmciLCJyZXBsYWNlSWRXaXRoVmFsdWUiLCJyZXN1bHQiLCJjYWxjdWxhdGlvbiIsInRhZ05hbWUiLCJ2YWx1ZSIsImlubmVySFRNTCIsIk51bWJlciIsInJlcGxhY2UiLCJSZWdFeHAiLCJzdHJpbmciLCJ0bXAiLCJmaXJzdEluZGV4IiwiaW5kZXhPZiIsInNlY29uZEluZGV4Iiwic3Vic3RyaW5nIiwiaW5kZXgxIiwiaW5kZXgyIiwiaW5kZXgzIiwiaW5kZXg0IiwibFN0ciIsInN1YnN0ciIsInJTdHIiLCJsVmFsdWUiLCJyVmFsdWUiLCJpc05hTiIsImFkZCIsIm5hbWUiLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsImluY2x1ZGUiLCJjYWxsYmFjayIsIm11dGF0aW9uIiwidGFyZ2V0Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLElBQUlBLG1CQUFtQixHQUFHO0FBQ3hCQyxNQUFJLEVBQUUsZ0JBQVc7QUFDZixTQUFLQyx1QkFBTDtBQUNELEdBSHVCO0FBTXhCQSx5QkFBdUIsRUFBRSxpQ0FBU0MsU0FBVCxFQUFvQjtBQUMzQyxRQUFNQyxhQUFhLEdBQUdELFNBQVMsSUFBSUUsUUFBbkM7O0FBQ0EsUUFBSSxDQUFDRCxhQUFhLENBQUNFLGdCQUFuQixFQUFxQztBQUNuQztBQUNEOztBQUNELFFBQUlDLG1CQUFtQixHQUFHSCxhQUFhLENBQUNFLGdCQUFkLENBQStCLG9CQUEvQixLQUF3RCxFQUFsRjtBQUNBQyx1QkFBbUIsR0FBR0MsS0FBSyxDQUFDQyxJQUFOLENBQVdGLG1CQUFYLENBQXRCOztBQUVBLFFBQUlILGFBQWEsSUFBSUMsUUFBakIsSUFBNkJELGFBQWEsQ0FBQ00sWUFBZCxDQUEyQixrQkFBM0IsQ0FBakMsRUFBaUY7QUFDL0VILHlCQUFtQixDQUFDSSxJQUFwQixDQUF5QlAsYUFBekI7QUFDRDs7QUFFRCxTQUFLLElBQUlRLENBQUMsR0FBQyxDQUFYLEVBQWNBLENBQUMsR0FBQ0wsbUJBQW1CLENBQUNNLE1BQXBDLEVBQTRDRCxDQUFDLEVBQTdDLEVBQWlEO0FBQ2hELFVBQUlFLFFBQVEsQ0FBQ0MsUUFBVCxDQUFrQkMsY0FBbEIsQ0FBaUNULG1CQUFtQixDQUFDSyxDQUFELENBQXBELEVBQXlELGtCQUF6RCxDQUFKLEVBQWtGO0FBQ2xGO0FBQ0E7O0FBQ0RFLGNBQVEsQ0FBQ0MsUUFBVCxDQUFrQkUsY0FBbEIsQ0FBaUNWLG1CQUFtQixDQUFDSyxDQUFELENBQXBELEVBQXlELGtCQUF6RDtBQUVFLFdBQUtNLHNCQUFMLENBQTRCWCxtQkFBbUIsQ0FBQ0ssQ0FBRCxDQUEvQztBQUNEO0FBRUYsR0EzQnVCO0FBNkJ4Qk0sd0JBQXNCLEVBQUUsZ0NBQVNDLEdBQVQsRUFBYztBQUVsQyxRQUFNQyxJQUFJLEdBQUcsSUFBYjtBQUNBLFFBQUlDLGdCQUFnQixHQUFHRixHQUFHLENBQUNHLFlBQUosQ0FBaUIsa0JBQWpCLENBQXZCO0FBQ0EsUUFBSUMsR0FBRyxHQUFHLEtBQUtDLE1BQUwsQ0FBWUgsZ0JBQVosQ0FBVjs7QUFFQSxTQUFLLElBQUlULENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdXLEdBQUcsQ0FBQ1YsTUFBeEIsRUFBZ0NELENBQUMsRUFBakMsRUFBcUM7QUFDbkMsVUFBSWEsRUFBRSxHQUFHRixHQUFHLENBQUNYLENBQUQsQ0FBWjtBQUVBLFVBQUljLEtBQUssR0FBR3JCLFFBQVEsQ0FBQ3NCLGNBQVQsQ0FBd0JGLEVBQXhCLENBQVo7O0FBQ0EsVUFBSUMsS0FBSixFQUFXO0FBQ1RBLGFBQUssQ0FBQ0UsZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0MsWUFBVztBQUN6Q1IsY0FBSSxDQUFDUyxrQkFBTCxDQUF3QlYsR0FBeEI7QUFDRCxTQUZEO0FBSUFPLGFBQUssQ0FBQ0UsZ0JBQU4sQ0FBdUIsd0JBQXZCLEVBQWlELFlBQVc7QUFDMURFLGlCQUFPLENBQUNDLEdBQVIsQ0FBWSw2Q0FBWjtBQUNFWCxjQUFJLENBQUNTLGtCQUFMLENBQXdCVixHQUF4QjtBQUNILFNBSEQ7QUFLRDtBQUNGO0FBRUosR0FwRHVCO0FBdUR4QlUsb0JBQWtCLEVBQUUsNEJBQVNWLEdBQVQsRUFBYztBQUNoQyxRQUFJRSxnQkFBZ0IsR0FBR0YsR0FBRyxDQUFDRyxZQUFKLENBQWlCLGtCQUFqQixDQUF2QjtBQUVBLFFBQUlVLFNBQVMsR0FBRyxLQUFLQyxrQkFBTCxDQUF3QlosZ0JBQXhCLENBQWhCO0FBRUFTLFdBQU8sQ0FBQ0MsR0FBUixDQUFZQyxTQUFaOztBQUNBLFFBQUlBLFNBQUosRUFBZTtBQUNiLFVBQUlFLE1BQU0sR0FBR0MsV0FBVyxDQUFDSCxTQUFELENBQXhCOztBQUNBLFVBQUliLEdBQUcsQ0FBQ2lCLE9BQUosSUFBZSxPQUFmLElBQTBCakIsR0FBRyxDQUFDaUIsT0FBSixJQUFlLFVBQXpDLElBQXVEakIsR0FBRyxDQUFDaUIsT0FBSixJQUFlLFFBQTFFLEVBQW9GO0FBQ2xGakIsV0FBRyxDQUFDa0IsS0FBSixHQUFZSCxNQUFaLENBRGtGLENBRWxGO0FBQ0E7QUFDQTtBQUNELE9BTEQsTUFLTztBQUNMZixXQUFHLENBQUNtQixTQUFKLEdBQWdCSixNQUFoQixDQURLLENBRUw7QUFDQTtBQUNBO0FBQ0Q7QUFDRjtBQUVGLEdBNUV1QjtBQThFeEJELG9CQUFrQixFQUFFLDRCQUFTWixnQkFBVCxFQUEyQjtBQUM3QyxRQUFJRSxHQUFHLEdBQUcsS0FBS0MsTUFBTCxDQUFZSCxnQkFBWixDQUFWOztBQUVBLFNBQUssSUFBSVQsQ0FBQyxHQUFDLENBQVgsRUFBY0EsQ0FBQyxHQUFHVyxHQUFHLENBQUNWLE1BQXRCLEVBQThCRCxDQUFDLEVBQS9CLEVBQW1DO0FBQ2pDLFVBQUlhLEVBQUUsR0FBR0YsR0FBRyxDQUFDWCxDQUFELENBQVo7QUFFQSxVQUFJYyxLQUFLLEdBQUdyQixRQUFRLENBQUNzQixjQUFULENBQXdCRixFQUF4QixDQUFaOztBQUNBLFVBQUlDLEtBQUosRUFBVztBQUNULFlBQUlXLEtBQUssR0FBR0UsTUFBTSxDQUFDYixLQUFLLENBQUNXLEtBQVAsQ0FBbEI7QUFFQWhCLHdCQUFnQixHQUFHQSxnQkFBZ0IsQ0FBQ21CLE9BQWpCLENBQXlCLElBQUlDLE1BQUosQ0FBVyxNQUFNaEIsRUFBTixHQUFXLEdBQXRCLEVBQTJCLEdBQTNCLENBQXpCLEVBQTBEWSxLQUExRCxDQUFuQjtBQUNEO0FBQ0Y7O0FBRUQsV0FBT2hCLGdCQUFQO0FBQ0QsR0E3RnVCO0FBK0Z4QkcsUUFBTSxFQUFFLGdCQUFTa0IsTUFBVCxFQUFpQjtBQUN2QixRQUFJQyxHQUFHLEdBQUdELE1BQVY7QUFFQSxRQUFJbkIsR0FBRyxHQUFHLEVBQVY7QUFDQSxRQUFJLENBQUNvQixHQUFMLEVBQVUsT0FBT3BCLEdBQVA7O0FBQ1YsV0FBT29CLEdBQUcsQ0FBQzlCLE1BQUosR0FBYSxDQUFwQixFQUF1QjtBQUNyQixVQUFJK0IsVUFBVSxHQUFHRCxHQUFHLENBQUNFLE9BQUosQ0FBWSxHQUFaLENBQWpCO0FBQ0EsVUFBSUMsV0FBVyxHQUFHSCxHQUFHLENBQUNFLE9BQUosQ0FBWSxHQUFaLEVBQWlCRCxVQUFqQixDQUFsQjs7QUFFQSxVQUFJQSxVQUFVLEdBQUcsQ0FBQyxDQUFkLElBQW1CRSxXQUFXLEdBQUcsQ0FBQyxDQUF0QyxFQUF5QztBQUN2QyxZQUFJckIsRUFBRSxHQUFHa0IsR0FBRyxDQUFDSSxTQUFKLENBQWNILFVBQVUsR0FBRyxDQUEzQixFQUE4QkUsV0FBOUIsQ0FBVDtBQUVBLFlBQUl2QixHQUFHLENBQUNzQixPQUFKLENBQVlwQixFQUFaLEtBQW1CLENBQUMsQ0FBeEIsRUFBMkJGLEdBQUcsQ0FBQ1osSUFBSixDQUFTYyxFQUFUO0FBRTNCa0IsV0FBRyxHQUFHQSxHQUFHLENBQUNJLFNBQUosQ0FBY0QsV0FBVyxHQUFHLENBQTVCLENBQU47QUFFRCxPQVBELE1BT087QUFDTCxlQUFPdkIsR0FBUDtBQUNEO0FBQ0Y7O0FBRUQsV0FBT0EsR0FBUDtBQUNEO0FBckh1QixDQUExQjs7QUF3SEEsU0FBU1ksV0FBVCxDQUFxQk8sTUFBckIsRUFBNkI7QUFDM0IsTUFBSU0sTUFBSixFQUFZQyxNQUFaLEVBQW9CQyxNQUFwQixFQUE0QkMsTUFBNUI7QUFFQUgsUUFBTSxHQUFHTixNQUFNLENBQUNHLE9BQVAsQ0FBZSxHQUFmLENBQVQ7QUFDQUksUUFBTSxHQUFHUCxNQUFNLENBQUNHLE9BQVAsQ0FBZSxHQUFmLENBQVQ7QUFDQUssUUFBTSxHQUFHUixNQUFNLENBQUNHLE9BQVAsQ0FBZSxHQUFmLENBQVQ7QUFDQU0sUUFBTSxHQUFHVCxNQUFNLENBQUNHLE9BQVAsQ0FBZSxHQUFmLENBQVQ7O0FBR0EsTUFBSUcsTUFBTSxHQUFHLENBQUMsQ0FBZCxFQUFpQjtBQUNmLFFBQUlJLElBQUksR0FBR1YsTUFBTSxDQUFDVyxNQUFQLENBQWMsQ0FBZCxFQUFpQkwsTUFBakIsQ0FBWDtBQUNBLFFBQUlNLElBQUksR0FBR1osTUFBTSxDQUFDVyxNQUFQLENBQWNMLE1BQU0sR0FBRyxDQUF2QixDQUFYO0FBRUEsV0FBT2IsV0FBVyxDQUFDaUIsSUFBRCxDQUFYLEdBQW9CakIsV0FBVyxDQUFDbUIsSUFBRCxDQUF0QztBQUVELEdBTkQsTUFNTyxJQUFJTCxNQUFNLEdBQUcsQ0FBQyxDQUFkLEVBQWlCO0FBQ3RCLFFBQUlHLEtBQUksR0FBR1YsTUFBTSxDQUFDVyxNQUFQLENBQWMsQ0FBZCxFQUFpQkosTUFBakIsQ0FBWDs7QUFDQSxRQUFJSyxLQUFJLEdBQUdaLE1BQU0sQ0FBQ1csTUFBUCxDQUFjSixNQUFNLEdBQUcsQ0FBdkIsQ0FBWDs7QUFFQSxXQUFPZCxXQUFXLENBQUNpQixLQUFELENBQVgsR0FBb0JqQixXQUFXLENBQUNtQixLQUFELENBQXRDO0FBRUQsR0FOTSxNQU1BLElBQUlKLE1BQU0sR0FBRyxDQUFDLENBQWQsRUFBaUI7QUFDdEIsUUFBSUUsTUFBSSxHQUFHVixNQUFNLENBQUNXLE1BQVAsQ0FBYyxDQUFkLEVBQWlCSCxNQUFqQixDQUFYOztBQUNBLFFBQUlJLE1BQUksR0FBR1osTUFBTSxDQUFDVyxNQUFQLENBQWNILE1BQU0sR0FBRyxDQUF2QixDQUFYOztBQUVBLFdBQU9mLFdBQVcsQ0FBQ2lCLE1BQUQsQ0FBWCxHQUFvQmpCLFdBQVcsQ0FBQ21CLE1BQUQsQ0FBdEM7QUFDRCxHQUxNLE1BS0EsSUFBSUgsTUFBTSxHQUFHLENBQUMsQ0FBZCxFQUFpQjtBQUN0QixRQUFJQyxNQUFJLEdBQUdWLE1BQU0sQ0FBQ1csTUFBUCxDQUFjLENBQWQsRUFBaUJGLE1BQWpCLENBQVg7O0FBQ0EsUUFBSUcsTUFBSSxHQUFHWixNQUFNLENBQUNXLE1BQVAsQ0FBY0YsTUFBTSxHQUFHLENBQXZCLENBQVg7O0FBRUEsUUFBSUksTUFBTSxHQUFHcEIsV0FBVyxDQUFDaUIsTUFBRCxDQUF4QjtBQUNBLFFBQUlJLE1BQU0sR0FBR3JCLFdBQVcsQ0FBQ21CLE1BQUQsQ0FBeEI7O0FBRUEsUUFBSUUsTUFBTSxJQUFJLENBQWQsRUFBaUI7QUFDZixhQUFPLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPRCxNQUFNLEdBQUdDLE1BQWhCO0FBQ0Q7QUFFRixHQWJNLE1BYUE7QUFDTCxRQUFJdEIsTUFBTSxHQUFHSyxNQUFNLENBQUNHLE1BQUQsQ0FBbkI7O0FBRUEsUUFBSWUsS0FBSyxDQUFDdkIsTUFBRCxDQUFULEVBQW1CO0FBQ2pCLGFBQU8sQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU9BLE1BQVA7QUFDRDtBQUdGO0FBRUY7O0FBRURsQyxtQkFBbUIsQ0FBQ0MsSUFBcEI7QUFFQWEsUUFBUSxDQUFDQyxRQUFULENBQWtCMkMsR0FBbEIsQ0FBc0I7QUFDckJDLE1BQUksRUFBRSxnQ0FEZTtBQUVyQkMsU0FBTyxFQUFFLENBQUMsWUFBRCxDQUZZO0FBR3JCQyxZQUFVLEVBQUUsQ0FBQyxPQUFELENBSFM7QUFJcEJDLFNBQU8sRUFBRSxPQUpXO0FBS3JCQyxVQUFRLEVBQUUsa0JBQVNDLFFBQVQsRUFBbUI7QUFDM0JsQyxXQUFPLENBQUNDLEdBQVIsQ0FBWSx1REFBWjtBQUNERCxXQUFPLENBQUNDLEdBQVIsQ0FBWWlDLFFBQVEsQ0FBQ0MsTUFBckI7QUFDQTtBQVJvQixDQUF0QjtBQVdBbkQsUUFBUSxDQUFDQyxRQUFULENBQWtCMkMsR0FBbEIsQ0FBc0I7QUFDckJDLE1BQUksRUFBRSx5QkFEZTtBQUVyQkMsU0FBTyxFQUFFLENBQUMsU0FBRCxFQUFZLFdBQVosQ0FGWTtBQUdwQkUsU0FBTyxFQUFFLG9CQUhXO0FBSXJCQyxVQUFRLEVBQUUsa0JBQVNDLFFBQVQsRUFBbUI7QUFDNUJoRSx1QkFBbUIsQ0FBQ0UsdUJBQXBCLENBQTRDOEQsUUFBUSxDQUFDQyxNQUFyRDtBQUNBO0FBTm9CLENBQXRCO0FBU2VqRSxrRkFBZiIsImZpbGUiOiIuLi9Db0NyZWF0ZS1jb21wb25lbnRzL0NvQ3JlYXRlLWNhbGN1bGF0aW9uL3NyYy9Db0NyZWF0ZS1jYWxjdWxhdGlvbi5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBDb0NyZWF0ZUNhbGN1bGF0aW9uID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmluaXRDYWxjdWxhdGlvbkVsZW1lbnRzKCk7XG4gIH0sXG4gICAgXG4gICAgXG4gIGluaXRDYWxjdWxhdGlvbkVsZW1lbnRzOiBmdW5jdGlvbihjb250YWluZXIpIHtcbiAgICBjb25zdCBtYWluQ29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50O1xuICAgIGlmICghbWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjYWxjdWxhdGlvbkVsZW1lbnRzID0gbWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jYWxjdWxhdGlvbl0nKSB8fCBbXTtcbiAgICBjYWxjdWxhdGlvbkVsZW1lbnRzID0gQXJyYXkuZnJvbShjYWxjdWxhdGlvbkVsZW1lbnRzKTtcbiAgICBcbiAgICBpZiAobWFpbkNvbnRhaW5lciAhPSBkb2N1bWVudCAmJiBtYWluQ29udGFpbmVyLmhhc0F0dHJpYnV0ZSgnZGF0YS1jYWxjdWxhdGlvbicpKSB7XG4gICAgICBjYWxjdWxhdGlvbkVsZW1lbnRzLnB1c2gobWFpbkNvbnRhaW5lcik7ICBcbiAgICB9XG4gICAgXG4gICAgZm9yIChsZXQgaT0wOyBpPGNhbGN1bGF0aW9uRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBcdGlmIChDb0NyZWF0ZS5vYnNlcnZlci5nZXRJbml0aWFsaXplZChjYWxjdWxhdGlvbkVsZW1lbnRzW2ldLCBcImNhbGN1bGF0aW9uX2luaXRcIikpIHtcbiAgXHRcdFx0cmV0dXJuO1xuICBcdFx0fVxuICBcdFx0Q29DcmVhdGUub2JzZXJ2ZXIuc2V0SW5pdGlhbGl6ZWQoY2FsY3VsYXRpb25FbGVtZW50c1tpXSwgXCJjYWxjdWxhdGlvbl9pbml0XCIpXG4gIFx0XHRcbiAgICAgIHRoaXMuaW5pdENhbGN1bGF0aW9uRWxlbWVudChjYWxjdWxhdGlvbkVsZW1lbnRzW2ldKTsgIFxuICAgIH1cbiAgICBcbiAgfSxcbiAgICBcbiAgaW5pdENhbGN1bGF0aW9uRWxlbWVudDogZnVuY3Rpb24oZWxlKSB7XG4gICAgXG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIGxldCBkYXRhX2NhbGN1bGF0aW9uID0gZWxlLmdldEF0dHJpYnV0ZSgnZGF0YS1jYWxjdWxhdGlvbicpO1xuICAgICAgbGV0IGlkcyA9IHRoaXMuZ2V0SWRzKGRhdGFfY2FsY3VsYXRpb24pOyBcbiAgICAgIFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGlkID0gaWRzW2ldO1xuICAgICAgICBcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zZXRDYWxjYXRpb25SZXN1bHQoZWxlKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIFxuICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ0NvQ3JlYXRlSW5wdXQtc2V0dmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJylcbiAgICAgICAgICAgICAgc2VsZi5zZXRDYWxjYXRpb25SZXN1bHQoZWxlKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICB9LFxuICBcbiAgICBcbiAgc2V0Q2FsY2F0aW9uUmVzdWx0OiBmdW5jdGlvbihlbGUpIHtcbiAgICBsZXQgZGF0YV9jYWxjdWxhdGlvbiA9IGVsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2FsY3VsYXRpb24nKTtcbiAgICBcbiAgICBsZXQgY2FsU3RyaW5nID0gdGhpcy5yZXBsYWNlSWRXaXRoVmFsdWUoZGF0YV9jYWxjdWxhdGlvbik7XG4gICAgXG4gICAgY29uc29sZS5sb2coY2FsU3RyaW5nKTtcbiAgICBpZiAoY2FsU3RyaW5nKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gY2FsY3VsYXRpb24oY2FsU3RyaW5nKTtcbiAgICAgIGlmIChlbGUudGFnTmFtZSA9PSAnSU5QVVQnIHx8IGVsZS50YWdOYW1lID09ICdURVhUQVJFQScgfHwgZWxlLnRhZ05hbWUgPT0gJ1NFTEVDVCcpIHtcbiAgICAgICAgZWxlLnZhbHVlID0gcmVzdWx0XG4gICAgICAgIC8vIGlmICh3aW5kb3cuQ29DcmVhdGVJbnB1dCkge1xuICAgICAgICAvLyAgIHdpbmRvdy5Db0NyZWF0ZUlucHV0LnNhdmUoZWxlKVxuICAgICAgICAvLyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGUuaW5uZXJIVE1MID0gcmVzdWx0O1xuICAgICAgICAvLyBpZiAod2luZG93LkNvQ3JlYXRlSHRtbFRhZ3MpIHtcbiAgICAgICAgLy8gICB3aW5kb3cuQ29DcmVhdGVIdG1sVGFncy5zYXZlKGVsZSk7XG4gICAgICAgIC8vIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gIH0sXG4gICAgXG4gIHJlcGxhY2VJZFdpdGhWYWx1ZTogZnVuY3Rpb24oZGF0YV9jYWxjdWxhdGlvbikge1xuICAgIGxldCBpZHMgPSB0aGlzLmdldElkcyhkYXRhX2NhbGN1bGF0aW9uKTtcbiAgICBcbiAgICBmb3IgKGxldCBpPTA7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBpZCA9IGlkc1tpXTtcbiAgICAgIFxuICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IE51bWJlcihpbnB1dC52YWx1ZSk7XG4gICAgICBcbiAgICAgICAgZGF0YV9jYWxjdWxhdGlvbiA9IGRhdGFfY2FsY3VsYXRpb24ucmVwbGFjZShuZXcgUmVnRXhwKCd7JyArIGlkICsgJ30nLCAnZycpLCB2YWx1ZSk7ICAgXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBkYXRhX2NhbGN1bGF0aW9uO1xuICB9LFxuICAgIFxuICBnZXRJZHM6IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIGxldCB0bXAgPSBzdHJpbmc7XG4gICAgXG4gICAgbGV0IGlkcyA9IFtdXG4gICAgaWYgKCF0bXApIHJldHVybiBpZHM7XG4gICAgd2hpbGUgKHRtcC5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZmlyc3RJbmRleCA9IHRtcC5pbmRleE9mKCd7Jyk7XG4gICAgICBsZXQgc2Vjb25kSW5kZXggPSB0bXAuaW5kZXhPZignfScsIGZpcnN0SW5kZXgpO1xuICAgICAgXG4gICAgICBpZiAoZmlyc3RJbmRleCA+IC0xICYmIHNlY29uZEluZGV4ID4gLTEpIHtcbiAgICAgICAgbGV0IGlkID0gdG1wLnN1YnN0cmluZyhmaXJzdEluZGV4ICsgMSwgc2Vjb25kSW5kZXgpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGlkcy5pbmRleE9mKGlkKSA9PSAtMSkgaWRzLnB1c2goaWQpO1xuICBcbiAgICAgICAgdG1wID0gdG1wLnN1YnN0cmluZyhzZWNvbmRJbmRleCArIDEpO1xuICAgICAgICBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHM7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBpZHM7XG4gIH0sXG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0aW9uKHN0cmluZykge1xuICBsZXQgaW5kZXgxLCBpbmRleDIsIGluZGV4MywgaW5kZXg0O1xuICBcbiAgaW5kZXgxID0gc3RyaW5nLmluZGV4T2YoJysnKTtcbiAgaW5kZXgyID0gc3RyaW5nLmluZGV4T2YoJy0nKTtcbiAgaW5kZXgzID0gc3RyaW5nLmluZGV4T2YoJyonKTtcbiAgaW5kZXg0ID0gc3RyaW5nLmluZGV4T2YoJy8nKTtcbiAgXG4gIFxuICBpZiAoaW5kZXgxID4gLTEpIHtcbiAgICBsZXQgbFN0ciA9IHN0cmluZy5zdWJzdHIoMCwgaW5kZXgxKTtcbiAgICBsZXQgclN0ciA9IHN0cmluZy5zdWJzdHIoaW5kZXgxICsgMSk7XG4gICAgXG4gICAgcmV0dXJuIGNhbGN1bGF0aW9uKGxTdHIpICsgY2FsY3VsYXRpb24oclN0cik7XG4gICAgXG4gIH0gZWxzZSBpZiAoaW5kZXgyID4gLTEpIHtcbiAgICBsZXQgbFN0ciA9IHN0cmluZy5zdWJzdHIoMCwgaW5kZXgyKTtcbiAgICBsZXQgclN0ciA9IHN0cmluZy5zdWJzdHIoaW5kZXgyICsgMSk7XG4gICAgXG4gICAgcmV0dXJuIGNhbGN1bGF0aW9uKGxTdHIpIC0gY2FsY3VsYXRpb24oclN0cik7XG4gICAgXG4gIH0gZWxzZSBpZiAoaW5kZXgzID4gLTEpIHtcbiAgICBsZXQgbFN0ciA9IHN0cmluZy5zdWJzdHIoMCwgaW5kZXgzKTtcbiAgICBsZXQgclN0ciA9IHN0cmluZy5zdWJzdHIoaW5kZXgzICsgMSk7XG4gICAgXG4gICAgcmV0dXJuIGNhbGN1bGF0aW9uKGxTdHIpICogY2FsY3VsYXRpb24oclN0cik7XG4gIH0gZWxzZSBpZiAoaW5kZXg0ID4gLTEpIHtcbiAgICBsZXQgbFN0ciA9IHN0cmluZy5zdWJzdHIoMCwgaW5kZXg0KTtcbiAgICBsZXQgclN0ciA9IHN0cmluZy5zdWJzdHIoaW5kZXg0ICsgMSk7XG4gICAgXG4gICAgbGV0IGxWYWx1ZSA9IGNhbGN1bGF0aW9uKGxTdHIpO1xuICAgIGxldCByVmFsdWUgPSBjYWxjdWxhdGlvbihyU3RyKTtcbiAgICBcbiAgICBpZiAoclZhbHVlID09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbFZhbHVlIC8gclZhbHVlO1xuICAgIH1cbiAgICBcbiAgfSBlbHNlIHtcbiAgICBsZXQgcmVzdWx0ID0gTnVtYmVyKHN0cmluZyk7XG4gICAgXG4gICAgaWYgKGlzTmFOKHJlc3VsdCkpIHtcbiAgICAgIHJldHVybiAwOyBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgXG4gIH1cbiAgXG59XG5cbkNvQ3JlYXRlQ2FsY3VsYXRpb24uaW5pdCgpO1xuXG5Db0NyZWF0ZS5vYnNlcnZlci5hZGQoeyBcblx0bmFtZTogJ0NvQ3JlYXRlQ2FsY3VsYXRpb25DaGFuZ2VWYWx1ZScsIFxuXHRvYnNlcnZlOiBbJ2F0dHJpYnV0ZXMnXSxcblx0YXR0cmlidXRlczogWyd2YWx1ZSddLFxuICBpbmNsdWRlOiAnaW5wdXQnLFxuXHRjYWxsYmFjazogZnVuY3Rpb24obXV0YXRpb24pIHtcblx0ICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuXHRcdGNvbnNvbGUubG9nKG11dGF0aW9uLnRhcmdldClcblx0fVxufSk7XG5cbkNvQ3JlYXRlLm9ic2VydmVyLmFkZCh7IFxuXHRuYW1lOiAnQ29DcmVhdGVDYWxjdWxhdGlvbkluaXQnLCBcblx0b2JzZXJ2ZTogWydzdWJ0cmVlJywgJ2NoaWxkTGlzdCddLFxuICBpbmNsdWRlOiAnW2RhdGEtY2FsY3VsYXRpb25dJyxcblx0Y2FsbGJhY2s6IGZ1bmN0aW9uKG11dGF0aW9uKSB7XG5cdFx0Q29DcmVhdGVDYWxjdWxhdGlvbi5pbml0Q2FsY3VsYXRpb25FbGVtZW50cyhtdXRhdGlvbi50YXJnZXQpXG5cdH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDb0NyZWF0ZUNhbGN1bGF0aW9uOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../CoCreate-components/CoCreate-calculation/src/CoCreate-calculation.js\n");

/***/ })

/******/ })["default"];
});