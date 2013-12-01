module.exports = {
    files : [
        'app/**/*.js',
        '!app/vendor/**/*.js',
        '!app/ignore.js'
    ],
    options : {
        jshintrc : '.jshintrc'
    }
};