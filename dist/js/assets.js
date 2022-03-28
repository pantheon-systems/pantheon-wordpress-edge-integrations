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
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/assets.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/assets.js":
/*!*****************************!*\
  !*** ./assets/js/assets.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _interest_count__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interest-count */ "./assets/js/interest-count.js");
/* harmony import */ var _gtm_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gtm-headers */ "./assets/js/gtm-headers.js");
/* harmony import */ var _gtm_headers__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_gtm_headers__WEBPACK_IMPORTED_MODULE_1__);



/***/ }),

/***/ "./assets/js/gtm-headers.js":
/*!**********************************!*\
  !*** ./assets/js/gtm-headers.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* global eiGtm */
// eslint-disable-next-line no-var
var Pantheon = window.Pantheon || {};
Pantheon.varyHeaders = eiGtm.headersEnabled;
Pantheon.GTM = {
  interest: Pantheon.varyHeaders.includes('Interest') ? eiGtm.interest : null,
  geo: Pantheon.varyHeaders.includes('Audience') || Pantheon.varyHeaders.includes('Audience-Set') ? eiGtm.geo : null
};
/**
 * Push personalization data to GTM.
 */

Pantheon.GTM.dataPush = function () {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'pzn',
    'audience': {
      'geo': Pantheon.GTM.geo
    },
    'interest': Pantheon.GTM.interest
  });
};

Pantheon.GTM.dataPush();

/***/ }),

/***/ "./assets/js/interest-count.js":
/*!*************************************!*\
  !*** ./assets/js/interest-count.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);
/*global eiInterest*/

/**
 * @file
 * Count interests and set cookie for interest header.
 */

let runOnce;
/**
 * Update tagsCount with current post tags.
 *
 * @param {Array} postTags Array of post tags.
 * @param {object} tagsCount Object of tags and counts.
 *
 * @returns {object} Object of tags and counts.
 */

function updateTagsCount(postTags, tagsCount) {
  // Loop through current post tags.
  postTags.forEach(tag => {
    // If tag already exists in tagsCount, increment.
    if (tag in tagsCount) {
      tagsCount[tag]++;
    } else {
      tagsCount[tag] = 1;
    }
  });
  return tagsCount;
}
/**
 * Filter out the most popular tags.
 *
 * @param {object} tagsCount Object of tags and counts.
 * @param {number} popularityCount How many times should a tag be visited before adding to interest header.
 *
 * @returns {object} Object of tags and counts.
 */


function getInterestTags(tagsCount, popularityCount) {
  // Find the highest count among the tags.
  let maxCount = 0;
  Object.keys(tagsCount).forEach(tag => {
    // If tag's count is above popularityCount and other tag counts.
    if (tagsCount[tag] >= popularityCount && tagsCount[tag] > maxCount) {
      maxCount = tagsCount[tag];
    }
  }); // If there are valid tags with a maxCount.

  if (maxCount > 0) {
    // Convert tagsCount to array.
    let tagsCountArray = Object.entries(tagsCount); // Retrieve all tags with count equal to maxCount.

    tagsCountArray = tagsCountArray.filter(([key, value]) => value === maxCount); // Convert array back to object.

    return Object.fromEntries(tagsCountArray);
  } // If no tag has a sufficient maxCount, return an empty object.


  return {};
}
/**
 *
 */


function getInterests() {
  /**
   * Class to handle localStorage.
   */
  class LocalStorage {
    /**
     * Implements constructor().
     */
    constructor() {
      // localStorage key.
      this.key = 'eiInterest.interest';
    }
    /**
     * Get value in localStorage.
     *
     * @returns {string} Value in localStorage.
     */


    getStorage() {
      let item = localStorage.getItem(this.key);
      return item ? JSON.parse(item) : {};
    }
    /**
     * Set value in localStorage.
     *
     * @param {string} value Value to set.
     */


    setStorage(value) {
      localStorage.setItem(this.key, JSON.stringify(value));
    }

  }

  if (!runOnce) {
    runOnce = true;
    const localizedObj = eiInterest; // How many times should a tag be visited before adding to interest header.

    const popularityCount = localizedObj.interest_threshold ? localizedObj.interest_threshold : 3;
    const postTags = localizedObj.post_terms;
    const cookieExpiration = localizedObj.cookie_expiration ? localizedObj.cookie_expiration : 14;

    if (postTags) {
      // Create LocalStorage instance.
      let storage = new LocalStorage(); // Get tagsCount from localStorage if it exists.

      let tagsCount = storage.getStorage(); // Update tagsCount with current post tags.

      tagsCount = updateTagsCount(postTags, tagsCount); // Save updated counts to localStorage.

      storage.setStorage(tagsCount); // Filter most popular tags.

      let interestTagsCount = getInterestTags(tagsCount, popularityCount); // Get array of popular tag tids.

      let interestTags = Object.keys(interestTagsCount);

      if (interestTags.length > 0) {
        const CookieAttributes = {
          expires: parseInt(cookieExpiration)
        }; // Set interest cookie with popular tags, separated by |, and any attributes.

        js_cookie__WEBPACK_IMPORTED_MODULE_0___default.a.set('interest', interestTags.join('|'), CookieAttributes);
      }
    }
  }
}

