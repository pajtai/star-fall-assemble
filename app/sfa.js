/*global define:false */
define(['jquery', 'engine'], function ($, engine) {
    'use strict';

    var random = Math.random;

    function Star (maxWidth, maxHeight) {
        this.x = 0;
        this.y = Math.ceil(Math.random() * maxHeight);
        this.width = 1 + (random() * 9);
        this.direction = 0;
        this.speed = 1 + (Math.random() * 2);
        this.maxWidth = maxWidth;
    }

    Star.prototype.move = function () {
        var showing = true;
        this.x = this.x + this.speed;
        if (this.x > this.maxWidth) {
            showing = false;
        }
        return showing;
    };

    return {
        stars : [],
        beginFalling : beginFalling,
        update : update,
        clear : clear,
        drawRect : drawRect,
        previousFps : 0,
        starIntervalMs : 1000,
        nextStarInterval : 0,
        createNewStar : createNewStar
    };

    function beginFalling () {
        var $game = $('#game');
        this.$fps = $('#fps');
        this.canvas = $game.get(0);
        this.size = {
            width : this.canvas.width,
            height : this.canvas.height
        };
        this.context = this.canvas.getContext('2d');
        engine.config({
            context : this,
            update : this.update
        });
        engine.start();
    }

    function update (dt, gameTimeStamp, fps) {

        var self = this,
            remove = [];
        if (this.previousFps != fps) {
            this.$fps.html(fps);
        }
        $.each(this.stars, function (index, star) {
            if (!star.move()) {
                remove.push(index);
            }
        });
        $.each(remove, function (index, item) {
            self.stars.splice(item, 1);
        });
        this.clear();
        $.each(this.stars, function (index, item) {
            self.drawRect(item);
        });

        if (gameTimeStamp >= this.nextStarInterval) {
            this.createNewStar();
        }
    }

    function createNewStar () {
        this.nextStarInterval += this.starIntervalMs;
        this.stars.push(new Star(this.size.width, this.size.height));
    }

    function drawRect (item) {
        this.context.fillRect(item.x
            , item.y
            , item.width
            , item.width);
    }

    function clear () {
        this.context.clearRect(0, 0, this.size.width, this.size.height);
    }
});
