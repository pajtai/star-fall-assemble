/**
 * Lo-Dash 2.3.0 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="amd" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
define([], function() {

  /** Used for native method references */
  var objectProto = Object.prototype;

  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;

  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    String(toString)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/toString| for [^\]]+/g, '.*?') + '$'
  );

  return reNative;
});