getInterests();

/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.js":
/*!**************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*! js-cookie v3.0.1 | MIT */
;
(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  /* eslint-disable no-var */
  function assign (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target
  }
  /* eslint-enable no-var */

  /* eslint-disable no-var */
  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  };
  /* eslint-enable no-var */

  /* eslint-disable no-var */

  function init (converter, defaultAttributes) {
    function set (key, value, attributes) {
      if (typeof document === 'undefined') {
        return
      }

      attributes = assign({}, defaultAttributes, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }

      key = encodeURIComponent(key)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie =
        key + '=' + converter.write(value, key) + stringifiedAttributes)
    }

    function get (key) {
      if (typeof document === 'undefined' || (arguments.length && !key)) {
        return
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');

        try {
          var foundKey = decodeURIComponent(parts[0]);
          jar[foundKey] = converter.read(value, foundKey);

          if (key === foundKey) {
            break
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar
    }

    return Object.create(
      {
        set: set,
        get: get,
        remove: function (key, attributes) {
          set(
            key,
            '',
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes))
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes)
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    )
  }

  var api = init(defaultConverter, { path: '/' });
  /* eslint-enable no-var */

  return api;

})));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYXNzZXRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9hc3NldHMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2d0bS1oZWFkZXJzLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9pbnRlcmVzdC1jb3VudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYXNzZXRzL2pzL2Fzc2V0cy5qc1wiKTtcbiIsImltcG9ydCAnLi9pbnRlcmVzdC1jb3VudCc7XG5pbXBvcnQgJy4vZ3RtLWhlYWRlcnMnO1xuIiwiLyogZ2xvYmFsIGVpR3RtICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdmFyXG52YXIgUGFudGhlb24gPSB3aW5kb3cuUGFudGhlb24gfHwge307XG5cblBhbnRoZW9uLnZhcnlIZWFkZXJzID0gZWlHdG0uaGVhZGVyc0VuYWJsZWQ7XG5cblBhbnRoZW9uLkdUTSA9IHtcblx0aW50ZXJlc3Q6IFBhbnRoZW9uLnZhcnlIZWFkZXJzLmluY2x1ZGVzKCAnSW50ZXJlc3QnICkgPyBlaUd0bS5pbnRlcmVzdCA6IG51bGwsXG5cdGdlbzogUGFudGhlb24udmFyeUhlYWRlcnMuaW5jbHVkZXMoICdBdWRpZW5jZScgKSB8fCBQYW50aGVvbi52YXJ5SGVhZGVycy5pbmNsdWRlcyggJ0F1ZGllbmNlLVNldCcgKSA/IGVpR3RtLmdlbyA6IG51bGwsXG59O1xuXG4vKipcbiAqIFB1c2ggcGVyc29uYWxpemF0aW9uIGRhdGEgdG8gR1RNLlxuICovXG5QYW50aGVvbi5HVE0uZGF0YVB1c2ggPSBmdW5jdGlvbiAoKSB7XG5cdHdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdO1xuXHR3aW5kb3cuZGF0YUxheWVyLnB1c2goIHtcblx0XHQnZXZlbnQnOiAncHpuJyxcblx0XHQnYXVkaWVuY2UnOiB7XG5cdFx0XHQnZ2VvJzogUGFudGhlb24uR1RNLmdlbyxcblx0XHR9LFxuXHRcdCdpbnRlcmVzdCc6IFBhbnRoZW9uLkdUTS5pbnRlcmVzdCxcblx0fSApO1xufTtcblxuUGFudGhlb24uR1RNLmRhdGFQdXNoKCk7XG4iLCIvKmdsb2JhbCBlaUludGVyZXN0Ki9cbi8qKlxuICogQGZpbGVcbiAqIENvdW50IGludGVyZXN0cyBhbmQgc2V0IGNvb2tpZSBmb3IgaW50ZXJlc3QgaGVhZGVyLlxuICovXG5cbmltcG9ydCBjb29raWVzIGZyb20gJ2pzLWNvb2tpZSc7XG5cbmxldCBydW5PbmNlO1xuXG4vKipcbiAqIFVwZGF0ZSB0YWdzQ291bnQgd2l0aCBjdXJyZW50IHBvc3QgdGFncy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwb3N0VGFncyBBcnJheSBvZiBwb3N0IHRhZ3MuXG4gKiBAcGFyYW0ge29iamVjdH0gdGFnc0NvdW50IE9iamVjdCBvZiB0YWdzIGFuZCBjb3VudHMuXG4gKlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHRhZ3MgYW5kIGNvdW50cy5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlVGFnc0NvdW50KCBwb3N0VGFncywgdGFnc0NvdW50ICkge1xuXHQvLyBMb29wIHRocm91Z2ggY3VycmVudCBwb3N0IHRhZ3MuXG5cdHBvc3RUYWdzLmZvckVhY2goIHRhZyA9PiB7XG5cdFx0Ly8gSWYgdGFnIGFscmVhZHkgZXhpc3RzIGluIHRhZ3NDb3VudCwgaW5jcmVtZW50LlxuXHRcdGlmICggdGFnIGluIHRhZ3NDb3VudCApIHtcblx0XHRcdHRhZ3NDb3VudFt0YWddKys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhZ3NDb3VudFt0YWddID0gMTtcblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gdGFnc0NvdW50O1xufVxuXG4vKipcbiAqIEZpbHRlciBvdXQgdGhlIG1vc3QgcG9wdWxhciB0YWdzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YWdzQ291bnQgT2JqZWN0IG9mIHRhZ3MgYW5kIGNvdW50cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3B1bGFyaXR5Q291bnQgSG93IG1hbnkgdGltZXMgc2hvdWxkIGEgdGFnIGJlIHZpc2l0ZWQgYmVmb3JlIGFkZGluZyB0byBpbnRlcmVzdCBoZWFkZXIuXG4gKlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHRhZ3MgYW5kIGNvdW50cy5cbiAqL1xuZnVuY3Rpb24gZ2V0SW50ZXJlc3RUYWdzKCB0YWdzQ291bnQsIHBvcHVsYXJpdHlDb3VudCApIHtcblx0Ly8gRmluZCB0aGUgaGlnaGVzdCBjb3VudCBhbW9uZyB0aGUgdGFncy5cblx0bGV0IG1heENvdW50ID0gMDtcblx0T2JqZWN0LmtleXMoIHRhZ3NDb3VudCApLmZvckVhY2goIHRhZyA9PiB7XG5cdFx0Ly8gSWYgdGFnJ3MgY291bnQgaXMgYWJvdmUgcG9wdWxhcml0eUNvdW50IGFuZCBvdGhlciB0YWcgY291bnRzLlxuXHRcdGlmICggdGFnc0NvdW50W3RhZ10gPj0gcG9wdWxhcml0eUNvdW50ICYmIHRhZ3NDb3VudFt0YWddID4gbWF4Q291bnQgKSB7XG5cdFx0XHRtYXhDb3VudCA9IHRhZ3NDb3VudFt0YWddO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIElmIHRoZXJlIGFyZSB2YWxpZCB0YWdzIHdpdGggYSBtYXhDb3VudC5cblx0aWYgKCBtYXhDb3VudCA+IDAgKSB7XG5cdFx0Ly8gQ29udmVydCB0YWdzQ291bnQgdG8gYXJyYXkuXG5cdFx0bGV0IHRhZ3NDb3VudEFycmF5ID0gT2JqZWN0LmVudHJpZXMoIHRhZ3NDb3VudCApO1xuXHRcdC8vIFJldHJpZXZlIGFsbCB0YWdzIHdpdGggY291bnQgZXF1YWwgdG8gbWF4Q291bnQuXG5cdFx0dGFnc0NvdW50QXJyYXkgPSB0YWdzQ291bnRBcnJheS5maWx0ZXIoICggWyBrZXksIHZhbHVlIF0gKSA9PiB2YWx1ZSA9PT0gbWF4Q291bnQgKTtcblxuXHRcdC8vIENvbnZlcnQgYXJyYXkgYmFjayB0byBvYmplY3QuXG5cdFx0cmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyggdGFnc0NvdW50QXJyYXkgKTtcblx0fVxuXG5cdC8vIElmIG5vIHRhZyBoYXMgYSBzdWZmaWNpZW50IG1heENvdW50LCByZXR1cm4gYW4gZW1wdHkgb2JqZWN0LlxuXHRyZXR1cm4ge307XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gZ2V0SW50ZXJlc3RzKCkge1xuXHQvKipcblx0ICogQ2xhc3MgdG8gaGFuZGxlIGxvY2FsU3RvcmFnZS5cblx0ICovXG5cdGNsYXNzIExvY2FsU3RvcmFnZSB7XG5cdFx0LyoqXG5cdFx0ICogSW1wbGVtZW50cyBjb25zdHJ1Y3RvcigpLlxuXHRcdCAqL1xuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0Ly8gbG9jYWxTdG9yYWdlIGtleS5cblx0XHRcdHRoaXMua2V5ID0gJ2VpSW50ZXJlc3QuaW50ZXJlc3QnO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEdldCB2YWx1ZSBpbiBsb2NhbFN0b3JhZ2UuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfSBWYWx1ZSBpbiBsb2NhbFN0b3JhZ2UuXG5cdFx0ICovXG5cdFx0Z2V0U3RvcmFnZSgpIHtcblx0XHRcdGxldCBpdGVtID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oIHRoaXMua2V5ICk7XG5cblx0XHRcdHJldHVybiBpdGVtID8gSlNPTi5wYXJzZSggaXRlbSApIDoge307XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IHZhbHVlIGluIGxvY2FsU3RvcmFnZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBWYWx1ZSB0byBzZXQuXG5cdFx0ICovXG5cdFx0c2V0U3RvcmFnZSggdmFsdWUgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggdGhpcy5rZXksIEpTT04uc3RyaW5naWZ5KCB2YWx1ZSApICk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhIHJ1bk9uY2UgKSB7XG5cdFx0cnVuT25jZSA9IHRydWU7XG5cblx0XHRjb25zdCBsb2NhbGl6ZWRPYmogPSBlaUludGVyZXN0O1xuXG5cdFx0Ly8gSG93IG1hbnkgdGltZXMgc2hvdWxkIGEgdGFnIGJlIHZpc2l0ZWQgYmVmb3JlIGFkZGluZyB0byBpbnRlcmVzdCBoZWFkZXIuXG5cdFx0Y29uc3QgcG9wdWxhcml0eUNvdW50ID0gbG9jYWxpemVkT2JqLmludGVyZXN0X3RocmVzaG9sZCA/IGxvY2FsaXplZE9iai5pbnRlcmVzdF90aHJlc2hvbGQgOiAzO1xuXHRcdGNvbnN0IHBvc3RUYWdzID0gbG9jYWxpemVkT2JqLnBvc3RfdGVybXM7XG5cdFx0Y29uc3QgY29va2llRXhwaXJhdGlvbiA9IGxvY2FsaXplZE9iai5jb29raWVfZXhwaXJhdGlvbiA/IGxvY2FsaXplZE9iai5jb29raWVfZXhwaXJhdGlvbiA6IDE0O1xuXG5cdFx0aWYgKCBwb3N0VGFncyApIHtcblx0XHRcdC8vIENyZWF0ZSBMb2NhbFN0b3JhZ2UgaW5zdGFuY2UuXG5cdFx0XHRsZXQgc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcblxuXHRcdFx0Ly8gR2V0IHRhZ3NDb3VudCBmcm9tIGxvY2FsU3RvcmFnZSBpZiBpdCBleGlzdHMuXG5cdFx0XHRsZXQgdGFnc0NvdW50ID0gc3RvcmFnZS5nZXRTdG9yYWdlKCk7XG5cblx0XHRcdC8vIFVwZGF0ZSB0YWdzQ291bnQgd2l0aCBjdXJyZW50IHBvc3QgdGFncy5cblx0XHRcdHRhZ3NDb3VudCA9IHVwZGF0ZVRhZ3NDb3VudCggcG9zdFRhZ3MsIHRhZ3NDb3VudCApO1xuXG5cdFx0XHQvLyBTYXZlIHVwZGF0ZWQgY291bnRzIHRvIGxvY2FsU3RvcmFnZS5cblx0XHRcdHN0b3JhZ2Uuc2V0U3RvcmFnZSggdGFnc0NvdW50ICk7XG5cblx0XHRcdC8vIEZpbHRlciBtb3N0IHBvcHVsYXIgdGFncy5cblx0XHRcdGxldCBpbnRlcmVzdFRhZ3NDb3VudCA9IGdldEludGVyZXN0VGFncyggdGFnc0NvdW50LCBwb3B1bGFyaXR5Q291bnQgKTtcblxuXHRcdFx0Ly8gR2V0IGFycmF5IG9mIHBvcHVsYXIgdGFnIHRpZHMuXG5cdFx0XHRsZXQgaW50ZXJlc3RUYWdzID0gT2JqZWN0LmtleXMoIGludGVyZXN0VGFnc0NvdW50ICk7XG5cblx0XHRcdGlmICggaW50ZXJlc3RUYWdzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdGNvbnN0IENvb2tpZUF0dHJpYnV0ZXMgPSB7IGV4cGlyZXM6IHBhcnNlSW50KCBjb29raWVFeHBpcmF0aW9uICkgfTtcblx0XHRcdFx0Ly8gU2V0IGludGVyZXN0IGNvb2tpZSB3aXRoIHBvcHVsYXIgdGFncywgc2VwYXJhdGVkIGJ5IHwsIGFuZCBhbnkgYXR0cmlidXRlcy5cblx0XHRcdFx0Y29va2llcy5zZXQoICdpbnRlcmVzdCcsIGludGVyZXN0VGFncy5qb2luKCAnfCcgKSwgQ29va2llQXR0cmlidXRlcyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5nZXRJbnRlcmVzdHMoKTtcbiIsIi8qISBqcy1jb29raWUgdjMuMC4xIHwgTUlUICovXG47XG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY3VycmVudCA9IGdsb2JhbC5Db29raWVzO1xuICAgIHZhciBleHBvcnRzID0gZ2xvYmFsLkNvb2tpZXMgPSBmYWN0b3J5KCk7XG4gICAgZXhwb3J0cy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkgeyBnbG9iYWwuQ29va2llcyA9IGN1cnJlbnQ7IHJldHVybiBleHBvcnRzOyB9O1xuICB9KCkpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuICBmdW5jdGlvbiBhc3NpZ24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbiAgdmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gICAgcmVhZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gICAgfSxcbiAgICB3cml0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICAgIGRlY29kZVVSSUNvbXBvbmVudFxuICAgICAgKVxuICAgIH1cbiAgfTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuICBmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIsIGRlZmF1bHRBdHRyaWJ1dGVzKSB7XG4gICAgZnVuY3Rpb24gc2V0IChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgYXR0cmlidXRlcyA9IGFzc2lnbih7fSwgZGVmYXVsdEF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRyaWJ1dGVzLmV4cGlyZXMpIHtcbiAgICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgICAgdmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuICAgICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxuICAgICAgICAvLyAuLi5cbiAgICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgICAvLyAgICAgY2hhcmFjdGVyOlxuICAgICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoZG9jdW1lbnQuY29va2llID1cbiAgICAgICAga2V5ICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldCAoa2V5KSB7XG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAha2V5KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgICAgLy8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuXG4gICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuICAgICAgdmFyIGphciA9IHt9O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGZvdW5kS2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKTtcbiAgICAgICAgICBqYXJbZm91bmRLZXldID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kS2V5KTtcblxuICAgICAgICAgIGlmIChrZXkgPT09IGZvdW5kS2V5KSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleSA/IGphcltrZXldIDogamFyXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAgICB7XG4gICAgICAgIHNldDogc2V0LFxuICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgc2V0KFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgICAgZXhwaXJlczogLTFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgd2l0aEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgcmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcbiAgICAgICAgfSxcbiAgICAgICAgd2l0aENvbnZlcnRlcjogZnVuY3Rpb24gKGNvbnZlcnRlcikge1xuICAgICAgICAgIHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYXR0cmlidXRlczogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShkZWZhdWx0QXR0cmlidXRlcykgfSxcbiAgICAgICAgY29udmVydGVyOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGNvbnZlcnRlcikgfVxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIHZhciBhcGkgPSBpbml0KGRlZmF1bHRDb252ZXJ0ZXIsIHsgcGF0aDogJy8nIH0pO1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIHJldHVybiBhcGk7XG5cbn0pKSk7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekJBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBNUJBO0FBQ0E7QUE2QkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=