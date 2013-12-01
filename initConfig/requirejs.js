module.exports = {
    deploy : {
        options: {
            name: "main",
                baseUrl: "app",
                mainConfigFile: "app/main.js",
                out: "build/main.js",
                include : "vendor/almond/almond.js",
                preserveLicenseComments: false,
                optimize: "uglify2"
        }
    }
};