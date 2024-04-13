var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var tpl2js = require('hz-gulp-tpl2js');

// gulp.task('sass', function () {
//     return gulp.src('sass/**/*.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('css'));
// });
//
// gulp.task('sass:watch', function () {
//     gulp.watch('sass/**/*.scss', ['sass']);
// });

gulp.task('watch', ['main', 'copy:js', 'test1', 'test2', 'sass'], function (cb) {
    gulp.watch('tpl/*.ejs', ['test1']);
    // gulp.watch('js/tpl/*.js', ['test2']);
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('js/require.config.js', ['main']);
});

gulp.task('test1', function (cb) {
    gulp.src('tpl/*.ejs')
        .pipe(tpl2js({template: 'underscore', context: ''}))
        .pipe(concat('tpl.js'))
        .pipe(gulp.dest('js/tpl')).on('end', cb);

    // gulp.src('js/new/app/**/ejs/*.ejs')
    //     .pipe(tpl2js({template: 'underscore', context: ''}))
    //     .pipe(concat('tpl.js'))
    //     .pipe(gulp.dest('js/new/tpl/')).on('end', cb);
});

gulp.task('test2', function (cb) {
    gulp.src('js/tpl/*.js')
        .pipe(concat('tpl.js'))
        .pipe(gulp.dest('js')).on('end', cb);
});

gulp.task('sass', function () {
    return gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css'));
});

gulp.task('main', function (cb) {
    gulp.src(['js/moment.js', 'js/require.js','js/underscore.js', 'js/jquery.js', 'js/plugin/jquery.lazyload.js', 'js/plugin/layer/layer.js'])
    // gulp.src(['js/require.js', 'js/require.config.js', 'js/underscore.js', 'js/jquery-1.8.2.js', 'js/jquery.lazyload.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js')).on('end', cb);
});