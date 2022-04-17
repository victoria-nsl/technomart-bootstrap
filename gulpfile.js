const {src, dest, watch, series, parallel} = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');

//html
function html() {
  return src('source/*.html')
    .pipe(posthtml([
      include(),
    ]))
    .pipe(dest('build'));
}
exports.html = html;


//Стили
function css() {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(dest('build/css'))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(sync.stream());
}

exports.css = css;

//Скрипты
function scripts() {
  return src('source/js/**/*.js')
    .pipe(dest('build/js'));
}

exports.scripts = scripts;

//Изображения
function images() {
  return src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo(),
    ]))
    .pipe(dest('source/img'));
}

exports.images = images;

//Создания изображений в формате Webp
function createWebp() {
  return src(['source/img/**/*.{png,jpg}', '!source/img/favicon/*.png'])
    .pipe(webp({quality: 90}))
    .pipe(dest('source/img'));
}

exports.createWebp = createWebp;

//Создание svg sprite
function sprite() {
  return src('source/img/{icon-*,htmlacademy*}.svg')
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite_auto.svg'))
    .pipe(dest('build/img'));
}

exports.sprite = sprite;

//Копирование файлов в папку продакшн
function copy () {
  return src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/js/**',
    'source//*.ico',
    'source/manifest.webmanifest',
  ], {
    base: 'source',
  })
    .pipe(dest('build'));
}

exports.copy = copy;

//Очистка папки build перед ее наполнением
function clean () {
  return del('build');
}

exports.clean = clean;

//Локальный сервер и watch
function server(done) {
  sync.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
  done();
}

exports.server = server;

//Отследивание изменений
function watcher() {
  watch('source/sass/**/*.{scss,sass}', series(css));
  watch('source/img/icon-*.svg', series(sprite, html, refresh));
  watch('source/*.html', series(html, refresh));
  watch('source/js/**/*.js', series(scripts, refresh));
}

//Перезагрузка сервера
function refresh(done) {
  sync.reload();
  done();
}

exports.refresh = refresh;

//npm start, npm build
exports.build = series(clean, copy, images, parallel(html, css, sprite, createWebp));
exports.start  = series(clean, copy, parallel(html, css, sprite, createWebp), series(server, watcher));
