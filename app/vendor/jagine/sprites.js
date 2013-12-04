define(['jquery'], function($) {

    var uniq = 0,
        imageCache = {};

    return {
        loadSpriteResource : loadSpriteResource
    }

    function loadSpriteResource (src) {
        var $deferred = new $.Deferred(),
            cachedObject;

        if (cachedObject = imageCache[src]) {
            $deferred.resolve(cachedObject.key);
        } else {
            cachedObject = {
                img : new Image(),
                key : ++uniq
            };
            imageCache[src] = cachedObject;
            cachedObject.img.addEventListener('load', function() {
                $deferred.resolve(cachedObject.key);
            });
            cachedObject.img.src = src;
        }

        return $deferred;
    }

});