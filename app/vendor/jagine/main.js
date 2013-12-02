define([
    './camera',
    './engine',
    './sprite',
    './square',
    './starFactory',
    './util'], function(camera, engine, sprite, square, starFactory, util) {

    var JAG = {};

    JAG.camera = camera;
    JAG.engine = engine;
    JAG.sprite = sprite;
    JAG.square = square;
    JAG.starFactory = starFactory;
    JAG.util = util;

    return JAG;
});