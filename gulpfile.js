const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');

const script = function(fileName, min = false){
    return gulp.src('./src/*.js')
        .pipe(concat(fileName))
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulpif(min, uglify()))
        .pipe(gulp.dest('./dist/'));
};

gulp.task('build', function () {
    return script('vue-js.energy.min.js', true);
});

gulp.task('dev', function(){
    return script('vue-js.energy.js');
});

gulp.task('watch', function(){
    gulp.watch('./src/*.js', ['dev']);
});

gulp.task('default', ['dev', 'watch']);