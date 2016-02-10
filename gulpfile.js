//The main variable where you install dependencies | gulp plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'dev';

if (env === 'dev'){
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
}else{
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

//Link variables for different files
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*html'];
jsonSources = [outputDir + 'js/*.json'];

//Tasks start

//Coffee transform coffeescript in JS
gulp.task('coffee', function(){
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

//Concatenate all js in one
gulp.task('js', function(){
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});
//Compass watch for sass files and make them .css (better with sass --watch)
gulp.task('compass', function(){
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

//Live reload Task
gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  });
});

//Use task reload for html files
gulp.task('html', function(){
	gulp.src(htmlSources)
	.pipe(connect.reload())
});

//Use task reload for html json files
gulp.task('json', function(){
	gulp.src(jsonSources)
	.pipe(connect.reload())
});

//gulp.task('watch') is the task that watch the files if are changing
gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);
});

//gulp.task('default') is the default task that runs when you type in command gulp
//['coffee', 'js', 'compass']-- are depencecies so will run in order||
gulp.task('default', ['html','json','coffee', 'js', 'compass', 'connect', 'watch']);


//====>
//Compile on PROD OR DEV FROM CONSOLE => NODE_ENV=prod/dev gulp
