const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cache = require('gulp-cache');
const minifycss = require('gulp-minify-css');
const usemin = require('gulp-usemin');
const nunjucks = require('gulp-nunjucks-html');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');

gulp.task('nunjucks', () => {
  return gulp.src(['src/**/*.html', '!src/partials/**'])
    .pipe(plumber())
    .pipe(nunjucks({
      searchPaths: ['src/']
    }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({stream: true }));
});

gulp.task('sass', () => {
  return gulp.src(['src/assets/scss/styles.scss', 'src/assets/scss/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.reload({stream: true }));
});

gulp.task('scripts', () =>
  gulp.src('src/assets/js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.reload({stream: true }))
);

gulp.task('images', function () {
  return gulp.src('src/assets/img/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('build/assets/img'));
});

gulp.task('imagesBuild', function () {
  return gulp.src('build/assets/img/**/*')
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('clean', function () {
  return gulp.src('dist')
    .pipe(clean());
});

gulp.task('usemin', ['sass'], function () {
  return gulp.src('build/*.html')
    .pipe(usemin({
      css: [minifycss],
      js: [uglify],
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });
});

gulp.task('build', ['clean'], function () {
  gulp.start('nunjucks', 'usemin', 'imagesBuild');
});

gulp.task('default', ['sass', 'nunjucks', 'scripts', 'images'], function () {
  gulp.start('server');
  gulp.watch('src/**/*.html', ['nunjucks']);
  gulp.watch('src/assets/scss/**/*.scss', ['sass']);
  gulp.watch('src/assets/js/**/*.js', ['scripts']);
  gulp.watch('src/assets/img/**/*', ['images']);
});
