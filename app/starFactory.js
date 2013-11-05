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

    function createStar () {
        stars.push(new Star(this.maxWidth, this.maxHeight));
    }

    function updateStars (dt, gameTimeStamp) {

        var self = this,
            remove = [],
            collisions = [],
            doneIndices = [];

        $.each(stars, function (index, star) {
            if (!star.move()) {
                remove.push(index);
            }
        });

        if (stars.length) {
            $.each(collisionsInList(stars), function (index, collision) {
                collisions.push(collision[0]);
                collisions.push(collision[1]);
                stars[collision[0]].speed = 0;
                stars[collision[1]].speed = 0;
            });
        }

        remove = remove.concat(collisions);
        // Sorting is needed so that the splices don't remove the wrong items ~
        remove.sort(function (a, b) {
            return b > a;
        });
        $.each(remove, function (index, itemIndex) {
            // Checking for uniqueness of removal
            if (!doneIndices[itemIndex]) {
                stars.splice(itemIndex, 1);
                doneIndices[itemIndex] = true;
            }
        });
    }

    function each (callback) {
        var self = this;
        $.each(stars, function (index, item) {
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
    function collidesWith (star1, star2) {
        return ((star1.x >= star2.x && star1.x <= star2.right) ||
            (star2.x >= star1.x && star2.x <= star1.right)) &&
            ((star1.y >= star2.y && star1.y <= star2.bottom) ||
                (star2.y >= star1.y && star2.y <= star1.bottom));
    }

    /**
     *
     * @param list
     * @returns {Array} Array of pairs of indices of collided items
     */
    function collisionsInList (list) {
        var collisions = [];

        $.each(combinations(list), function (index, pair) {
            if (collidesWith(list[pair[0]], list[pair[1]])) {
                collisions.push([
                    pair[0],
                    pair[1]
                ]);
            }
        });

        return collisions;
    }

    // All possilble pairwise combos from a list
    function combinations (list) {
        var i, j, l = list.length,
            combos = [];

        if (0 === l) {
            return combos;
        }

        // i is the main index we are looping over
        // j is the index of the paired items we are looping over
        i = l - 1;
        while (i + 1) {
            j = i - 1;
            while (j + 1) {
                if (list[i] !== list[j]) {
                    combos.push([
                        i,
                        j
                    ]);
                }
                --j;
            }
            --i;
        }
        return combos;
    }
});
