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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/js-cookie/dist/js.cookie.js
var js_cookie = __webpack_require__(0);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);

// CONCATENATED MODULE: ./assets/js/interest-count.js
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

    if (postTags) {
      // Create LocalStorage instance.
      let storage = new LocalStorage(); // Get tagsCount from localStorage if it exists.

      let tagsCount = storage.getStorage(); // Update tagsCount with current post tags.

      tagsCount = updateTagsCount(postTags, tagsCount); // Save updated counts to localStorage.

      storage.setStorage(tagsCount); // Filter most popular tags.

      let interestTagsCount = getInterestTags(tagsCount, popularityCount); // Get array of popular tag tids.

      let interestTags = Object.keys(interestTagsCount);

      if (interestTags.length > 0) {
        // Set interest cookie with popular tags, separated by |.
        js_cookie_default.a.set('interest', interestTags.join('|'));
      }
    }
  }
}

if (document.body.classList.contains('single')) {
  getInterests();
}
// CONCATENATED MODULE: ./assets/js/assets.js


/***/ })
/******/ ]);