"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const newer = require("gulp-newer");
const imagemin = require("gulp-imagemin");

// Clean
function clean() {
  return del(["./build/"]);
}

// Optimize Images
function images() {
  return gulp
    .src("./src/images/**/*")
    .pipe(newer("./build/images"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./build/images"));
}

// Copy html
function html() {
  return gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./build/"));
}

// Copy static
function copyStatic() {
  return gulp
    .src("./src/static/*.*")
    .pipe(gulp.dest("./build/static/"));
}

// CSS task
function css() {
  return gulp
    .src("./src/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("./build/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./build/"));
}

// Watch files
function watchFiles() {
  gulp.watch("./src/styles/*.scss", css);
  gulp.watch("./src/*.html", html);
  gulp.watch("./images/**/*", images);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(html, css, images, copyStatic));
const watch = gulp.parallel(watchFiles);

// export tasks
exports.default = build;
exports.watch = watch;