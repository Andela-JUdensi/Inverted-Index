'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const pump = require('pump');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const jasmine = require('gulp-jasmine');
const coveralls = require('gulp-coveralls');


const reload = browserSync.reload;
const notifier = file => browserSync.notify(`<h4>Changes made to ${file.path.split('/').pop()}.\nRefreshing iDex<h4>`);

gulp.task('browserSync', ['nodemon'], () => {
  browserSync.init({
    proxy: 'localhost:8080',  // local node app address
    port: 5000,  // use *different* port than above
    logLevel: 'debug',
    logPrefix: 'iDex',
    logFileChanges: true,
    logConnections: true,
    minify: true,
    notify: false,
  });
});

browserSync.emitter.on('init', () => {
  // eslint-disable-next-line no-console
  console.log('iDex have experienced some changes');
});

gulp.task('nodemon', (cb) => {
  let called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
    ],
  })
  .on('start', () => {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', () => {
    setTimeout(() => {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('watch', ['browserSync'], () => {
  gulp.watch('public/*.html', reload).on('change', (file) => {
    notifier(file);
  });
  gulp.watch('public/css/*.css', reload).on('change', (file) => {
    notifier(file);
  });
  gulp.watch('public/builds/**/*.js', reload).on('change', (file) => {
    notifier(file);
  });
  gulp.watch('**/*.js', reload).on('change', (file) => {
    notifier(file);
  });
});

gulp.task('eslint', () => {
  gulp.src([
    'gulpfile.js',
    'public/builds/**/*.js',
    'specs/*.js',
    'app.js',
  ])
    .pipe(eslint());
});

gulp.task('babel', () => gulp.src(['public/builds/**/*.js'])
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(gulp.dest('public/dist/')));

gulp.task('minify', (cb) => {
  pump([
    gulp.src('public/dist/**/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' })),
    gulp.dest('public/lib/'),
  ], cb);
});

gulp.task('test', () => gulp.src(['specs/inverted-index-test.js'])
    .pipe(jasmine()));

gulp.task('coverage', ['unit-test'], () => gulp.src('specs/*.js')
    .pipe(jasmine())
    .pipe(istanbul.writeReports())
    .on('end', () => {
      gulp.src('coverage/lcov.info')
        .pipe(coveralls());
    }));

gulp.task('default', ['minify', 'watch']);
