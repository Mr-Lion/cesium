'use strict';

require('dotenv').config({
    path: './src/app/configs/.env',
    debug: process.env.APP_DEBUG
});

const pkg = require('../package.json');
const argv = require('yargs').argv;
const gulp = require('gulp');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const path = require('path');
const notify = require('gulp-notify');
const header = require('gulp-header');

const mode = gutil.env.APP_ENV ||
    gutil.env.mode ||
    process.env.APP_ENV ||
    'production';

const baseDirs = {
    build: './src/build',
    app: './src/app',
    public: './public'
};

const route = {
    scriptsDir: `${baseDirs.build}/scripts`,

    appDir: baseDirs.app,
    outputDir: baseDirs.public,

    scripts: {
        sass: `${baseDirs.build}/scripts/sass/**/main.*`,
        js: `${baseDirs.build}/scripts/js/**/*`,
        ts: `${baseDirs.build}/scripts/ts/**/main.*`
    }
};


const platform = {
    isWin: process.platform === 'win32',
    isOsX: process.platform === 'darwin',
    isNix: process.platform === 'linux'
};

const cleanOutputDir = () => {
    const del = require('del');

    let temp = [];
    let cleanList = [
        `${route.outputDir}/css/*`,
        `${route.outputDir}/js/*`,
        `${route.appViewsDir}/**`,
    ];

    cleanList.map(x => temp.push(x.split('/').join(path.sep)));
    cleanList = temp;
    temp = null;

    return del(cleanList);
};

const compileScript = (done) => {
    const browserify = require('browserify');
    const glob = require('glob');
    const es = require('event-stream');
    const tsify = require('tsify');
    const terser = require('gulp-terser');
    const sourcemaps = require('gulp-sourcemaps');
    const buffer = require('vinyl-buffer');
    const source = require('vinyl-source-stream');


    [route.scripts.ts, route.scripts.js].map(module =>

        glob(`${module}`, function (err, files) {
            if (err) done(err);

            const tasks = files.map(function (entry) {
                return browserify({
                    basedir: './',
                    debug: mode === 'development',
                    entries: [entry],
                    // extensions: ['*.ts', '*.tsx', '*.js', '*.jsx'],
                    cache: {},
                    packageCache: {},
                })
                    .plugin(tsify)
                    .transform('babelify', {
                        presets: ['es2015'],
                        extensions: ['.ts', '.tsx', '.js', '.jsx'],
                        // basedir: './'
                    })
                    .bundle()
                    // .on('error', gutil.log)
                    .pipe(source(entry))
                    .pipe(rename(function (file) {
                        // Select Modul-Name
                        const moduleName = file.dirname.split(
                            platform.isWin ? /(?:\\)/u
                                : (platform.isOsX || platform.isNix)
                                    ? /(?:\/)/u : /(?:\/)/u
                        ).reverse()[0];
                        const prefix = moduleName === 'admin' ? `.${moduleName}` : '';
                        let baseName = file.basename;
                        const suffix = '.bundle';

                        if (file.dirname === '.' || moduleName === 'admin') {
                            baseName = 'main';
                        }

                        file.basename = `${baseName}${prefix}${suffix}`;

                        file.dirname = moduleName;

                        if (moduleName === 'ts')
                            file.dirname = '';

                        file.extname = '.js';
                    }))
                    .pipe(buffer())
                    .pipe(sourcemaps.init({
                        loadMaps: mode === 'development'
                    }))
                    .pipe(gulpIf(
                        mode === 'production',
                        terser(),
                        gutil.noop()
                    ))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(`${route.outputDir}${path.sep}js`));

            });
            es.merge(tasks).on('end', done);
        }));
};

// Compile SASS to CSS with gulp
const compileStyle = (done) => {
    const sourcemaps = require('gulp-sourcemaps');

    const sass = require('gulp-sass')(require('sass'));
    sass.compiler = require('sass');
    const Fiber = require('fibers');
    const postcss = require('gulp-postcss');
    const autoprefixer = require('autoprefixer');
    const cssnano = require('cssnano');

    const styleMode = mode === 'production' ? 'compressed' : 'expanded';

    const sourceStream = gulp.src(route.scripts.sass)
        // Init Plumber
        .pipe(plumber())
        // Start sourcemap
        .pipe(gulpIf(mode === 'development', sourcemaps.init()))
        // Compile SASS to CSS
        .pipe(
            sass({
                includePaths: ['./node_modules'],

                // Options: nested, expanded, compact, compressed
                outputStyle: styleMode,

                fiber: Fiber,
            }).on('error', sass.logError)
        )
        .pipe(rename(function (file) {
            // Select Modul-Name
            const moduleName = file.dirname.split(
                platform.isWin ? /(?:\\)/u
                    : (platform.isOsX || platform.isNix)
                        ? /(?:\/)/u : /(?:\/)/u
            )[0];

            const baseName = 'main';
            const prefix = moduleName === 'admin' ? `.${moduleName}` : '';
            const suffix = '.min';

            file.basename = `${baseName}${prefix}${suffix}`;

            if (moduleName === 'admin')
                file.dirname = '.';
        }))
        // Add Autoprefixer & cssNano
        .pipe(postcss(gulpIf(
            mode === 'production',
            [autoprefixer(), cssnano()],
            [autoprefixer()]
        )))
        // Write sourcemap
        .pipe(gulpIf(
            mode === 'development',
            sourcemaps.write('.', { addComment: true })
        ))
        // Write everything to destination folder
        .pipe(gulp.dest(`${route.outputDir}${path.sep}css`))
        .on('end', done);
    return sourceStream;
}

const buildContentTasks = gulp.parallel(
    compileScript,
    compileStyle
);

const build = gulp.series(
    cleanOutputDir,
    buildContentTasks
);

const dev = gulp.series(
    cleanOutputDir,
    buildContentTasks,
);

console.log(mode);

exports.dev = dev;
exports.build = build;
exports.default = build;

