/*global define:false */
define(['jquery', 'engine', 'starFactory'], function ($, engine, StarFactory) {
    'use strict';

    // TODO: move directions into config file
    var UP = 119,
        LEFT = 97,
        RIGHT = 100,
        DOWN = 115;

    return {
        stars : [],
        beginFalling : beginFalling,
        update : update,
        clear : clear,
        drawRect : drawRect,
        previousFps : 0,
        starIntervalMs : 200,
        nextStarInterval : 0,
        createNewStar : createNewStar,
        listenToKeys : listenToKeys,
        move : move
    };

    function beginFalling () {
        var $game = $('#game'),
            width = 10;
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
        // TODO: move player somewhere else
        this.player = this.createNewStar(
            true,
            this.size.width/2 - width/2,
            this.size.height/2 - width/2,
            width,
            0
        );

        this.listenToKeys();
    }

    function update (dt, gameTimeStamp, fps, keypresses) {
        var self = this,
            direction;

        if (this.previousFps != fps) {
            this.$fps.html(fps);
        }

        if (keypresses.length) {
            switch (direction = keypresses[0]) {
            case UP:
            case LEFT:
            case DOWN:
            case RIGHT:
                this.move(direction);
                break;
            }
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

    // TODO: create attributes object
    function createNewStar (focused, x, y, w, s) {
        this.nextStarInterval += this.starIntervalMs;
        return StarFactory.createStar(focused, x, y, w, s);
    }

    function drawRect (item) {
        this.context.fillStyle = item.color;
        this.context.fillRect(item.x,
            item.y,
            item.width,
            item.width);
    }

    function clear () {
        this.context.clearRect(0, 0, this.size.width, this.size.height);
    }

    function listenToKeys () {
        $('body').keypress(function (event) {
            engine.keypress(event.which);
        });
    }

    function move (direction) {
        var closest = StarFactory.closestToThe(this.player, direction);
        if (closest) {
            console.log("closest!");
            this.player.blur();
            this.player = closest;
            this.player.focus();
        }
    }
});
