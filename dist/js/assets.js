/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/gtm-headers.js":
/*!**********************************!*\
  !*** ./assets/js/gtm-headers.js ***!
  \**********************************/
/***/ (() => {

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");
/*global eiInterest*/
/**
 * @file
 * Count interests and set cookie for interest header.
 */


let runOnce;

/**
 * Update tagsCount with current post tags.
 * @param {Array} postTags Array of post tags.
 * @param {object} tagsCount Object of tags and counts.
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
 * @param {object} tagsCount Object of tags and counts.
 * @param {number} popularityCount How many times should a tag be visited before adding to interest header.
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
  });

  // If there are valid tags with a maxCount.
  if (maxCount > 0) {
    // Convert tagsCount to array.
    let tagsCountArray = Object.entries(tagsCount);
    // Retrieve all tags with count equal to maxCount.
    tagsCountArray = tagsCountArray.filter(([key, value]) => value === maxCount);

    // Convert array back to object.
    return Object.fromEntries(tagsCountArray);
  }

  // If no tag has a sufficient maxCount, return an empty object.
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
     * @returns {string} Value in localStorage.
     */
    getStorage() {
      let item = localStorage.getItem(this.key);
      return item ? JSON.parse(item) : {};
    }

    /**
     * Set value in localStorage.
     * @param {string} value Value to set.
     */
    setStorage(value) {
      localStorage.setItem(this.key, JSON.stringify(value));
    }
  }
  if (!runOnce) {
    runOnce = true;
    const localizedObj = eiInterest;

    // How many times should a tag be visited before adding to interest header.
    const popularityCount = localizedObj.interest_threshold ? localizedObj.interest_threshold : 3;
    const postTags = localizedObj.post_terms;
    const cookieExpiration = localizedObj.cookie_expiration ? localizedObj.cookie_expiration : 14;
    if (postTags) {
      // Create LocalStorage instance.
      let storage = new LocalStorage();

      // Get tagsCount from localStorage if it exists.
      let tagsCount = storage.getStorage();

      // Update tagsCount with current post tags.
      tagsCount = updateTagsCount(postTags, tagsCount);

      // Save updated counts to localStorage.
      storage.setStorage(tagsCount);

      // Filter most popular tags.
      let interestTagsCount = getInterestTags(tagsCount, popularityCount);

      // Get array of popular tag tids.
      let interestTags = Object.keys(interestTagsCount);
      if (interestTags.length > 0) {
        const CookieAttributes = {
          expires: parseInt(cookieExpiration)
        };
        // Set interest cookie with popular tags, separated by |, and any attributes.
        js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].set('interest', interestTags.join('|'), CookieAttributes);
      }
    }
  }
}
getInterests();

