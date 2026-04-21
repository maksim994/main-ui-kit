const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('sass');
const gulpSass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const fileInclude = require('gulp-file-include');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const typograf = require('gulp-typograf');
const webp = require('gulp-webp');
const mainSass = gulpSass(sass);
const plumber = require('gulp-plumber');
const path = require('path');
const concat = require('gulp-concat');

// PostCSS
const postcss = require('gulp-postcss');
const sortMQ = require('postcss-sort-media-queries');
const cssnano = require('cssnano');

const rootFolder = path.basename(path.resolve());

// paths
const srcFolder = './src';
const buildFolder = './app';
const paths = {
    srcSvg: `${srcFolder}/img/svg/**/*.svg`,
    srcImgFolder: `${srcFolder}/img`,
    buildImgFolder: `${buildFolder}/assets/img`,
    srcScss: `${srcFolder}/scss/**/*.scss`,
    buildCssFolder: `${buildFolder}/assets/css`,
    srcFullJs: `${srcFolder}/js/**/*.js`,
    srcMainJs: `${srcFolder}/js/main.js`,
    buildJsFolder: `${buildFolder}/assets/js`,
    srcPartialsFolder: `${srcFolder}/partials`,
    resourcesFolder: `${srcFolder}/resources`,
    buildFontsFolder: `${buildFolder}/assets/fonts`,
};

// dev по умолчанию
let isProd = false;
const setProd = (cb) => { isProd = true; cb(); };

const sassOptions = {
    includePaths: [
        path.join(srcFolder, 'scss'),
        path.join(srcFolder, 'scss', 'base'),
    ],
};

const clean = () => del([buildFolder]);

// svg sprite
const svgSprites = () =>
    src(paths.srcSvg)
        .pipe(svgmin({ js2svg: { pretty: true } }))
        .pipe(
            cheerio({
                run: ($) => {
                    // $('[fill]').removeAttr('fill');
                    // $('[stroke]').removeAttr('stroke');
                    // $('[style]').removeAttr('style');
                },
                parserOptions: { xmlMode: true },
            })
        )
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({ mode: { stack: { sprite: '../sprite.svg' } } }))
        .pipe(dest(paths.buildImgFolder));

// styles
const styles = async () => {
    const { default: autoprefixer } = await import('gulp-autoprefixer');

    const pcPlugins = [sortMQ()];
    if (isProd) pcPlugins.push(cssnano());

    return src(paths.srcScss, { sourcemaps: !isProd })
        .pipe(plumber(
            notify.onError({ title: 'SCSS', message: 'Error: <%= error.message %>' })
        ))
        .pipe(mainSass(sassOptions))
        .pipe(autoprefixer({ cascade: false, grid: true }))
        .pipe(postcss(pcPlugins))
        .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
        .pipe(dest(paths.buildCssFolder, { sourcemaps: '.' }))
        .pipe(browserSync.stream());
};

// scripts (app)
const scripts = () =>
    src(
        [
            `${srcFolder}/js/functions/**/*.js`,
            `${srcFolder}/js/components/**/*.js`,
            `${srcFolder}/js/main.js`,
        ],
        { sourcemaps: !isProd }
    )
        .pipe(plumber(
            notify.onError({ title: 'JS', message: 'Error: <%= error.message %>' })
        ))
        .pipe(concat('main.js'))
        .pipe(dest(paths.buildJsFolder, { sourcemaps: '.' }))
        .pipe(browserSync.stream());

// vendor js
const jsVendors = () =>
    src(`${srcFolder}/js/vendor/**/*.js`, { sourcemaps: !isProd })
        .pipe(concat('vendor.js'))
        .pipe(dest(paths.buildJsFolder, { sourcemaps: '.' }))
        .pipe(browserSync.stream());

// static
const resources = () => src(`${paths.resourcesFolder}/**`).pipe(dest(buildFolder));

const resourcesFont = () =>
    src(`${paths.resourcesFolder}/fonts/**`).pipe(dest(paths.buildFontsFolder));

// images (без svg — ими занимается svgSprites)
const images = async () => {
    const { default: imagemin } = await import('gulp-imagemin');
    const { default: imageminMozjpeg } = await import('imagemin-mozjpeg');
    const { default: imageminOptipng } = await import('imagemin-optipng');

    return src([`${paths.srcImgFolder}/**/*.{jpg,jpeg,png}`])
        .pipe(gulpif(
            isProd,
            imagemin([
                imageminMozjpeg({ quality: 80, progressive: true }),
                imageminOptipng({ optimizationLevel: 2 }),
            ])
        ))
        .pipe(dest(paths.buildImgFolder));
};

// webp
const webpImages = () =>
    src([`${paths.srcImgFolder}/**/*.{jpg,jpeg,png}`])
        .pipe(webp())
        .pipe(dest(paths.buildImgFolder));

// html (без минификации)
const htmlInclude = () =>
    src([`${srcFolder}/*.html`])
        .pipe(plumber(
            notify.onError({ title: 'HTML', message: 'Error: <%= error.message %>' })
        ))
        .pipe(fileInclude({ prefix: '@', basepath: '@file' }))
        .pipe(typograf({ locale: ['ru', 'en-US'] }))
        .pipe(dest(buildFolder))
        .pipe(browserSync.stream());

const serve = () => {
    browserSync.init({
        server: { baseDir: buildFolder },
        notify: false,
        open: false,
    });

    watch(paths.srcScss, styles);
    watch(paths.srcFullJs, series(jsVendors, scripts));
    watch(`${paths.srcPartialsFolder}/**/*.html`, htmlInclude);
    watch(`${srcFolder}/*.html`, htmlInclude);
    watch(`${paths.resourcesFolder}/fonts/**`, resourcesFont);
    watch(`${paths.resourcesFolder}/**`, resources);
    watch([`${paths.srcImgFolder}/**/*.{jpg,jpeg,png}`], series(images, webpImages));
    watch(paths.srcSvg, svgSprites);
};

// экспорт задач
exports.clean = clean;
exports.svg = svgSprites;
exports.styles = styles;
exports.scripts = scripts;
exports.vendors = jsVendors;
exports.images = images;
exports.webp = webpImages;
exports.html = htmlInclude;
exports.resources = resources;
exports.resourcesFont = resourcesFont;

// dev
exports.default = series(
    clean,
    parallel(htmlInclude, jsVendors, scripts, styles, resources, resourcesFont, images, webpImages, svgSprites),
    serve
);

// build (с прод-режимом)
exports.build = series(
    clean,
    setProd,
    parallel(htmlInclude, jsVendors, scripts, styles, resources, resourcesFont, images, webpImages, svgSprites)
);
