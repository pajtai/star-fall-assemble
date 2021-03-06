/*global define:false */
define(['lodash'], function (_) {
    'use strict';

    /**
     * up is up, down is down, y increases as you move down
     */

    var random = Math.random,
        floor = Math.floor,
        pi = Math.PI,
        pi_0_0 = 0,
        pi_0_5 = 0.5 * pi,
        pi_1_0 = pi,
        pi_1_5 = 1.5 * pi,
        focusColor = '#FF0000',
        blurColor = '#0000FF',
        bulletColor = '#00FF00',
    // TODO: make loading equation for
        UP = 38,
        LEFT = 37,
        RIGHT = 39,
        DOWN = 40,
    // Create a cache of off screen canvases for performance
    // http://www.html5rocks.com/en/tutorials/canvas/performance/
        canvasCache = {
            cSample : {
                canvas : {},
                context : {}
            }
        },
        cachePrefix = 'c',
        starPrototype = {
            blur : blur,
            createCachedCanvas : createCachedCanvas,
            distance : distance,
            distanceAbove : distanceAbove,
            distanceBelow : distanceBelow,
            distanceLeftOf : distanceLeftOf,
            distanceRightOf : distanceRightOf,
            drawOn : drawOn,
            focus : focus,
            getCachedCanvas : getCachedCanvas,
            getCacheKey : getCacheKey,
            getInitialX : getInitialX,
            getInitialY : getInitialY,
            getType : getType,
            is : is,
            isAbove : isAbove,
            isAlive : isAlive,
            isBelow : isBelow,
            isLeftOf : isLeftOf,
            isOnSameHorizon : isOnSameHorizon,
            isOnSameVertical : isOnSameVertical,
            isRightOf : isRightOf,
            kill : kill,
            move : move,
            setOppositeCornerCoordinates : setOppositeCornerCoordinates,
            stop : stop
        };

    _.extend(Square.prototype, starPrototype);

    /**
     * Gets a random int between min and max inclussive.
     * @param min
     * @param max
     * @returns {number}
     */
    function getRandomInt (min, max) {
        return floor(random() * (max - min + 1) + min);
    }

    /**
     *
     * @param min
     * @param max
     * @returns {number}
     */
    function getRandomArbitrary (min, max) {
        return random() * (max - min) + min;
    }

    Square.REGULAR = 'REGULAR';
    Square.PLAYER = 'PLAYER';
    Square.BULLET = 'BULLET';
    Square.minSpeed = 0.005;
    Square.maxSpeed = 0.025;
    Square.minSquareWidth = 5;
    Square.maxSquareWidth = 10;
    Square.testMode = false;
    // TODO: create typeofstar arguments

    /**
     *
     * @param camera
     * @param starType
     * @param x - optional override for x
     * @param y - optional override for y
     * @param width - optional override for width
     * @param speed - optional override for speed
     * @param directionRad - optional override for direction in radians
     * @returns {Square}
     * @constructor
     */
    function Square (camera, starType, x, y, width, speed, directionRad) {
        var cacheObj,
            viewWindow = camera.getViewWindow();


        if (!(this instanceof Square)) {
            return new Square(viewWindow, starType, x, y, width, speed, directionRad);
        }

        // TODO: remove dependence on camera
        this.camera = camera;

        // Pick a cardinal radian direction from 0 to 2pi
        this.directionRad = undefined === directionRad ? pi * (getRandomInt(0, 3) / 2) : directionRad;
        this.width = undefined !== width ? width : getRandomInt(Square.minSquareWidth, Square.maxSquareWidth);
        this.x = undefined !== x ? x : this.getInitialX(viewWindow.x, viewWindow.right);
        this.y = undefined !== y ? y : this.getInitialY(viewWindow.y, viewWindow.bottom);

        this.setOppositeCornerCoordinates();

        // TODO: generalize
        switch (starType) {
        case Square.PLAYER:
            this.color = focusColor;
            break;
        case Square.BULLET:
            this.color = bulletColor;
            break;
        default:
        case Square.REGULAR:
            this.color = blurColor;
            break;
        }
        this.speed = undefined !== speed ? speed : (getRandomArbitrary(Square.minSpeed, Square.maxSpeed));
        this.type = starType;
        this.alive = true;

        cacheObj = canvasCache[this.getCacheKey()];
        if (!cacheObj) {
            canvasCache[this.getCacheKey()] = this.createCachedCanvas();
        }
        // 'this' is automatically returned ~
    }

    function getInitialX (minX, maxX) {
        switch (this.directionRad) {
        case pi_0_0:
            return minX;
        case pi_1_0:
            return maxX;
        case pi_0_5:
        case pi_1_5:
            return getRandomInt(minX, maxX - this.width);
        default:
            console.log('no initial x: ' + this.directionRad / pi);
            return NaN;
        }
    }

    function getInitialY (minY, maxY) {
        switch (this.directionRad) {
        case pi_0_0:
        case pi_1_0:
            return getRandomInt(minY, maxY - this.width);
        case pi_0_5:
            return minY;
        case pi_1_5:
            return maxY;
        default:
            console.log('no initial y: ' + this.directionRad / pi);
            return NaN;
        }
    }

    function createCachedCanvas () {
        var canvas = document.createElement('canvas'),
            context;

        canvas.width = this.width;
        canvas.height = this.width;
        context = canvas.getContext('2d');
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.width, this.width);
        return {
            canvas : canvas,
            context : context
        };
    }


    function getCachedCanvas () {

        var key = this.getCacheKey(),
            cachedObj = canvasCache[key];

        if (!cachedObj) {
            cachedObj = canvasCache[key] = this.createCachedCanvas();
        }
        return cachedObj.canvas;
    }

    function drawOn (context) {
        context.drawImage(this.getCachedCanvas(), floor(this.x), floor(this.y));
    }

    function getCacheKey () {
        return cachePrefix + this.width + this.color.replace('#', '');
    }

    // TODO: make stars movement depend on dt and not ticks
    function move (dt) {
        var showing = true;

        switch (this.directionRad) {
        case pi_0_0:
            this.x += dt * this.speed;
            break;
        case pi_1_5:
            this.y -= dt * this.speed;
            break;
        case pi_1_0:
            this.x -= dt * this.speed;
            break;
        case pi_0_5:
            this.y += dt * this.speed;
            break;
        }
        this.setOppositeCornerCoordinates();

        // TODO: make this a little less primitive
        if (! this.camera.visible(this) && !Square.testMode) {
            showing = false;
            this.kill();
        }
        return showing;
    }

    function setOppositeCornerCoordinates () {
        this.right = this.x + this.width;
        this.bottom = this.y + this.width;
        return this;
    }

    function focus () {
        this.color = focusColor;
        return this;
    }

    function blur () {
        this.color = blurColor;
        return this;
    }

    function kill () {
        this.alive = false;
        return this;
    }

    function isAlive () {
        return this.alive;
    }

    function stop () {
        this.speed = 0;
        return this;
    }

    function is (direction, star) {
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

    function isAbove (star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.y >= star.y) {
            return false;
        }
        return this.isOnSameVertical(star);
    }

    function isBelow (star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.bottom <= star.bottom) {
            return false;
        }
        return this.isOnSameVertical(star);
    }

    function isLeftOf (star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.x >= star.x) {
            return false;
        }
        return this.isOnSameHorizon(star);
    }

    function isRightOf (star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.right <= star.right) {
            return false;
        }
        return this.isOnSameHorizon(star);
    }

    function distance (direction, star) {
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

    function distanceAbove (star) {
        var candidate = this;
        return star.y - candidate.bottom;
    }

    function distanceBelow (star) {
        var candidate = this;
        return candidate.y - star.bottom;
    }

    function distanceRightOf (star) {
        var candidate = this;
        return candidate.x - star.right;
    }

    function distanceLeftOf (star) {
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
    function isOnSameHorizon (star) {
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
    function isOnSameVertical (star) {
        var candidate = this;
        if (candidate.x >= star.x && candidate.x <= star.right) {
            return true;
        }
        if (candidate.right >= star.x && candidate.right <= star.right) {
            return true;
        }
        return (candidate.x <= star.x && candidate.right >= star.right);
    }

    function getType () {
        return this.type;
    }

    return Square;
});
