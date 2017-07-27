var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('build', ['sass', 'images', 'fonts']);

gulp.task('sass', function() {
  	return gulp.src('app/scss/**/*.scss')
    	.pipe(sass())
    	.pipe(gulp.dest('../app/src/main/resources/site/assets/css'));
});

gulp.task('images', function(){
	return gulp.src('app/images/**/*')
		.pipe(gulp.dest('../app/src/main/resources/site/assets/images'));
});

gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('../app/src/main/resources/site/assets/fonts'));
});


gulp.task('watch', function(){
	gulp.watch('app/**/*', ['build']);
});
