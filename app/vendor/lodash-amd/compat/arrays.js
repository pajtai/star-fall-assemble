/**
 * Lo-Dash 2.3.0 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize exports="amd" -o ./compat/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
define(['./arrays/compact', './arrays/difference', './arrays/findIndex', './arrays/findLastIndex', './arrays/first', './arrays/flatten', './arrays/indexOf', './arrays/initial', './arrays/intersection', './arrays/last', './arrays/lastIndexOf', './arrays/pull', './arrays/range', './arrays/remove', './arrays/rest', './arrays/sortedIndex', './arrays/union', './arrays/uniq', './arrays/without', './arrays/zip', './arrays/zipObject'], function(compact, difference, findIndex, findLastIndex, first, flatten, indexOf, initial, intersection, last, lastIndexOf, pull, range, remove, rest, sortedIndex, union, uniq, without, zip, zipObject) {

  return {
    'compact': compact,
    'difference': difference,
    'findIndex': findIndex,
    'findLastIndex': findLastIndex,
    'first': first,
    'flatten': flatten,
    'indexOf': indexOf,
    'initial': initial,
    'intersection': intersection,
    'last': last,
    'lastIndexOf': lastIndexOf,
    'pull': pull,
    'range': range,
    'remove': remove,
    'rest': rest,
    'sortedIndex': sortedIndex,
    'union': union,
    'uniq': uniq,
    'without': without,
    'zip': zip,
    'zipObject': zipObject
  };
});
