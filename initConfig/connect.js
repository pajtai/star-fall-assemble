var path = require('path'),
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    folderMount = function folderMount (connect, point) {
        return connect.static(path.resolve(point));
    };

module.exports = {
    options : {
        port : 9001,
        hostname : 'localhost',
        middleware : function (connect, options) {
            return [lrSnippet, folderMount(connect, options.base)];
        }
    },
    app : {
        options : {
            base : './app',
            open : true
        }
    },
    deploy : {
        options : {
            base : './build',
            keepalive : true,
            open : true
        }
    },
    tests : {
        options : {
            base : './'
        }
    }
};