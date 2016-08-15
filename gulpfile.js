var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var data = require('gulp-data');

gulp.task('connect',function () {
   return connect.server({
       root: ['app'],
       port: 9000,
       livereload: true
   });
});

gulp.task('watch', function () {
  gulp.watch('app/**/*', function () {
    return gulp.src('app/**/*.+(html|js|css)')
    .pipe(data(function() {return require('./app/data.json')}))
    .pipe(gulp.dest('app'))
    .pipe(connect.reload());
  });
});

gulp.task('serve', ['connect', 'watch'],function () {
  return;
});

gulp.task('reload', function () {
  connect.reload();
});
