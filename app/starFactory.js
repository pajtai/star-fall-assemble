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

        if (stars.length) {
            $.each(collisionsInList(stars), function (index, collision) {
                collision[0].speed = 0;
                collision[1].speed = 0;
            });
        }

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
        var collisions = [];

         $.each(combinations(list1, 2), function(index, pair) {
            if(collidesWith(pair[0], pair[1]) ) {
                collisions.push([
                    pair[0],
                    pair[1]
                ]);
            }
        });

        return collisions;
    }

    // All possilble pairwise combos from a list
    function combinations(list) {
        var i, j, l = list.length,
            combos = [];

        if (0 === l) {
            return combos;
        }

        // i is the main index we are looping over
        // j is the index of the paired items we are looping over
        i = l-1;
        while(i + 1) {
            j = i-1;
            while(j + 1) {
                if (list[i] !== list[j]) {
                    combos.push([
                        list[i],
                        list[j]
                    ]);
                }
                --j;
            }
            --i;
        }
        return combos;
    }
});
