/*global define:false */
define(['jquery', 'engine', 'starFactory', 'config', 'touchSwipe'], function ($, engine, StarFactory, config, touchSwipe) {
    'use strict';

    // TODO: why are boxes rectangular if body {height:100%}?
    // TODO: move directions into config file
    var UP = config.UP,
        LEFT = config.LEFT,
        RIGHT = config.RIGHT,
        DOWN = config.DOWN,
        SHOOT_UP = config.SHOOT_UP,
        SHOOT_LEFT = config.SHOOT_LEFT,
        SHOOT_RIGHT = config.SHOOT_RIGHT,
        SHOOT_DOWN = config.SHOOT_DOWN;

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
        shoot : shoot,
        stop : stop,
        getDirectionFromTouch : getDirectionFromTouch
    };

    function beginFalling () {
        var $game = $('#game'),
            width = 10;
        this.$score = $('#score');
        this.score = 0;
        this.nextScoreInterval = 500;
        this.nextScoreCounter = 0;
        this.$fps = $('#fps');
        this.canvas = $game.get(0);
        this.size = {
            width : this.canvas.width,
            height : this.canvas.height,
            domWidth : $game.width(),
            domHeight : $game.height()
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
            this.size.width / 2 - width / 2,
            this.size.height / 2 - width / 2,
            width,
            0
        ));

        setTimeout(function () {
            $('#instructions').remove();
        }, 3000);
        this.listenToKeys();
    }

    function update (dt, gameTimeStamp, fps, keypresses) {
        var self = this,
            direction,
            player;

        this.score = this.score + dt;
        this.nextScoreCounter = this.nextScoreCounter + dt;
        if (this.nextScoreInterval < this.nextScoreCounter) {
            this.$score.text(this.score);
            this.nextScoreCounter = 0;
        }

        if (this.previousFps != fps) {
            this.$fps.html(fps);
        }

        if (keypresses.length) {
            switch (direction = keypresses[0].which) {
            case UP:
            case LEFT:
            case DOWN:
            case RIGHT:
                keypresses[0].preventDefault();
                this.move(direction);
                break;
            case SHOOT_UP:
            case SHOOT_LEFT:
            case SHOOT_DOWN:
            case SHOOT_RIGHT:
                keypresses[0].preventDefault();
                this.shoot(direction);
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
        var $body = $('body'),
            self = this;
        $body.keydown(function (event) {
            engine.keypress(event);
        });
        $body.swipe({
            //Generic swipe handler for all directions
            swipe : function (event, direction, distance, duration, fingerCount) {
                var swipe = {};
                swipe.preventDefault = event.preventDefault.bind(event);
                swipe.which = self.getDirectionFromTouch(event, direction, distance);
                engine.keypress(swipe);
            },
            //Default is 75px, set to 0 for demo so any distance triggers swipe
            threshold : 10
        });
    }

    function getDirectionFromTouch(event, direction, distance) {

        var cutoff = this.size.domWidth / 2;
        console.log(event);
        switch(direction) {
        case 'up':
            return event.x || event.touches[0].clientX < cutoff ? UP : SHOOT_UP;
        case 'down':
            return event.x || event.touches[0].clientX < cutoff ? DOWN : SHOOT_DOWN;
        case 'left':
            return (event.x || event.touches[0].clientX) + distance < cutoff ? LEFT : SHOOT_LEFT;
        case 'right':
            return (event.x || event.touches[0].clientX) - distance < cutoff ? RIGHT : SHOOT_RIGHT;
        default:
            return '';
        }
    }

    function move (direction) {
        var player = StarFactory.getPlayer(),
            closest = StarFactory.closestToThe(player, direction);

        if (closest) {
            player.blur();
            if (player.isAlive()) {
                StarFactory.setPlayer(closest);
                closest.focus();
            }
        }
    }

    function shoot (direction) {
        StarFactory.shootFrom(StarFactory.getPlayer(), direction);
    }

    function stop () {
        this.$fps.text('Game Over');
    }
});
