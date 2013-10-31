/*global define:false */
define(['jquery', 'engine'], function ($, engine) {
    'use strict';

    return {
        stars : [],
        beginFalling : beginFalling,
        update : update,
        move : move,
        clear : clear,
        drawRect : drawRect
    };

    function beginFalling () {
        var $game = $('#game');
        this.canvas = $game.get(0);
        this.size = {
            width : $game.width(),
            height : $game.height()
        };
        this.context = this.canvas.getContext('2d');
        this.stars.push({x:0, y:0, width:10, direction: 0, speed: 1});
        engine.config({
            context: this,
            update: this.update
        });
        engine.start();
    }

    function update (dt, gameTimeStamp, fps) {
        console.log(fps);
        var self = this;
        $.each(this.stars, function(index, item) {
            self.move(item, item.direction, item.speed);
        });
        this.clear();
        $.each(this.stars, function(index, item) {
            self.drawRect(item);
        });
    }

    function move (item, direction, speed) {
        item.x = item.x + item.speed;
        item.y = item.y;
    }

    function drawRect(item) {
        this.context.fillRect(item.x
            , item.y
            , item.width
            , item.width);
    }

    function clear () {
        this.context.clearRect(0,0, this.size.width, this.size.height);
    }
});
