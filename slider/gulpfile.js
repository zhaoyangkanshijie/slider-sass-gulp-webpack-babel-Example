var gulp = require('gulp'),
	//sass = require('gulp-ruby-sass'),
    sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	babel = require('gulp-babel'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	rename = require('gulp-rename'),
	del = require('del');


gulp.task('scripts', function() {
	gulp.src('originjs/*.js')
		//.pipe(gulp.dest('js'))
		.pipe(babel()) 
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('js'))
		.pipe(notify({
			message: 'js task complete'
		}));
});

gulp.task('styles', function() {

    gulp.src('sass/*.scss')
        .pipe(sass())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //.pipe(gulp.dest('css'))
		.pipe(minifycss())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('css'))
		.pipe(notify({
		    message: 'css task complete'
		}));
});

gulp.task('auto', function() {

    gulp.watch(['*.js','originjs/*.js'], ['scripts']);
	gulp.watch('sass/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'scripts', 'auto']);
