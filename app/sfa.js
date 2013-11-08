/*global define:false */
define(['jquery', 'engine', 'starFactory'], function ($, engine, StarFactory) {
    'use strict';

    // TODO: move directions into config file
    var UP = 119,
        LEFT = 97,
        RIGHT = 100,
        DOWN = 115,
        floor = Math.floor;

    return {
        stars : [],
        beginFalling : beginFalling,
        update : update,
        clear : clear,
        previousFps : 0,
        starIntervalMs : 200,
        nextStarInterval : 0,
        createNewStar : createNewStar,
        listenToKeys : listenToKeys,
        move : move,
        stop : stop
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
            update : this.update,
            stop : this.stop
        });
        engine.start();
        // TODO: move player somewhere else
        StarFactory.setPlayer(this.createNewStar(
            true,
            this.size.width/2 - width/2,
            this.size.height/2 - width/2,
            width,
            0
        ));

        setTimeout(function() {
            $('#instructions').remove();
        }, 4000);
        this.listenToKeys();
    }

    function update (dt, gameTimeStamp, fps, keypresses) {
        var self = this,
            direction,
            player;

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
            item.drawOn(self.context);
        });
        if (gameTimeStamp >= this.nextStarInterval) {
            this.createNewStar();
        }
        player = StarFactory.getPlayer();

        return player ? player.isAlive() : true;
    }

    // TODO: create attributes object
    function createNewStar (focused, x, y, w, s) {
        this.nextStarInterval += this.starIntervalMs;
        return StarFactory.createStar(focused, x, y, w, s);
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
        var player = StarFactory.getPlayer();
        var closest = StarFactory.closestToThe(player, direction);
        if (closest) {
            player.blur();
            if (player.isAlive()) {
                StarFactory.setPlayer(closest);
                closest.focus();
            }
        }
    }

    function stop () {
        this.$fps.text('Game Over');
    }
});
