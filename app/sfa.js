/*global define:false */
define(['jquery', './engine', './starFactory', './config', 'touchSwipe', './camera'], function ($, engine, starFactory, config, touchSwipe, camera) {
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
        SHOOT_DOWN = config.SHOOT_DOWN,
        cached_start_x;

    return {
        beginFalling : beginFalling,
        createNewStar : createNewStar,
        getDirectionFromTouch : getDirectionFromTouch,
        listenToKeys : listenToKeys,
        move : move,
        nextStarInterval : 0,
        previousFps : 0,
        starIntervalMs : 200,
        shoot : shoot,
        stars : [],
        stop : stop,
        update : update
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
            domWidth : $game.width(),
            domHeight : $game.height()
        };
        this.context = this.canvas.getContext('2d');

        camera.loadCanvasContext(this.context);
        camera.setViewWindow({
            x : 0,
            y : 0,
            right : this.canvas.width,
            bottom : this.canvas.height
        });
        camera.loadRenderArray(starFactory.getStarsArray());

        starFactory.loadContext(this);
        // TODO: camera is being injected into too many objects
        starFactory.setCamera(camera);
        starFactory.setPlayer(
            this.createNewStar(
                starFactory.PLAYER,
                0,
                0,
                width,
                0
        ));

        engine.config({
            context : this,
            update : this.update,
            stop : this.stop
        });
        engine.start();
        // TODO: move player somewhere else


        setTimeout(function () {
            $('#instructions').remove();
        }, 3000);

        this.listenToKeys();
    }

    function update (dt, gameTimeStamp, fps, keypresses) {
        var self = this,
            direction,
            player;

        if (config.score.timePassed) {
            this.score = this.score + (dt * config.score.points.time);
        }

        // TODO: replace with setTimeout
        this.nextScoreCounter = this.nextScoreCounter + dt;

        if (this.previousFps != fps) {
            this.$fps.html(fps);
        }

        if (keypresses.length) {
            direction = keypresses[0].which;
            switch (direction) {
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
        this.score += starFactory.updateStars(dt, gameTimeStamp);
        if (this.nextScoreInterval < this.nextScoreCounter) {
            this.$score.text(this.score);
            this.nextScoreCounter = 0;
        }
        camera.centerOn(starFactory.getPlayer());
        camera.render();

        if (gameTimeStamp >= this.nextStarInterval) {
            this.createNewStar();
        }
        player = starFactory.getPlayer();

        return player ? player.isAlive() : true;
    }

    // TODO: create attributes object
    function createNewStar (starType, x, y, width, speed) {
        this.nextStarInterval += this.starIntervalMs;
        return starFactory.createStar(starType || starFactory.REGULAR, x, y, width, speed);
    }

    function listenToKeys () {
        var $body = $('body'),
            self = this;
        $body.keydown(function (event) {
            engine.keypress(event);
        });
        $body.swipe({
            swipeStatus:function(event, phase, direction, distance, duration, fingers)
            {
                var START = 'start',
                    END = 'end',
                    swipe;
                //Here we can check the:
                //phase : 'start', 'move', 'end', 'cancel'
                //direction : 'left', 'right', 'up', 'down'
                //distance : Distance finger is from initial touch point in px
                //duration : Length of swipe in MS
                //fingerCount : the number of fingers used
                switch (phase) {
                case START:
                    cached_start_x = event.clientX || event.touches[0].clientX;
                    break;
                case END:
                    cached_start_x = undefined;
                    swipe = {};
                    swipe.preventDefault = event.preventDefault.bind(event);
                    swipe.which = self.getDirectionFromTouch(event, direction, distance);
                    swipe.cached_start_x = cached_start_x;
                    engine.keypress(swipe);
                    break;
                }

            },
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

        var cutoff = this.size.domWidth / 2,
            theX = event.cached_start_x || event.x;
        switch(direction) {
        case 'up':
            return theX < cutoff ? UP : SHOOT_UP;
        case 'down':
            return theX < cutoff ? DOWN : SHOOT_DOWN;
        case 'left':
            return theX + distance < cutoff ? LEFT : SHOOT_LEFT;
        case 'right':
            return theX - distance < cutoff ? RIGHT : SHOOT_RIGHT;
        default:
            return '';
        }
    }

    function move (direction) {
        var player = starFactory.getPlayer(),
            closest = starFactory.closestToThe(player, direction);

        if (closest) {
            player.blur();
            if (player.isAlive()) {
                starFactory.setPlayer(closest);
                closest.focus();
            }
        }
    }

    function shoot (direction) {
        starFactory.shootFrom(starFactory.getPlayer(), direction);
    }

    function stop () {
        this.$fps.text('Game Over');
    }
});
