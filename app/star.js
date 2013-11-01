/*global define:false */
define(function () {
    'use strict';

    var random = Math.random,
        pi = Math.PI;

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
        var moveRight;

        if (!(this instanceof Star)) {
            return new Star(maxWidth, maxHeight);
        }

        this.maxWidth = maxWidth;
        moveRight = random() > 0.5;
        this.x = moveRight ? 0 : this.maxWidth;
        this.y = Math.ceil(random() * maxHeight);
        this.width = 1 + (random() * 9);
        this.direction = 0;
        this.speed = (moveRight ? 1 : -1) * (1 + (random() * 2));
        // "this" is automatically returned ~
    }
});
