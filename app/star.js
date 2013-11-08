/*global define:false */
define(function () {
    'use strict';

    // TODO: create array of different sized star canvases
    var random = Math.random,
        floor = Math.floor,
        abs = Math.abs,
        pi = Math.PI,
        focusColor = '#FF0000',
        blurColor = '#0000FF',
        UP = 119,
        LEFT = 97,
        RIGHT = 100,
        DOWN = 115,
        // Create a cache of off screen canvases for performance
        // http://www.html5rocks.com/en/tutorials/canvas/performance/
        canvasCache = {
            cSample : {
                canvas : {},
                context : {}
            }
        },
        cachePrefix = 'c';


    /**
     * Gets a random int between min and max inclussive.
     * @param min
     * @param max
     * @returns {number}
     */
    function getRandomInt(min, max) {
        return floor(random() * (max - min + 1) + min);
    }

    /**
     *
     * @param min
     * @param max
     * @returns {number}
     */
    function getRandomArbitrary(min, max) {
        return random() * (max - min) + min;
    }

    Star.minSpeed = 0.1;
    Star.maxSpeed = 1;
    Star.minStarWidth = 5;
    Star.maxStarWidth = 10;
    function Star (maxWidth, maxHeight, focused, x, y, w, s) {
        var moveRight,
            cacheObj,
            canvas,
            context;

        if (!(this instanceof Star)) {
            return new Star(maxWidth, maxHeight);
        }

        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        moveRight = random() > 0.5;
        this.x = undefined !== x ? x : (moveRight ? 0 : maxWidth);
        this.y = undefined !== y ? y : getRandomInt(0, maxHeight);
        this.width = undefined !== w ? w : getRandomInt(Star.minStarWidth, Star.maxStarWidth);
        this.setOppositeCornerCoordinates();
        this.direction = 0;
        this.speed = undefined !== s ? s : ((moveRight ? 1 : -1) * getRandomArbitrary(Star.minSpeed, Star.maxSpeed));
        this.color = focused ? focusColor : blurColor;
        this.alive = true;

        cacheObj = canvasCache[this.getCacheKey()];
        if (!cacheObj) {
            canvasCache[this.getCacheKey()] = this.createCachedCanvas();
        }
        // "this" is automatically returned ~
    }

    Star.prototype.createCachedCanvas = function() {
        var canvas = document.createElement('canvas'),
            context,
            canvasCache;

        canvas.width = this.width;
        canvas.height = this.width;
        context = canvas.getContext('2d');
        context.fillStyle = this.color;
        context.fillRect(0,0,this.width,this.width);
        return {
            canvas: canvas,
            context: context
        };
    };


    Star.prototype.getCachedCanvas = function() {

        var key = this.getCacheKey(),
            cachedObj = canvasCache[key];

        if (!cachedObj) {
            cachedObj = canvasCache[key] = this.createCachedCanvas();
        }
        return cachedObj.canvas;
    };

    Star.prototype.drawOn = function(context) {
        context.drawImage(this.getCachedCanvas(), floor(this.x), floor(this.y));
    };

    Star.prototype.getCacheKey = function() {
        return cachePrefix + this.width + this.color.replace('#','');
    };

    // TODO: make stars movement depend on dt and not ticks
    Star.prototype.move = function () {
        var showing = true;
        this.x = this.x + this.speed;
        this.setOppositeCornerCoordinates();
        if (this.x > this.maxWidth || this.right < 0) {
            showing = false;
            this.kill();
        }
        return showing;
    };

    Star.prototype.setOppositeCornerCoordinates = function () {
        this.right = this.x + this.width;
        this.bottom = this.y + this.width;
        return this;
    };

    Star.prototype.focus = function () {
        this.color = focusColor;
        return this;
    };

    Star.prototype.blur = function () {
        this.color = blurColor;
        return this;
    };

    Star.prototype.kill = function () {
        this.alive = false;
        return this;
    };

    Star.prototype.isAlive = function () {
        return this.alive;
    }

    Star.prototype.stop = function () {
        this.speed = 0;
        return this;
    }

    Star.prototype.is = function(direction, star) {
        switch (direction) {
        case UP:
            return this.isAbove(star);
        case DOWN:
            return this.isBelow(star);
        case RIGHT:
            return this.isRightOf(star);
        case LEFT:
            return this.isLeftOf(star);
        default:
            return false;
        }
    }

    Star.prototype.isAbove = function(star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.y >= star.y) {
            return false;
        }
        return this.isOnSameVertical(star);
    };

    Star.prototype.isBelow = function(star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.bottom <= star.bottom) {
            return false;
        }
        return this.isOnSameVertical(star);
    };

    Star.prototype.isLeftOf = function(star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.x >= star.x) {
            return false;
        }
        return this.isOnSameHorizon(star);
    };

    Star.prototype.isRightOf = function(star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.right <= star.right) {
            return false;
        }
        return this.isOnSameHorizon(star);
    };

    Star.prototype.distance = function(direction, star) {
        switch (direction) {
        case UP:
            return this.distanceAbove(star);
        case DOWN:
            return this.distanceBelow(star);
        case LEFT:
            return this.distanceLeftOf(star);
        case RIGHT:
            return this.distanceRightOf(star);
        default:
            return -1;
        }
    }

    Star.prototype.distanceAbove = function (star) {
        var candidate = this;
        return star.y - candidate.bottom;
    }

    Star.prototype.distanceBelow = function (star) {
        var candidate = this;
        return candidate.y - star.bottom;
    }

    Star.prototype.distanceRightOf = function (star) {
        var candidate = this;
        return candidate.x - star.right;
    }

    Star.prototype.distanceLeftOf = function (star) {
        var candidate = this;
        return star.x - candidate.right;
    }

    /**
     *
     * @param star
     * @returns {boolean}
     *
     * 0
     * 1
     * 2
     *
     *        +---+
     * +---+  | s |
     * |   |  +---+ +---+
     * | c |        | s |
     * |   |  +---+ +---+
     * +---+  | s |
     *        +---+
     *
     *
     */
    Star.prototype.isOnSameHorizon = function(star) {
        var candidate = this;
        if (candidate.y <= star.bottom && candidate.y >= star.y) {
            return true;
        }
        if (candidate.bottom >= star.y && candidate.bottom <= star.bottom) {
            return true;
        }
        return (candidate.bottom >= star.bottom && candidate.y <= star.y);
    }

    /**
     *
     * @param star
     * @returns {boolean}
     *
     *
     *          +-------+
     *          |   c   |
     *          +-------+
     *
     *        +---+   +---+
     *        | s |   | s |
     *        +---+   +---+
     *
     *            +---+
     *            | s |
     *            +---+
     *
     */
    Star.prototype.isOnSameVertical = function(star) {
        var candidate = this;
        if (candidate.x >= star.x && candidate.x <= star.right) {
            return true;
        }
        if (candidate.right >= star.x && candidate.right <= star.right) {
            return true;
        }
        return (candidate.x <= star.x && candidate.right >= star.right);
    };

    return Star;
});
