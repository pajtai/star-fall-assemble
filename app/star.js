/*global define:false */
define(function () {
    'use strict';

    var random = Math.random,
        pi = Math.PI;

    Star.prototype.move = function () {
        var showing = true;
        this.x = this.x + this.speed;
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
        this.setOppositeCornerCoordinates();
        this.direction = 0;
        this.speed = (moveRight ? 1 : -1) * (1 + (random() * 2));
        // "this" is automatically returned ~
    }
});
