/*global define:false */
define(['jquery', 'engine', 'starFactory'], function ($, engine, StarFactory) {
    'use strict';

    return {
        stars : [],
        beginFalling : beginFalling,
        update : update,
        clear : clear,
        drawRect : drawRect,
        previousFps : 0,
        starIntervalMs : 200,
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
        StarFactory.setCanvasSize(this.size.width, this.size.height);
        StarFactory.loadContext(this);
        this.context = this.canvas.getContext('2d');
        engine.config({
            context : this,
            update : this.update
        });
        engine.start();
    }

    function update (dt, gameTimeStamp, fps) {
        var self = this;
        if (this.previousFps != fps) {
            this.$fps.html(fps);
        }

        this.clear();
        StarFactory.updateStars(dt, gameTimeStamp);
        StarFactory.each(function (index, item) {
            self.drawRect(item);
        });
        if (gameTimeStamp >= this.nextStarInterval) {
            this.createNewStar();
        }
    }

    function createNewStar () {
        this.nextStarInterval += this.starIntervalMs;
        StarFactory.createStar();
    }

    function drawRect (item) {
        this.context.fillStyle = '#0000FF';
        this.context.fillRect(item.x,
            item.y,
            item.width,
            item.width);
    }

    function clear () {
        this.context.clearRect(0, 0, this.size.width, this.size.height);
    }
});
