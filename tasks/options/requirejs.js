module.exports = {
    deploy : {
        options: {
            name: "main",
                baseUrl: "app",
                mainConfigFile: "app/main.js",
                out: "build/main.js",
                include : "vendor/requirejs/require.js",
                preserveLicenseComments: false,
                optimize: "uglify2"
        }
    }
};