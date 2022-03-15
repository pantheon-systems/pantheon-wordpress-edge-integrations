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
/*global pantheon_ei*/

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
      this.key = 'pantheon_ei.interest';
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
    const localizedObj = pantheon_ei; // How many times should a tag be visited before adding to interest header.

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYXNzZXRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9hc3NldHMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2ludGVyZXN0LWNvdW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcy1jb29raWUvZGlzdC9qcy5jb29raWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9hc3NldHMvanMvYXNzZXRzLmpzXCIpO1xuIiwiaW1wb3J0ICcuL2ludGVyZXN0LWNvdW50JztcbiIsIi8qZ2xvYmFsIHBhbnRoZW9uX2VpKi9cbi8qKlxuICogQGZpbGVcbiAqIENvdW50IGludGVyZXN0cyBhbmQgc2V0IGNvb2tpZSBmb3IgaW50ZXJlc3QgaGVhZGVyLlxuICovXG5cbmltcG9ydCBjb29raWVzIGZyb20gJ2pzLWNvb2tpZSc7XG5cbmxldCBydW5PbmNlO1xuXG4vKipcbiAqIFVwZGF0ZSB0YWdzQ291bnQgd2l0aCBjdXJyZW50IHBvc3QgdGFncy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwb3N0VGFncyBBcnJheSBvZiBwb3N0IHRhZ3MuXG4gKiBAcGFyYW0ge29iamVjdH0gdGFnc0NvdW50IE9iamVjdCBvZiB0YWdzIGFuZCBjb3VudHMuXG4gKlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHRhZ3MgYW5kIGNvdW50cy5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlVGFnc0NvdW50KCBwb3N0VGFncywgdGFnc0NvdW50ICkge1xuXHQvLyBMb29wIHRocm91Z2ggY3VycmVudCBwb3N0IHRhZ3MuXG5cdHBvc3RUYWdzLmZvckVhY2goIHRhZyA9PiB7XG5cdFx0Ly8gSWYgdGFnIGFscmVhZHkgZXhpc3RzIGluIHRhZ3NDb3VudCwgaW5jcmVtZW50LlxuXHRcdGlmICggdGFnIGluIHRhZ3NDb3VudCApIHtcblx0XHRcdHRhZ3NDb3VudFt0YWddKys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhZ3NDb3VudFt0YWddID0gMTtcblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gdGFnc0NvdW50O1xufVxuXG4vKipcbiAqIEZpbHRlciBvdXQgdGhlIG1vc3QgcG9wdWxhciB0YWdzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0YWdzQ291bnQgT2JqZWN0IG9mIHRhZ3MgYW5kIGNvdW50cy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3B1bGFyaXR5Q291bnQgSG93IG1hbnkgdGltZXMgc2hvdWxkIGEgdGFnIGJlIHZpc2l0ZWQgYmVmb3JlIGFkZGluZyB0byBpbnRlcmVzdCBoZWFkZXIuXG4gKlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHRhZ3MgYW5kIGNvdW50cy5cbiAqL1xuZnVuY3Rpb24gZ2V0SW50ZXJlc3RUYWdzKCB0YWdzQ291bnQsIHBvcHVsYXJpdHlDb3VudCApIHtcblx0Ly8gRmluZCB0aGUgaGlnaGVzdCBjb3VudCBhbW9uZyB0aGUgdGFncy5cblx0bGV0IG1heENvdW50ID0gMDtcblx0T2JqZWN0LmtleXMoIHRhZ3NDb3VudCApLmZvckVhY2goIHRhZyA9PiB7XG5cdFx0Ly8gSWYgdGFnJ3MgY291bnQgaXMgYWJvdmUgcG9wdWxhcml0eUNvdW50IGFuZCBvdGhlciB0YWcgY291bnRzLlxuXHRcdGlmICggdGFnc0NvdW50W3RhZ10gPj0gcG9wdWxhcml0eUNvdW50ICYmIHRhZ3NDb3VudFt0YWddID4gbWF4Q291bnQgKSB7XG5cdFx0XHRtYXhDb3VudCA9IHRhZ3NDb3VudFt0YWddO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIElmIHRoZXJlIGFyZSB2YWxpZCB0YWdzIHdpdGggYSBtYXhDb3VudC5cblx0aWYgKCBtYXhDb3VudCA+IDAgKSB7XG5cdFx0Ly8gQ29udmVydCB0YWdzQ291bnQgdG8gYXJyYXkuXG5cdFx0bGV0IHRhZ3NDb3VudEFycmF5ID0gT2JqZWN0LmVudHJpZXMoIHRhZ3NDb3VudCApO1xuXHRcdC8vIFJldHJpZXZlIGFsbCB0YWdzIHdpdGggY291bnQgZXF1YWwgdG8gbWF4Q291bnQuXG5cdFx0dGFnc0NvdW50QXJyYXkgPSB0YWdzQ291bnRBcnJheS5maWx0ZXIoICggWyBrZXksIHZhbHVlIF0gKSA9PiB2YWx1ZSA9PT0gbWF4Q291bnQgKTtcblxuXHRcdC8vIENvbnZlcnQgYXJyYXkgYmFjayB0byBvYmplY3QuXG5cdFx0cmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyggdGFnc0NvdW50QXJyYXkgKTtcblx0fVxuXG5cdC8vIElmIG5vIHRhZyBoYXMgYSBzdWZmaWNpZW50IG1heENvdW50LCByZXR1cm4gYW4gZW1wdHkgb2JqZWN0LlxuXHRyZXR1cm4ge307XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gZ2V0SW50ZXJlc3RzKCkge1xuXHQvKipcblx0ICogQ2xhc3MgdG8gaGFuZGxlIGxvY2FsU3RvcmFnZS5cblx0ICovXG5cdGNsYXNzIExvY2FsU3RvcmFnZSB7XG5cdFx0LyoqXG5cdFx0ICogSW1wbGVtZW50cyBjb25zdHJ1Y3RvcigpLlxuXHRcdCAqL1xuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0Ly8gbG9jYWxTdG9yYWdlIGtleS5cblx0XHRcdHRoaXMua2V5ID0gJ3BhbnRoZW9uX2VpLmludGVyZXN0Jztcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBHZXQgdmFsdWUgaW4gbG9jYWxTdG9yYWdlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3N0cmluZ30gVmFsdWUgaW4gbG9jYWxTdG9yYWdlLlxuXHRcdCAqL1xuXHRcdGdldFN0b3JhZ2UoKSB7XG5cdFx0XHRsZXQgaXRlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCB0aGlzLmtleSApO1xuXG5cdFx0XHRyZXR1cm4gaXRlbSA/IEpTT04ucGFyc2UoIGl0ZW0gKSA6IHt9O1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFNldCB2YWx1ZSBpbiBsb2NhbFN0b3JhZ2UuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVmFsdWUgdG8gc2V0LlxuXHRcdCAqL1xuXHRcdHNldFN0b3JhZ2UoIHZhbHVlICkge1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oIHRoaXMua2V5LCBKU09OLnN0cmluZ2lmeSggdmFsdWUgKSApO1xuXHRcdH1cblx0fVxuXG5cdGlmICggISBydW5PbmNlICkge1xuXHRcdHJ1bk9uY2UgPSB0cnVlO1xuXG5cdFx0Y29uc3QgbG9jYWxpemVkT2JqID0gcGFudGhlb25fZWk7XG5cblx0XHQvLyBIb3cgbWFueSB0aW1lcyBzaG91bGQgYSB0YWcgYmUgdmlzaXRlZCBiZWZvcmUgYWRkaW5nIHRvIGludGVyZXN0IGhlYWRlci5cblx0XHRjb25zdCBwb3B1bGFyaXR5Q291bnQgPSBsb2NhbGl6ZWRPYmouaW50ZXJlc3RfdGhyZXNob2xkID8gbG9jYWxpemVkT2JqLmludGVyZXN0X3RocmVzaG9sZCA6IDM7XG5cdFx0Y29uc3QgcG9zdFRhZ3MgPSBsb2NhbGl6ZWRPYmoucG9zdF90ZXJtcztcblx0XHRjb25zdCBjb29raWVFeHBpcmF0aW9uID0gbG9jYWxpemVkT2JqLmNvb2tpZV9leHBpcmF0aW9uID8gbG9jYWxpemVkT2JqLmNvb2tpZV9leHBpcmF0aW9uIDogMTQ7XG5cblx0XHRpZiAoIHBvc3RUYWdzICkge1xuXHRcdFx0Ly8gQ3JlYXRlIExvY2FsU3RvcmFnZSBpbnN0YW5jZS5cblx0XHRcdGxldCBzdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZSgpO1xuXG5cdFx0XHQvLyBHZXQgdGFnc0NvdW50IGZyb20gbG9jYWxTdG9yYWdlIGlmIGl0IGV4aXN0cy5cblx0XHRcdGxldCB0YWdzQ291bnQgPSBzdG9yYWdlLmdldFN0b3JhZ2UoKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHRhZ3NDb3VudCB3aXRoIGN1cnJlbnQgcG9zdCB0YWdzLlxuXHRcdFx0dGFnc0NvdW50ID0gdXBkYXRlVGFnc0NvdW50KCBwb3N0VGFncywgdGFnc0NvdW50ICk7XG5cblx0XHRcdC8vIFNhdmUgdXBkYXRlZCBjb3VudHMgdG8gbG9jYWxTdG9yYWdlLlxuXHRcdFx0c3RvcmFnZS5zZXRTdG9yYWdlKCB0YWdzQ291bnQgKTtcblxuXHRcdFx0Ly8gRmlsdGVyIG1vc3QgcG9wdWxhciB0YWdzLlxuXHRcdFx0bGV0IGludGVyZXN0VGFnc0NvdW50ID0gZ2V0SW50ZXJlc3RUYWdzKCB0YWdzQ291bnQsIHBvcHVsYXJpdHlDb3VudCApO1xuXG5cdFx0XHQvLyBHZXQgYXJyYXkgb2YgcG9wdWxhciB0YWcgdGlkcy5cblx0XHRcdGxldCBpbnRlcmVzdFRhZ3MgPSBPYmplY3Qua2V5cyggaW50ZXJlc3RUYWdzQ291bnQgKTtcblxuXHRcdFx0aWYgKCBpbnRlcmVzdFRhZ3MubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0Y29uc3QgQ29va2llQXR0cmlidXRlcyA9IHsgZXhwaXJlczogcGFyc2VJbnQoIGNvb2tpZUV4cGlyYXRpb24gKSB9O1xuXHRcdFx0XHQvLyBTZXQgaW50ZXJlc3QgY29va2llIHdpdGggcG9wdWxhciB0YWdzLCBzZXBhcmF0ZWQgYnkgfCwgYW5kIGFueSBhdHRyaWJ1dGVzLlxuXHRcdFx0XHRjb29raWVzLnNldCggJ2ludGVyZXN0JywgaW50ZXJlc3RUYWdzLmpvaW4oICd8JyApLCBDb29raWVBdHRyaWJ1dGVzICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmdldEludGVyZXN0cygpO1xuIiwiLyohIGpzLWNvb2tpZSB2My4wLjEgfCBNSVQgKi9cbjtcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50ID0gZ2xvYmFsLkNvb2tpZXM7XG4gICAgdmFyIGV4cG9ydHMgPSBnbG9iYWwuQ29va2llcyA9IGZhY3RvcnkoKTtcbiAgICBleHBvcnRzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7IGdsb2JhbC5Db29raWVzID0gY3VycmVudDsgcmV0dXJuIGV4cG9ydHM7IH07XG4gIH0oKSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG4gIGZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuICB2YXIgZGVmYXVsdENvbnZlcnRlciA9IHtcbiAgICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEsIC0xKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICB9LFxuICAgIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAgIC8lKDJbMzQ2QkZdfDNbQUMtRl18NDB8NVtCREVdfDYwfDdbQkNEXSkvZyxcbiAgICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgICApXG4gICAgfVxuICB9O1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuXG4gIGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgICBmdW5jdGlvbiBzZXQgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZTUpO1xuICAgICAgfVxuICAgICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAga2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgICAucmVwbGFjZSgvWygpXS9nLCBlc2NhcGUpO1xuXG4gICAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblxuICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAgIC8vIC4uLlxuICAgICAgICAvLyAzLiAgSWYgdGhlIHJlbWFpbmluZyB1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnRhaW5zIGEgJXgzQiAoXCI7XCIpXG4gICAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAgIC8vIG5vdCBpbmNsdWRpbmcsIHRoZSBmaXJzdCAleDNCIChcIjtcIikgY2hhcmFjdGVyLlxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAgICBrZXkgKyAnPScgKyBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0IChrZXkpIHtcbiAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFrZXkpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG4gICAgICAvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cbiAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgICB2YXIgamFyID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgZm91bmRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICAgIGphcltmb3VuZEtleV0gPSBjb252ZXJ0ZXIucmVhZCh2YWx1ZSwgZm91bmRLZXkpO1xuXG4gICAgICAgICAgaWYgKGtleSA9PT0gZm91bmRLZXkpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5ID8gamFyW2tleV0gOiBqYXJcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAgIHtcbiAgICAgICAgc2V0OiBzZXQsXG4gICAgICAgIGdldDogZ2V0LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBzZXQoXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgICBleHBpcmVzOiAtMVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgICB9LFxuICAgICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxuICAgICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgdmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbiAgcmV0dXJuIGFwaTtcblxufSkpKTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBNUJBO0FBQ0E7QUE2QkE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=