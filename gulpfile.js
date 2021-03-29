const configuration = {
    port: 3000,
    server: {
        directory: '@server',
        jar: 'server-0.1.0.jar',
        host: 'localhost',
        port: 8086
    }
};

const { src, dest, watch, series, parallel } = require('gulp');

const exec = require('child_process').exec;
const path = require('path');
const pump = require('pump');
const beeper = require('beeper');
const del = require('del');

const { createProxyMiddleware } = require('http-proxy-middleware');
const browserSync = require('browser-sync').create();

const zip = require('gulp-zip');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const jshint = require('gulp-jshint');
// const stylish = require('jshint-stylish');

// PostCSS and its plugins.
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const easyimport = require('postcss-easy-import');

const cleanDist = function (done) {
    del.sync([
        'dist/'
    ]);
    return done();
};

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper().then(() => void 0).catch(() => void 0);
        }
        return done(err);
    };
};

/** Reload the browser. */
const reloadBrowser = function (done) {
    browserSync.reload();
    done();
};

/** Process CSS files. */
const processCss = function (done) {
    pump([
        src('assets/css/*.css', {sourcemaps: true}),
        postcss([
            easyimport,
            autoprefixer(),
            cssnano()
        ]),
        dest('assets/built/', {sourcemaps: '.'})
    ], handleError(done));
};

/** Process JS (JavaScript) files. */
const processJs = function (done) {
    pump([
        src([
            'assets/js/lib/*.js', // Libraries go first.
            'assets/js/*.js'
        ], { sourcemaps: true }),
        concat('scripts.js'),
        uglify(),
        dest('assets/built/', { sourcemaps: '.' })
    ], handleError(done));
};

const lintJs = function (done) {
    src([
        'assets/js/lib/*.js', // Libraries go first.
        'assets/js/*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

    done();
};

/** Watches CSS (assets/css). On change, reloads browser. */
const watchCss = function (done) {
    watch('assets/css/**/*.css', series(processCss, reloadBrowser));
    done();
}

/** Watches JS (assets/js). On change, reloads browser. */
const watchJs = function (done) {
    watch('assets/js/**/*.js', series(processJs, reloadBrowser));
    done();
}

/** Watches data JSON files. On change, reload browser. */
const watchData = function (done) {
    watch('data/*.json', series(reloadBrowser));
    done();
};

/** Watches templates (.html, .hbs). On change, reloads browser. */
const watchTemplates = function (done) {
    watch('templates/**/*.{html,hbs}', series(reloadBrowser));
    done();
}

/** Starts the Cloutlayer local server. */
const startLocalServer = function (done) {
    // TODO Check if java is present.
    const jar = configuration.server.jar;
    const pathToServerJar = path.join(__dirname, '@server', jar);
    const portArg = configuration.server.port;
    const projectRootDirArg = __dirname;
    const command = `java -jar ${pathToServerJar} --server.port=${portArg} --cloutlayer.studio.server.projectRootDir=${projectRootDirArg}`
    exec(command, function (err, stdout, stderr) {
        beeper(1).then(() => void 0).catch(() => void 0);
        console.error('Failed to start Local Server!')
        console.info('Check the log for more information');
        // console.log(stdout);
        // console.log(stderr);
        done(err);
    });

    // Wait for the server to start!
    setTimeout(function () {
        done();
    }, 5500);
};

/** Starts the proxy server. client <-> proxy server <-> local server */
const startProxyServer = function (done) {
    const serverHost = configuration.server.host;
    const serverPort = configuration.server.port;
    const target = `http://${serverHost}:${serverPort}`;
    const proxy = createProxyMiddleware('/', {
        target: target
    });

    browserSync.init({
        server: {
            baseDir: ".",
            middleware: [
                proxy
            ]
        },
        startPath: '/preview/'
    });

    done();
};

const zipTheme = function (done) {
    const date = new Date();
    const fileName = `theme-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.zip`;

    pump([
        src([
            './assets/**/*.*', // TODO Option to exclude scss, less, etc
            './public/**/*.*',
            './templates/**/*.*'
        ], { base: './' }),
        zip(fileName),
        dest('dist/')
    ], handleError(done));
};

const zipAssets = function (done) {
    const date = new Date();
    const fileName = `theme-assets-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.zip`;

    pump([
        src([
            './assets/**/*.*' // TODO Option to exclude scss, less, etc
        ], { base: './' }),
        zip(fileName),
        dest('dist/')
    ], handleError(done));
};


/* Export Tasks */

// Build task: builds scripts and stylesheets, minifies images to optimize delivery, etc.
exports.build = series(
    processCss,
    processJs
);

// (Theme) Zip task: Executes build task and then creates a ready for deployment zip file.
exports.zip = series(
    exports.build,
    zipTheme
);

// (Assets) Zip task: Compiles design assets and then creates a ready for deployment zip file.
exports.zipAssets = series(
    exports.build,
    zipAssets
);

// Development task: starts server and watches all project directories.
exports.dev = series(
    exports.build,
    startLocalServer,
    startProxyServer,
    parallel(
        watchCss,
        watchJs,
        watchData,
        watchTemplates
    )
);

// Clean task: cleans dist directory.
exports.clean = series(
    cleanDist
);
