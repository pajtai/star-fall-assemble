define([
    './camera',
    './engine',
    './sprite',
    './square',
    './starFactory',
    './util'], function(camera, engine, sprite, square, starFactory, util) {

    var JAG = {
        camera : camera,
        engine : engine,
        sprite : sprite,
        square : square,
        starFactory : starFactory,
        util : util
    };

    return JAG;
});