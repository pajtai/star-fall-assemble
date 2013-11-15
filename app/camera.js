/*global define:false */
define(['lodash'], function (_) {

    var floor = Math.floor,
        dotCache = (function() {
            var canvas = document.createElement('canvas'),
                context;

            canvas.width = 1;
            canvas.height = 1;
            context = canvas.getContext('2d');
            context.fillStyle = '#FFFFFF';
            context.fillRect(0,0,1,1);
            return {
                canvas : canvas,
                context : context
            };
        }());

    return {
        viewWindow : {
            x : 0,
            y : 0,
            right : 0,
            bottom : 0
        },
        clear : clear,
        context : undefined,
        centerOn : centerOn,
        draw : draw,
        getViewWindow : getViewWindow,
        getCanvasX : getCanvasX,
        getCanvasY : getCanvasY,
        loadCanvasContext : loadCanvasContext,
        loadRenderArray : loadRenderArray,
        render : render,
        setViewWindow : setViewWindow,
        getViewWindowWidth : getViewWindowWidth,
        getViewWindowHeight : getViewWindowHeight,
        visible : visible
    };

    function clear () {
        // TODO: cache width and height
        this.context.fillRect(0, 0, this.getViewWindowWidth(), this.getViewWindowHeight());
        this.context.fillStyle = "#000000";
    }

    function getViewWindowWidth() {
        return this.viewWindow.right - this.viewWindow.x;
    }

    function getViewWindowHeight() {
        return this.viewWindow.bottom - this.viewWindow.y;
    }

    function centerOn(star) {
        var width = this.getViewWindowWidth(),
            height = this.getViewWindowHeight(),
            halfWidth = floor(width/2),
            halfHeight = floor(height/2),
            newX = star.x - halfWidth,
            newY = star.y - halfHeight;

        this.setViewWindow({
            x : newX,
            y : newY,
            right : newX + width,
            bottom : newY + height
        });
    }

    function loadRenderArray(stars) {
        this.stars = stars;
    }

    function setViewWindow (windowConfig) {
        this.viewWindow.x = floor(windowConfig.x);
        this.viewWindow.y = floor(windowConfig.y);
        this.viewWindow.right = floor(windowConfig.right);
        this.viewWindow.bottom = floor(windowConfig.bottom);
    }

    function getViewWindow () {
        return {
            x : this.viewWindow.x,
            y : this.viewWindow.y,
            right : this.viewWindow.right,
            bottom : this.viewWindow.bottom
        };
    }

    function loadCanvasContext(context) {
        this.context = context;
    }

    function render() {
        var self = this,
            i, j, viewWindow = this.viewWindow;


        this.clear();
        for (i = viewWindow.x; i < viewWindow.right; ++i) {
            for (j = viewWindow.y; j < viewWindow.bottom; ++j) {
                if (0 === i%25 && 0 === j%25) {
                    this.context.drawImage(dotCache.canvas, this.getCanvasX(i), this.getCanvasY(j));
                }
            }
        }


        _.each(this.stars, function(star) {
            if (self.visible(star)) {
                self.draw(star);
            }
        });

    }

    function visible(star) {
        return star.right >= this.viewWindow.x &&
            star.x <= this.viewWindow.right &&
            star.bottom >= this.viewWindow.y &&
            star.y <= this.viewWindow.bottom;
    }

    function draw(star) {
        this.context.drawImage(star.getCachedCanvas(), this.getCanvasX(star), this.getCanvasY(star));
    }

    function getCanvasX(star) {
        return (undefined === star.x ? star : star.x) - this.viewWindow.x;
    }

    function getCanvasY(star) {
        return (undefined === star.y ? star : star.y) - this.viewWindow.y;
    }
});