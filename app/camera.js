/*global define:false */
define(['lodash'], function (_) {
    var viewWindow = {
        x : 0,
        y : 0,
        right : 0,
        bottom : 0
    };

    return {
        getViewWindow : getViewWindow,
        setViewWindow : setViewWindow
    };

    function setViewWindow (windowConfig) {
        viewWindow.x = windowConfig.x;
        viewWindow.y = windowConfig.y;
        viewWindow.right = windowConfig.right;
        viewWindow.bottom = windowConfig.bottom;
    }

    function getViewWindow () {
        return {
            x : viewWindow.x,
            y : viewWindow.y,
            right : viewWindow.right,
            bottom : viewWindow.bottom
        }
    }
});