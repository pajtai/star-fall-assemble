/*global define:false */
define(['lodash'], function (_) {

    return Sprite;

    function Sprite(image, rows, cols) {
        this.image = image;
        this.rows = rows;
        this.cols = cols;
    }
});