const gulp = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del')

gulp.task('babel', function () {
  return gulp.src('public/js/pagejs/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/min'))
})

gulp.task("brow-comment", function () {
  return browserify("public/js/min/comment.js")
  .bundle()
  .pipe(source("bundle.js"))
  .pipe(buffer())
  .pipe(rename(function(path) {
    path.basename = 'comment.min'
  }))
  .pipe(uglify())
  .pipe(gulp.dest("public/js/min"));
})

gulp.task("brow-course", function () {
  return browserify("public/js/min/course.js")
  .bundle()
  .pipe(source("bundle.js"))
  .pipe(buffer())
  .pipe(rename(function(path) {
    path.basename = 'course.min'
  }))
  .pipe(uglify())
  .pipe(gulp.dest("public/js/min"));
})

gulp.task("brow-manage", function () {
  return browserify("public/js/min/manage.js")
  .bundle()
  .pipe(source("bundle.js"))
  .pipe(buffer())
  .pipe(rename(function(path) {
    path.basename = 'manage.min'
  }))
  .pipe(uglify())
  .pipe(gulp.dest("public/js/min"));
})

gulp.task('clean', function(cb) {
  del([
    'public/js/min/comment.js',
    'public/js/min/course.js',
    'public/js/min/manage.js'
    ], cb)
})

gulp.task('brow', ['brow-comment', 'brow-course', 'brow-manage'])