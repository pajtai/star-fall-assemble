/*global define:false */
define(['jquery', 'star'], function ($, Star) {
    'use strict';

    var stars = [];

    return {
        loadContext : loadContext,
        setCanvasSize : setCanvasSize,
        createStar : createStar,
        updateStars : updateStars,
        each : each
    };

    function loadContext (context) {
        this.context = context;
    }

    function setCanvasSize (maxWidth, maxHeight) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    function createStar() {
        stars.push(new Star(this.maxWidth, this.maxHeight));
    }

    function updateStars(dt, gameTimeStamp) {

        var self = this,
            remove = [];

        $.each(stars, function (index, star) {
            if (!star.move()) {
                remove.push(index);
            }
        });
        // Sorting is needed so that the splices don't remove the wrong items ~
        remove.sort(function (a, b) {
            return b > a;
        });
        $.each(remove, function (index, item) {
            stars.splice(item, 1);
        });
    }

    function each (callback) {
        var self = this;
        $.each(stars, function(index, item) {
            callback.call(self.context, index, item);
        });
    }
});
