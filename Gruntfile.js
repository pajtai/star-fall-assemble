/*global module:false, require:false*/
module.exports = function (grunt) {

    'use strict';

    var path = require('path'),
        lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
        folderMount = function folderMount (connect, point) {
            return connect.static(path.resolve(point));
        };

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

        watch : {
            tests : {
                options : {
                    // Start a live reload server on the default port: 35729
                    livereload : true
                },
                files : [
                    'tests/**/*.js',
                    'app/**/*.js'
                ],
                tasks: [
                ]
            }
        },

        connect : {
            options : {
                port : 9001,
                hostname : 'localhost',
                middleware : function (connect, options) {
                    return [lrSnippet, folderMount(connect, options.base)];
                }
            },
            app : {
                options : {
                    base : './app'
                }
            },
            tests : {
                options : {
                    base : './'
                }
            }
        },

        open : {
            app : {
                path : 'http://localhost:9001/'
            },
            tests : {
                path : 'http://localhost:9001/tests/'
            }
        },

        clean : {
            build : ['build']
        },

        copy : {
            build : {
                files : [
                    {expand: true, src : 'app/**', dest : 'build'},
                    {expand: true, src : 'tests/**', dest : 'build'}
                ]
            }
        },

        build_gh_pages : {
            build : {
                options : {
                    build_branch : 'gh-pages',
                    dist : 'build'
                }
            }
        },

        jshint : {
            files : [
                'app/**/*.js',
                '!app/vendor/**/*.js',
                '!app/ignore.js'
            ],
            options : {
                jshintrc : '.jshintrc'
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: "path/to/base",
                    mainConfigFile: "path/to/config.js",
                    out: "path/to/optimized.js"
                }
            }
        }
    });

    // To start editing your slideshow using livereload, run 'grunt server'
    grunt.registerTask('server', 'Build and watch task', ['jshint', 'connect:app',  'open:app', 'watch']);
    grunt.registerTask('testServer', 'Build and watch task', ['connect:tests',  'open:tests', 'watch']);
    grunt.registerTask('deploy', 'Deploy website to gh-pages', ['clean:build', 'copy:build', 'build_gh_pages:build']);
};