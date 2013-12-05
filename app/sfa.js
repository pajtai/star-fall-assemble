/*global define:false */
define([
    'jquery',
    './config',
    'touchSwipe',
    'jagine',
    'lodash'], function ($, config, touchSwipe, JAG, _i) {

    'use strict';

    // _Sprites from : http://forums.rpgmakerweb.com/index.php?/topic/866-zombie-sprites/_
    // TODO: create load config function
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
        begin : begin,
        createNewZombie : createNewZobie,
        getDirectionFromTouch : getDirectionFromTouch,
        listenToKeys : listenToKeys,
        move : move,
        initializeCamera : initializeCamera,
        initializeFields : initializeFields,
        initializeSquareFactory : initializeSquareFactory,
        nextSquareInterval : 0,
        previousFps : 0,
        starIntervalMs : 200,
        shoot : shoot,
        stars : [],
        stop : stop,
        update : update,
        $score : undefined,
        $window : undefined,
        $fps : undefined,
        $modal : undefined,
        canvas : undefined,
        size : undefined,
        score : undefined,
        startEngine : startEngine,
        nextScoreInterval : undefined,
        nextScoreCounter : undefined
    };

    function begin () {
        var $instructions = $('#instructions'),
            self = this;
        this.initializeFields();
        JAG.sprites.loadResource('imgs/zombie_sprites.png')
            .done(function(spriteKey) {
                self.spriteKey = spriteKey;
                self.initializeCamera();
                self.initializeSquareFactory();
                self.startEngine();
                self.listenToKeys();
            });

        if (window.DocumentTouch && document instanceof DocumentTouch) {
            $instructions.html('<h3>Swipe on left side of screen to jump focus<br/>Swipe on right side of screen to shoot</h3>');
        }
        setTimeout(function () {
            $instructions.remove();
        }, 3000);
    }

    function initializeFields () {
        var $game = $('#game');
        this.$score = $('#score');
        this.$modal = $('#modal');
        this.$modal.hide();
        this.$window = $(window);
        this.score = 0;
        this.nextScoreInterval = 500;
        this.nextScoreCounter = 0;
        this.$fps = $('#fps');
        this.canvas = $game.get(0);
        this.size = {
            domWidth : this.$window.width(),
            domHeight : this.$window.height()
        };
        this.context = this.canvas.getContext('2d');
    }

    function initializeCamera () {
        JAG.camera.loadCanvasContext(this.context);
        JAG.camera.setViewWindow({
            x : 0,
            y : 0,
            right : this.canvas.width,
            bottom : this.canvas.height
        });
        JAG.camera.loadRenderArray(JAG.squareFactory.getNewSquaresArray());

    }

    function initializeSquareFactory () {
        var width = 10;
        JAG.sprites.createSpriteFromResource(this.spriteKey);
        JAG.squareFactory.loadConfig(config);
        JAG.squareFactory.loadContext(this);
        // TODO: camera is being injected into too many objects
        JAG.squareFactory.setCamera(JAG.camera);


        //JAG.spriteManager.loadSprite()

        JAG.squareFactory.setPlayer(
            this.createNewZombie(
                JAG.squareFactory.PLAYER,
                0,
                0,
                width,
                0
            ));
    }

    function startEngine () {
        JAG.engine.config({
            context : this,
            update : this.update,
            stop : this.stop
        });
        JAG.engine.start();
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
        this.score += JAG.squareFactory.updateSquares(dt, gameTimeStamp);
        if (this.nextScoreInterval < this.nextScoreCounter) {
            this.$score.text(this.score);
            this.nextScoreCounter = 0;
        }
        JAG.camera.centerOn(JAG.squareFactory.getPlayer());
        JAG.camera.render();

        if (gameTimeStamp >= this.nextSquareInterval) {
            this.createNewZombie();
        }
        player = JAG.squareFactory.getPlayer();

        return player ? player.isAlive() : true;
    }

    // TODO: create attributes object
    function createNewZobie (starType, x, y, width, speed) {
        this.nextSquareInterval += this.starIntervalMs;
        return JAG.squareFactory.createSquare(starType || JAG.squareFactory.REGULAR, x, y, width, speed);
    }

    function listenToKeys () {
        var $body = $('body'),
            self = this;
        $body.keydown(function (event) {
            JAG.engine.keypress(event);
        });
        //
        $body.swipe({
            swipeStatus : function (event, phase, direction, distance, duration, fingers) {
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
                    swipe = {};
                    swipe.preventDefault = event.preventDefault.bind(event);
                    swipe.which = self.getDirectionFromTouch(event, direction, distance);
                    JAG.engine.keypress(swipe);
                    break;
                }

            },
            //Default is 75px, set to 0 for demo so any distance triggers swipe
            threshold : 10
        });
    }

    function getDirectionFromTouch (event, direction, distance) {

        var cutoff = this.size.domWidth / 2,
            theX = cached_start_x || event.x;
        cached_start_x = undefined;
        switch (direction) {
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
        var player = JAG.squareFactory.getPlayer(),
            closest = JAG.squareFactory.closestToThe(player, direction);

        if (closest) {
            player.blur();
            if (player.isAlive()) {
                JAG.squareFactory.setPlayer(closest);
                closest.focus();
            }
        }
    }

    function shoot (direction) {
        JAG.squareFactory.shootFrom(JAG.squareFactory.getPlayer(), direction);
    }

    function stop () {
        var self = this;
        this.$score.text(this.score);
        this.$fps.text('Game Over');

        // TODO: real modal that is centered - possibly tying in with jagine
        // TODO: figure out why reloading game doesn't show squares for a few seconds
        this.$modal.show().html('<div>Your score was: ' + this.score + '<br/><br/>Click here to play again</div>').on('click', function() {
            self.begin();
            $(this).hide();
        }, undefined, undefined, 1);
    }
});
