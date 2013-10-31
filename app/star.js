/*global define:false */
define(function () {
    'use strict';

    var random = Math.random;

    Star.prototype.move = function () {
        var showing = true;
        this.x = this.x + this.speed;
        if (this.x > this.maxWidth) {
            showing = false;
        }
        return showing;
    };

    return Star;

    function Star (maxWidth, maxHeight) {
        if (!(this instanceof Star)) {
            return new Star(maxWidth, maxHeight);
        }
        this.x = 0;
        this.y = Math.ceil(random() * maxHeight);
        this.width = 1 + (random() * 9);
        this.direction = 0;
        this.speed = 1 + (random() * 2);
        this.maxWidth = maxWidth;
        // "this" is automatically returned ~
    }
});
