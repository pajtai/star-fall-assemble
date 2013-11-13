/*global define:false */
define(['./star', './config','lodash'], function (Star, config,_) {
    'use strict';

    var stars = [],
        player,
        UP = config.UP,
        LEFT = config.LEFT,
        RIGHT = config.RIGHT,
        DOWN = config.DOWN,
        SHOOT_UP = config.SHOOT_UP,
        SHOOT_LEFT = config.SHOOT_LEFT,
        SHOOT_RIGHT = config.SHOOT_RIGHT,
        SHOOT_DOWN = config.SHOOT_DOWN,
        pi_0_0 = config.pi_0_0,
        pi_0_5 = config.pi_0_5,
        pi_1_0 = config.pi_1_0,
        pi_1_5 = config.pi_1_5,
        testMode = false,
        floor = Math.floor,
        ceil = Math.ceil;

    // TODO: create a star manager
    return {

        PLAYER: Star.PLAYER,
        BULLET: Star.BULLET,
        REGULAR: Star.REGULAR,

        closestToThe : closestToThe,
        collidesWith : collidesWith,
        collisionsInList : collisionsInList,
        createStar : createStar,
        each : each,
        getPlayer : getPlayer,
        loadContext : loadContext,
        setCamera : setCamera,
        setPlayer : setPlayer,
        shootFrom : shootFrom,
        updateStars : updateStars
    };

    function loadContext (context) {
        this.context = context;
    }

    /**
     * Creates a star on camera
     * @param starType
     * @param x
     * @param y
     * @param width
     * @param speed
     * @param directionRad
     * @returns {Star}
     */
    function createStar (starType, x, y, width, speed, directionRad) {
        var star = new Star(this.camera, starType, x, y, width, speed, directionRad);
        stars.push(star);
        return star;
    }

    function updateStars (dt, gameTimeStamp) {

        var remove = [],
            collisions = [],
            doneIndices = [],
            plusScore = 0,
            scoreStars = [];

        _.each(stars, function (star, index) {
            if (!star.move(dt)) {
                remove.push(index);
            }
        });

        if (stars.length) {
            _.each(collisionsInList(stars), function (collision) {
                var star1, star2;
                collisions.push(collision[0]);
                collisions.push(collision[1]);
                if (config.score.bulletCollisions) {
                    if (Star.BULLET === stars[collision[0]].getType()) {
                        scoreStars.push(stars[collision[0]]);
                    }
                    if (Star.BULLET === stars[collision[1]].getType()) {
                        scoreStars.push(stars[collision[1]]);
                    }
                }
                star1 = stars[collision[0]];
                star2 = stars[collision[1]];
                star1.stop();
                star2.stop();
            });
        }

        if (!testMode) {
            remove = remove.concat(collisions);
        }
        // Sorting is needed so that the splices don't remove the wrong items ~
        remove.sort(function (a, b) {
            return b > a;
        });
        _.each(remove, function (itemIndex) {
            if (stars[itemIndex]) {
                stars[itemIndex].kill();
            }
            // Checking for uniqueness of removal
            if (!doneIndices[itemIndex]) {
                stars.splice(itemIndex, 1);
                doneIndices[itemIndex] = true;
            }
        });
        scoreStars = _.uniq(scoreStars);
        _.each(scoreStars, function() {
            plusScore += config.score.points.collision;
        });
        return plusScore;
    }

    function each (callback) {
        var self = this;
        _.each(stars, function (item, index) {
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

        _.each(combinations(list), function (pair) {
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

    function assignClosest(closest, candidate, distance) {
        if (!closest.star) {
            closest.star = candidate;
            closest.distance = distance;
        } else {
            if (distance < closest.distance) {
                closest.star = candidate;
                closest.distance = distance;
            }
        }
    }

    function closestToThe (star, direction) {
        var closest = {
            star: undefined,
            distance: undefined
            },
            distance;

        _.each(stars, function(candidate) {
            switch (direction) {
            case UP:
            case LEFT:
            case DOWN:
            case RIGHT:
                if (candidate.is(direction, star)) {
                    distance = candidate.distance(direction, star);
                        assignClosest(closest, candidate, distance);
                }
                break;
            }
        });
        if (!closest.star) {

        }
        return closest.star;
    }

    function setPlayer(thePlayer) {
        player = thePlayer;
    }

    function getPlayer() {
        return player;
    }

    function shootFrom(player, direction) {
        var width = 5,
            speed = 0.1;
        // TODO: replace hard coded color with type - bullet
        switch (direction) {
        case SHOOT_UP:
            this.createStar(Star.BULLET
                , floor(player.x + player.width/2 - width/2)
                , floor(player.y - width)
                , width
                , speed
                , pi_0_5);
            break;
        case SHOOT_DOWN:
            this.createStar(Star.BULLET
                , floor(player.x + player.width/2 - width/2)
                , ceil(player.bottom)
                , width
                , speed
                , pi_1_5);
            break;
        case SHOOT_LEFT:
            this.createStar(Star.BULLET
                , floor(player.x - player.width)
                , floor(player.y + player.width/2 - width/2)
                , width
                , speed
                , pi_1_0);
            break;
        case SHOOT_RIGHT:
            this.createStar(Star.BULLET
                , ceil(player.right)
                , floor(player.y + player.width/2 - width/2)
                , width
                , speed
                , pi_0_0);
            break;
        }
    }

    function setCamera(camera) {
        this.camera = camera;
    }
});
