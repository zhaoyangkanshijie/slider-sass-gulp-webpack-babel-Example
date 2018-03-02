'use strict';

const
    fs = require('fs'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    gutil = require("gulp-util"),
    webpack = require('webpack'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync');

const
    config = require('./gulpConfig.js'),
    // webpackConfig = require('./webpack.config.js'),
    webpackConfig = require('./webpack.build.js'),
    myDevConfig = Object.create(webpackConfig);

const filterPath = e => {
    return e.path.substring(e.path.lastIndexOf('src')).replace(/\\/g, '/');
};

const style = e => {

    const changedPath = filterPath(e);

    const path = config.srcPath.scss;

    for (let key in path) {

        if (changedPath && path[key].findIndex(x => x == changedPath) === -1) continue;

        gulp.src(path[key])
            .pipe(plumber())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            // .pipe(gulp.dest(config.outPath.css))
            .pipe(cleanCSS())
            .pipe(rename({
                basename: `${key}`,
                suffix: '.min'
            }))
            .pipe(gulp.dest(config.outPath.css))
            .pipe(notify({
                message: `${path[key][0]} -> ${path[key][0].replace('src', 'dist').replace(/scss/g, 'css')}`
            }));

    }

};

gulp.task('style', () => {

    let path = config.srcPath.scss;

    for (let key in path) {

        if (!fs.existsSync(path[key][0])) continue;

        gulp.src(path[key])
            .pipe(plumber())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            // .pipe(gulp.dest(config.outPath.css))
            .pipe(cleanCSS())
            .pipe(rename({
                basename: `${key}`,
                suffix: '.min'
            }))
            .pipe(gulp.dest(config.outPath.css))
            .pipe(notify({
                message: `src/scss/${key}.scss -> dist/css/${key}.css`
            }));

    }

});

const copy = e => {

    const changedPath = filterPath(e);

    gulp.src(changedPath)
        .pipe(plumber())
        .pipe(gulp.dest(config.outPath.lib))
        .pipe(notify({
            message: `${changedPath} -> ${changedPath.replace('src', 'dist')}`
        }));

};

gulp.task('webpack', function(callback) {

    webpack(myDevConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
    });

});

gulp.task('watch', () => {
    gulp.watch(config.all.scss, e => {
        if (filterPath(e).includes('config') || filterPath(e).includes('components')) {
            gulp.start('style');
        } else {
            style(e);
        }
    });

    gulp.watch(config.all.lib, e => {
        copy(e);
    });

    browserSync.init({
        proxy: 'http://localhost:58874/'
    });

	gulp.watch(config.outPath.path).on('change', browserSync.reload);

    gulp.watch(config.all.html).on('change', browserSync.reload);

});

gulp.task('default', ['style', 'webpack', 'watch']);