/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.mjs":
/*!***************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ api)
/* harmony export */ });
/*! js-cookie v3.0.5 | MIT */
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
  function set (name, value, attributes) {
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

    name = encodeURIComponent(name)
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
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
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
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
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




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./assets/js/assets.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _interest_count__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interest-count */ "./assets/js/interest-count.js");
/* harmony import */ var _gtm_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gtm-headers */ "./assets/js/gtm-headers.js");
/* harmony import */ var _gtm_headers__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_gtm_headers__WEBPACK_IMPORTED_MODULE_1__);


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYXNzZXRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ05BIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGFudGhlb24td29yZHByZXNzLWVkZ2UtaW50ZWdyYXRpb25zLy4vYXNzZXRzL2pzL2d0bS1oZWFkZXJzLmpzIiwid2VicGFjazovL3BhbnRoZW9uLXdvcmRwcmVzcy1lZGdlLWludGVncmF0aW9ucy8uL2Fzc2V0cy9qcy9pbnRlcmVzdC1jb3VudC5qcyIsIndlYnBhY2s6Ly9wYW50aGVvbi13b3JkcHJlc3MtZWRnZS1pbnRlZ3JhdGlvbnMvLi9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLm1qcyIsIndlYnBhY2s6Ly9wYW50aGVvbi13b3JkcHJlc3MtZWRnZS1pbnRlZ3JhdGlvbnMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGFudGhlb24td29yZHByZXNzLWVkZ2UtaW50ZWdyYXRpb25zL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3BhbnRoZW9uLXdvcmRwcmVzcy1lZGdlLWludGVncmF0aW9ucy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGFudGhlb24td29yZHByZXNzLWVkZ2UtaW50ZWdyYXRpb25zL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGFudGhlb24td29yZHByZXNzLWVkZ2UtaW50ZWdyYXRpb25zL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGFudGhlb24td29yZHByZXNzLWVkZ2UtaW50ZWdyYXRpb25zLy4vYXNzZXRzL2pzL2Fzc2V0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgZWlHdG0gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby12YXJcbnZhciBQYW50aGVvbiA9IHdpbmRvdy5QYW50aGVvbiB8fCB7fTtcblxuUGFudGhlb24udmFyeUhlYWRlcnMgPSBlaUd0bS5oZWFkZXJzRW5hYmxlZDtcblxuUGFudGhlb24uR1RNID0ge1xuXHRpbnRlcmVzdDogUGFudGhlb24udmFyeUhlYWRlcnMuaW5jbHVkZXMoICdJbnRlcmVzdCcgKSA/IGVpR3RtLmludGVyZXN0IDogbnVsbCxcblx0Z2VvOiBQYW50aGVvbi52YXJ5SGVhZGVycy5pbmNsdWRlcyggJ0F1ZGllbmNlJyApIHx8IFBhbnRoZW9uLnZhcnlIZWFkZXJzLmluY2x1ZGVzKCAnQXVkaWVuY2UtU2V0JyApID8gZWlHdG0uZ2VvIDogbnVsbCxcbn07XG5cbi8qKlxuICogUHVzaCBwZXJzb25hbGl6YXRpb24gZGF0YSB0byBHVE0uXG4gKi9cblBhbnRoZW9uLkdUTS5kYXRhUHVzaCA9IGZ1bmN0aW9uICgpIHtcblx0d2luZG93LmRhdGFMYXllciA9IHdpbmRvdy5kYXRhTGF5ZXIgfHwgW107XG5cdHdpbmRvdy5kYXRhTGF5ZXIucHVzaCgge1xuXHRcdCdldmVudCc6ICdwem4nLFxuXHRcdCdhdWRpZW5jZSc6IHtcblx0XHRcdCdnZW8nOiBQYW50aGVvbi5HVE0uZ2VvLFxuXHRcdH0sXG5cdFx0J2ludGVyZXN0JzogUGFudGhlb24uR1RNLmludGVyZXN0LFxuXHR9ICk7XG59O1xuXG5QYW50aGVvbi5HVE0uZGF0YVB1c2goKTtcbiIsIi8qZ2xvYmFsIGVpSW50ZXJlc3QqL1xuLyoqXG4gKiBAZmlsZVxuICogQ291bnQgaW50ZXJlc3RzIGFuZCBzZXQgY29va2llIGZvciBpbnRlcmVzdCBoZWFkZXIuXG4gKi9cblxuaW1wb3J0IGNvb2tpZXMgZnJvbSAnanMtY29va2llJztcblxubGV0IHJ1bk9uY2U7XG5cbi8qKlxuICogVXBkYXRlIHRhZ3NDb3VudCB3aXRoIGN1cnJlbnQgcG9zdCB0YWdzLlxuICogQHBhcmFtIHtBcnJheX0gcG9zdFRhZ3MgQXJyYXkgb2YgcG9zdCB0YWdzLlxuICogQHBhcmFtIHtvYmplY3R9IHRhZ3NDb3VudCBPYmplY3Qgb2YgdGFncyBhbmQgY291bnRzLlxuICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IG9mIHRhZ3MgYW5kIGNvdW50cy5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlVGFnc0NvdW50KCBwb3N0VGFncywgdGFnc0NvdW50ICkge1xuXHQvLyBMb29wIHRocm91Z2ggY3VycmVudCBwb3N0IHRhZ3MuXG5cdHBvc3RUYWdzLmZvckVhY2goIHRhZyA9PiB7XG5cdFx0Ly8gSWYgdGFnIGFscmVhZHkgZXhpc3RzIGluIHRhZ3NDb3VudCwgaW5jcmVtZW50LlxuXHRcdGlmICggdGFnIGluIHRhZ3NDb3VudCApIHtcblx0XHRcdHRhZ3NDb3VudFt0YWddKys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhZ3NDb3VudFt0YWddID0gMTtcblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gdGFnc0NvdW50O1xufVxuXG4vKipcbiAqIEZpbHRlciBvdXQgdGhlIG1vc3QgcG9wdWxhciB0YWdzLlxuICogQHBhcmFtIHtvYmplY3R9IHRhZ3NDb3VudCBPYmplY3Qgb2YgdGFncyBhbmQgY291bnRzLlxuICogQHBhcmFtIHtudW1iZXJ9IHBvcHVsYXJpdHlDb3VudCBIb3cgbWFueSB0aW1lcyBzaG91bGQgYSB0YWcgYmUgdmlzaXRlZCBiZWZvcmUgYWRkaW5nIHRvIGludGVyZXN0IGhlYWRlci5cbiAqIEByZXR1cm5zIHtvYmplY3R9IE9iamVjdCBvZiB0YWdzIGFuZCBjb3VudHMuXG4gKi9cbmZ1bmN0aW9uIGdldEludGVyZXN0VGFncyggdGFnc0NvdW50LCBwb3B1bGFyaXR5Q291bnQgKSB7XG5cdC8vIEZpbmQgdGhlIGhpZ2hlc3QgY291bnQgYW1vbmcgdGhlIHRhZ3MuXG5cdGxldCBtYXhDb3VudCA9IDA7XG5cdE9iamVjdC5rZXlzKCB0YWdzQ291bnQgKS5mb3JFYWNoKCB0YWcgPT4ge1xuXHRcdC8vIElmIHRhZydzIGNvdW50IGlzIGFib3ZlIHBvcHVsYXJpdHlDb3VudCBhbmQgb3RoZXIgdGFnIGNvdW50cy5cblx0XHRpZiAoIHRhZ3NDb3VudFt0YWddID49IHBvcHVsYXJpdHlDb3VudCAmJiB0YWdzQ291bnRbdGFnXSA+IG1heENvdW50ICkge1xuXHRcdFx0bWF4Q291bnQgPSB0YWdzQ291bnRbdGFnXTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBJZiB0aGVyZSBhcmUgdmFsaWQgdGFncyB3aXRoIGEgbWF4Q291bnQuXG5cdGlmICggbWF4Q291bnQgPiAwICkge1xuXHRcdC8vIENvbnZlcnQgdGFnc0NvdW50IHRvIGFycmF5LlxuXHRcdGxldCB0YWdzQ291bnRBcnJheSA9IE9iamVjdC5lbnRyaWVzKCB0YWdzQ291bnQgKTtcblx0XHQvLyBSZXRyaWV2ZSBhbGwgdGFncyB3aXRoIGNvdW50IGVxdWFsIHRvIG1heENvdW50LlxuXHRcdHRhZ3NDb3VudEFycmF5ID0gdGFnc0NvdW50QXJyYXkuZmlsdGVyKCAoIFsga2V5LCB2YWx1ZSBdICkgPT4gdmFsdWUgPT09IG1heENvdW50ICk7XG5cblx0XHQvLyBDb252ZXJ0IGFycmF5IGJhY2sgdG8gb2JqZWN0LlxuXHRcdHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoIHRhZ3NDb3VudEFycmF5ICk7XG5cdH1cblxuXHQvLyBJZiBubyB0YWcgaGFzIGEgc3VmZmljaWVudCBtYXhDb3VudCwgcmV0dXJuIGFuIGVtcHR5IG9iamVjdC5cblx0cmV0dXJuIHt9O1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldEludGVyZXN0cygpIHtcblx0LyoqXG5cdCAqIENsYXNzIHRvIGhhbmRsZSBsb2NhbFN0b3JhZ2UuXG5cdCAqL1xuXHRjbGFzcyBMb2NhbFN0b3JhZ2Uge1xuXHRcdC8qKlxuXHRcdCAqIEltcGxlbWVudHMgY29uc3RydWN0b3IoKS5cblx0XHQgKi9cblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdC8vIGxvY2FsU3RvcmFnZSBrZXkuXG5cdFx0XHR0aGlzLmtleSA9ICdlaUludGVyZXN0LmludGVyZXN0Jztcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBHZXQgdmFsdWUgaW4gbG9jYWxTdG9yYWdlLlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9IFZhbHVlIGluIGxvY2FsU3RvcmFnZS5cblx0XHQgKi9cblx0XHRnZXRTdG9yYWdlKCkge1xuXHRcdFx0bGV0IGl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggdGhpcy5rZXkgKTtcblxuXHRcdFx0cmV0dXJuIGl0ZW0gPyBKU09OLnBhcnNlKCBpdGVtICkgOiB7fTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBTZXQgdmFsdWUgaW4gbG9jYWxTdG9yYWdlLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBWYWx1ZSB0byBzZXQuXG5cdFx0ICovXG5cdFx0c2V0U3RvcmFnZSggdmFsdWUgKSB7XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggdGhpcy5rZXksIEpTT04uc3RyaW5naWZ5KCB2YWx1ZSApICk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhIHJ1bk9uY2UgKSB7XG5cdFx0cnVuT25jZSA9IHRydWU7XG5cblx0XHRjb25zdCBsb2NhbGl6ZWRPYmogPSBlaUludGVyZXN0O1xuXG5cdFx0Ly8gSG93IG1hbnkgdGltZXMgc2hvdWxkIGEgdGFnIGJlIHZpc2l0ZWQgYmVmb3JlIGFkZGluZyB0byBpbnRlcmVzdCBoZWFkZXIuXG5cdFx0Y29uc3QgcG9wdWxhcml0eUNvdW50ID0gbG9jYWxpemVkT2JqLmludGVyZXN0X3RocmVzaG9sZCA/IGxvY2FsaXplZE9iai5pbnRlcmVzdF90aHJlc2hvbGQgOiAzO1xuXHRcdGNvbnN0IHBvc3RUYWdzID0gbG9jYWxpemVkT2JqLnBvc3RfdGVybXM7XG5cdFx0Y29uc3QgY29va2llRXhwaXJhdGlvbiA9IGxvY2FsaXplZE9iai5jb29raWVfZXhwaXJhdGlvbiA/IGxvY2FsaXplZE9iai5jb29raWVfZXhwaXJhdGlvbiA6IDE0O1xuXG5cdFx0aWYgKCBwb3N0VGFncyApIHtcblx0XHRcdC8vIENyZWF0ZSBMb2NhbFN0b3JhZ2UgaW5zdGFuY2UuXG5cdFx0XHRsZXQgc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcblxuXHRcdFx0Ly8gR2V0IHRhZ3NDb3VudCBmcm9tIGxvY2FsU3RvcmFnZSBpZiBpdCBleGlzdHMuXG5cdFx0XHRsZXQgdGFnc0NvdW50ID0gc3RvcmFnZS5nZXRTdG9yYWdlKCk7XG5cblx0XHRcdC8vIFVwZGF0ZSB0YWdzQ291bnQgd2l0aCBjdXJyZW50IHBvc3QgdGFncy5cblx0XHRcdHRhZ3NDb3VudCA9IHVwZGF0ZVRhZ3NDb3VudCggcG9zdFRhZ3MsIHRhZ3NDb3VudCApO1xuXG5cdFx0XHQvLyBTYXZlIHVwZGF0ZWQgY291bnRzIHRvIGxvY2FsU3RvcmFnZS5cblx0XHRcdHN0b3JhZ2Uuc2V0U3RvcmFnZSggdGFnc0NvdW50ICk7XG5cblx0XHRcdC8vIEZpbHRlciBtb3N0IHBvcHVsYXIgdGFncy5cblx0XHRcdGxldCBpbnRlcmVzdFRhZ3NDb3VudCA9IGdldEludGVyZXN0VGFncyggdGFnc0NvdW50LCBwb3B1bGFyaXR5Q291bnQgKTtcblxuXHRcdFx0Ly8gR2V0IGFycmF5IG9mIHBvcHVsYXIgdGFnIHRpZHMuXG5cdFx0XHRsZXQgaW50ZXJlc3RUYWdzID0gT2JqZWN0LmtleXMoIGludGVyZXN0VGFnc0NvdW50ICk7XG5cblx0XHRcdGlmICggaW50ZXJlc3RUYWdzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdGNvbnN0IENvb2tpZUF0dHJpYnV0ZXMgPSB7IGV4cGlyZXM6IHBhcnNlSW50KCBjb29raWVFeHBpcmF0aW9uICkgfTtcblx0XHRcdFx0Ly8gU2V0IGludGVyZXN0IGNvb2tpZSB3aXRoIHBvcHVsYXIgdGFncywgc2VwYXJhdGVkIGJ5IHwsIGFuZCBhbnkgYXR0cmlidXRlcy5cblx0XHRcdFx0Y29va2llcy5zZXQoICdpbnRlcmVzdCcsIGludGVyZXN0VGFncy5qb2luKCAnfCcgKSwgQ29va2llQXR0cmlidXRlcyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5nZXRJbnRlcmVzdHMoKTtcbiIsIi8qISBqcy1jb29raWUgdjMuMC41IHwgTUlUICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbmZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbnZhciBkZWZhdWx0Q29udmVydGVyID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgLyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgKVxuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbmZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgZnVuY3Rpb24gc2V0IChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcykge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlNSk7XG4gICAgfVxuICAgIGlmIChhdHRyaWJ1dGVzLmV4cGlyZXMpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgIH1cblxuICAgIG5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQobmFtZSlcbiAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG5cbiAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXG4gICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAvLyAuLi5cbiAgICAgIC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcbiAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgLy8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG4gICAgICAvLyAuLi5cbiAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAgbmFtZSArICc9JyArIGNvbnZlcnRlci53cml0ZSh2YWx1ZSwgbmFtZSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gIH1cblxuICBmdW5jdGlvbiBnZXQgKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAhbmFtZSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcbiAgICAvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cbiAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuICAgIHZhciBqYXIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGZvdW5kID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKTtcbiAgICAgICAgamFyW2ZvdW5kXSA9IGNvbnZlcnRlci5yZWFkKHZhbHVlLCBmb3VuZCk7XG5cbiAgICAgICAgaWYgKG5hbWUgPT09IGZvdW5kKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZSA/IGphcltuYW1lXSA6IGphclxuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAge1xuICAgICAgc2V0LFxuICAgICAgZ2V0LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICBzZXQoXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgIGV4cGlyZXM6IC0xXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcbiAgICAgIH0sXG4gICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgIHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoZGVmYXVsdEF0dHJpYnV0ZXMpIH0sXG4gICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgfVxuICApXG59XG5cbnZhciBhcGkgPSBpbml0KGRlZmF1bHRDb252ZXJ0ZXIsIHsgcGF0aDogJy8nIH0pO1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuZXhwb3J0IHsgYXBpIGFzIGRlZmF1bHQgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vaW50ZXJlc3QtY291bnQnO1xuaW1wb3J0ICcuL2d0bS1oZWFkZXJzJztcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==