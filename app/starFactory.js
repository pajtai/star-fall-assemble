/*global define:false */
define(['jquery', 'star'], function ($, Star) {
    'use strict';

    var stars = [];

    return {
        loadContext : loadContext,
        setCanvasSize : setCanvasSize,
        createStar : createStar,
        updateStars : updateStars,
        each : each,
        collidesWith : collidesWith,
        collisionsInList : collisionsInList
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

        debugger;
        if (stars.length) {
            collisionsInList(stars);
        }
    }

    function each (callback) {
        var self = this;
        $.each(stars, function(index, item) {
            callback.call(self.context, index, item);
        });
    }

    /**
     * Returns true if this star collides with another.
     * Stars are rectangles.
     * @param star1
     * @param star2
     * @returns {boolean}
     */
    function collidesWith(star1, star2) {
        return ((star1.x >= star2.x && star1.x <= star2.right) ||
            (star2.x >= star1.x && star2.x <= star1.right)) &&
            ((star1.y >= star2.y && star1.y <= star2.bottom) ||
                (star2.y >= star1.y && star2.y <= star1.bottom));
    }

     function collisionsInList(list1) {
        var a = [];

         $.each(combinations(list1, 2), function(index, pair) {
            if( collidesWith(pair[0], pair[1]) ) {
                a.push([pair[0], pair[1]]);
            }
        });

        return a;
    }

    // Never ending loop
    function combinations(list, n) {
        var f = function(i) {
            if(list.isSpriteList !== undefined) {
                return list.at(i)
            } else {  // s is an Array
                return list[i];
            }
        };
        var r = [];
        var m = new Array(n);
        for (var i = 0; i < n; i++) m[i] = i;
        for (var i = n - 1, sn = list.length; 0 <= i; sn = list.length) {
            r.push( m.map(f) );
            while (0 <= i && m[i] == sn - 1) { i--; sn--; }
            if (0 <= i) {
                m[i] += 1;
                for (var j = i + 1; j < n; j++) m[j] = m[j-1] + 1;
                i = n - 1;
            }
        }
        return r;
    }
});
