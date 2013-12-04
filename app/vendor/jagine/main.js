define([
    './camera',
    './engine',
    './sprite',
    './square',
    './squareFactory',
    './sprites',
    './util'], function(camera, engine, sprite, square, squareFactory, sprites, util) {

    var JAG = {
        camera : camera,
        engine : engine,
        sprite : sprite,
        square : square,
        squareFactory : squareFactory,
        sprites : sprites,
        util : util
    };

    return JAG;
});