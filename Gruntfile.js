/*global module:false, require:false*/
module.exports = function (grunt) {

    'use strict';

    var _ = grunt.util._;

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig(loadConfig('./initConfig/'));

    grunt.registerTask('rewriteIndex', function() {
        var index = grunt.file.read('build/index.html');
        index = index.replace('data-main="main"', '');
        index = index.replace('vendor/requirejs/require.js', 'main.js');
        grunt.file.write('build/index.html', index);
    });

    // To start editing your slideshow using livereload, run 'grunt server'
    grunt.registerTask('server', 'Build and watch task',
        [
            'jshint',
            'connect:app',
            'watch'
        ]);
    grunt.registerTask('testDeploy', 'Build and watch task',
        [
            'jshint',
            'clean:build',
            'copy:build',
            'requirejs',
            'rewriteIndex',
            'connect:deploy'
        ]);
    grunt.registerTask('testServer', 'Build and watch task', ['connect:tests',  'open:tests', 'watch']);
    grunt.registerTask('deploy', 'Deploy website to gh-pages',
        [
            'clean:build',
            'copy:build',
            'requirejs',
            'rewriteIndex',
            'build_gh_pages:build'
        ]);

    function loadConfig(files) {
        var glob = require('glob'),
            path = require('path'),
            object = {},
            key,
            required;

        glob.sync('*', {cwd: files}).forEach(function(option) {
            key = path.basename(option, '.js');
            required = require(files + option);
            if (_.isFunction(required)) {
                required = required(grunt);
            }
            object[key] = required;
        });
        return object;
    }
};