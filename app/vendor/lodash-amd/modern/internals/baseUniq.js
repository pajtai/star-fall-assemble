/**
 * Lo-Dash 2.3.0 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="amd" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
define(['./baseIndexOf', './cacheIndexOf', './createCache', './getArray', './largeArraySize', './releaseArray', './releaseObject'], function(baseIndexOf, cacheIndexOf, createCache, getArray, largeArraySize, releaseArray, releaseObject) {

  /**
   * The base implementation of `_.uniq` without support for callback shorthands
   * or `thisArg` binding.
   *
   * @private
   * @param {Array} array The array to process.
   * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
   * @param {Function} [callback] The function called per iteration.
   * @returns {Array} Returns a duplicate-value-free array.
   */
  function baseUniq(array, isSorted, callback) {
    var index = -1,
        indexOf = baseIndexOf,
        length = array ? array.length : 0,
        result = [];

    var isLarge = !isSorted && length >= largeArraySize,
        seen = (callback || isLarge) ? getArray() : result;

    if (isLarge) {
      var cache = createCache(seen);
      if (cache) {
        indexOf = cacheIndexOf;
        seen = cache;
      } else {
        isLarge = false;
        seen = callback ? seen : (releaseArray(seen), result);
      }
    }
    while (++index < length) {
      var value = array[index],
          computed = callback ? callback(value, index, array) : value;

      if (isSorted
            ? !index || seen[seen.length - 1] !== computed
            : indexOf(seen, computed) < 0
          ) {
        if (callback || isLarge) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
    if (isLarge) {
      releaseArray(seen.array);
      releaseObject(seen);
    } else if (callback) {
      releaseArray(seen);
    }
    return result;
  }

  return baseUniq;
});
