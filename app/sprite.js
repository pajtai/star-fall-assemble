/*global define:false */
define(['lodash'], function (_) {

    return Sprite;

    function Sprite(path, rows, cols) {
        this.image = new Image();
        this.image.src = path;
        this.rows = rows;
        this.cols = cols;
    }
});