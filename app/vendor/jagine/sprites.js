define(['jquery', './sprite'], function($, Sprite) {

    var uniq = 0,
        imageCache = {};

    return {
        createSpriteFromResource : createSpriteFromResource,
        loadResource : loadResource
    }

    /**
     * Load an image for later use.
     * @param src
     * @returns {*|promise}
     */
    function loadResource (src) {
        var $deferred = new $.Deferred(),
            cachedObject;

        if (cachedObject = imageCache[src]) {
            $deferred.resolve(cachedObject.key);
        } else {
            cachedObject = {
                img : new Image()
            };
            imageCache[src] = cachedObject;
            cachedObject.img.addEventListener('load', function() {
                $deferred.resolve();
            });
            cachedObject.img.addEventListener('error', function() {
                $deferred.reject();
            });
            cachedObject.img.src = src;
        }

        return $deferred.promise();
    }

    /**
     * Create a sprite sheet.
     * @param src
     * @param rows
     * @param cols
     * @returns {*|promise}
     */
    function createSpriteFromResource (src, rows, cols) {
        var $deferred = new $.Deferred();
        new Sprite(imageCache[src], rows, cols);
        return $deferred.promise();
    }

});