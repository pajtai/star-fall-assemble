module.exports = {
    build : {
        files : [
            {expand: true,
                cwd : 'app/',
                src :
                    [
                        '**',
                        '!**/*.js',
                        '!vendor',
                        '!vendor/**/*'
                    ], dest : 'build'}
        ]
    }
};