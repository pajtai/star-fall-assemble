/*global define:false */
define(function () {
    'use strict';

    // TODO: create array of different sized star canvases
    var random = Math.random,
        floor = Math.floor,
        pi = Math.PI,
        focusColor = '#FF0000',
        blurColor = '#0000FF';


    // TODO: make stars movement depend on dt and not ticks
    Star.prototype.move = function () {
        var showing = true;
        this.x = floor(this.x + this.speed);
        this.setOppositeCornerCoordinates();
        if (this.x > this.maxWidth) {
            showing = false;
        }
        return showing;
    };

    Star.prototype.setOppositeCornerCoordinates = function () {
        this.right = this.x + this.width;
        this.bottom = this.y + this.width;
    };

    Star.prototype.focus = function () {

    };

    Star.prototype.blur = function () {
        //this.color =
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
        this.width = floor(undefined !== w ? w : (1 + (random() * 9)));
        this.setOppositeCornerCoordinates();
        this.direction = 0;
        this.speed = undefined !== s ? s : ((moveRight ? 1 : -1) * (1 + (random() * 2)));
        this.color = focused ? focusColor : blurColor;
        // "this" is automatically returned ~
    }
});
