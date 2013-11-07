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
        DOWN = 115;


    // TODO: make stars movement depend on dt and not ticks
    Star.prototype.move = function () {
        var showing = true;
        this.x = floor(this.x + this.speed);
        this.setOppositeCornerCoordinates();
        if (this.x > this.maxWidth || this.right < 0) {
            showing = false;
        }
        return showing;
    };

    Star.prototype.setOppositeCornerCoordinates = function () {
        this.right = this.x + this.width;
        this.bottom = this.y + this.width;
    };

    Star.prototype.focus = function () {
        this.color = focusColor;
    };

    Star.prototype.blur = function () {
        this.color = blurColor;
    };

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
        if (candidate.y > star.y) {
            return false;
        }
        return this.isOnSameVertical(star);
    };

    Star.prototype.isBelow = function(star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.bottom < star.bottom) {
            return false;
        }
        return this.isOnSameVertical(star);
    };

    Star.prototype.isLeftOf = function(star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.x > star.x) {
            return false;
        }
        return this.isOnSameHorizon(star);
    };

    Star.prototype.isRightOf = function(star) {
        var candidate = this;
        if (star === candidate) {
            return false;
        }
        if (candidate.right < star.right) {
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
     *        +---+       +---+
     * +---+  | s |       |   |
     * |   |  +---+ +---+ |   |
     * | c |        | s | | s |
     * |   |  +---+ +---+ |   |
     * +---+  | s |       |   |
     *        +---+       +---+
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
        if (candidate.bottom >= star.bottom && candidate.y <= star.y) {
            return true;
        }
        if (candidate.y >= star.y && candidate.bottom <= star.bottom) {
            return true;
        }
        return false;
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
     *        +------------+
     *        |     s      |
     *        +------------+
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
        if (candidate.x <= star.x && candidate.right >= star.right) {
            return true;
        }
        if (candidate.x >= star.x && candidate.right <= star.right) {
            return true;
        }
        return false;
    };

    return Star;

    function Star (maxWidth, maxHeight, focused, x, y, w, s) {
        var moveRight;

        if (!(this instanceof Star)) {
            return new Star(maxWidth, maxHeight);
        }

        this.maxWidth = maxWidth;
        moveRight = random() > 0.5;
        this.x = floor(undefined !== x ? x : (moveRight ? 0 : this.maxWidth));
        this.y = floor(undefined !== y ? y : Math.ceil(random() * maxHeight));
        this.width = floor(undefined !== w ? w : (6 + (random() * 5)));
        this.setOppositeCornerCoordinates();
        this.direction = 0;
        this.speed = undefined !== s ? s : ((moveRight ? 1 : -1) * (1 + (random() * 2)));
        this.color = focused ? focusColor : blurColor;
        // "this" is automatically returned ~
    }
});
