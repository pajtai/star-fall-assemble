/*global define:false */
define(function () {
    'use strict';

    var defaultFps = 1000 / 60,
        requestAnimationFrame = (function () {

            return (window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    setTimeout(callback, defaultFps);
                });
        }());

    return {
        config: config,
        start: start,
        go : go
    };

    function config(options) {
        this.options = options;
    }

    function start() {
        this.go = this.go.bind(this);
        this.startTimeStamp = new Date().getTime();
        this.previousTimeStamp = this.startTimeStamp;
        this.fps = {
            ticks: 0,
            startTimeStamp: 0,
            movingAverageIntervalMs: 5000,
            fps: 0
        };
        this.go();
    }

    function go() {
        var gameTimeStamp = new Date().getTime() - this.startTimeStamp,
            dt = gameTimeStamp - this.previousTimeStamp,
            fpsElapsed = gameTimeStamp - this.fps.startTimeStamp;

        this.previousTimeStamp = gameTimeStamp;

        this.fps.ticks += 1;

        // TODO: makes this into a moving average
        if (this.fps.movingAverageIntervalMs < fpsElapsed) {
            this.fps.fps = Math.round(1000 * this.fps.ticks / fpsElapsed);
            this.fps.ticks = 0;
            this.fps.startTimeStamp = gameTimeStamp;
        }

        this.options.update.call(this.options.context, dt, gameTimeStamp, this.fps.fps);
        requestAnimationFrame(this.go);
    }
});
