var argv = require('minimist')(process.argv.slice(2)),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    scsslint = require('gulp-scss-lint'),
    cache = require('gulp-cached'),
    prefix = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    minifyHTML = require('gulp-minify-html'),
    size = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    plumber = require('gulp-plumber'),
    deploy = require('gulp-gh-pages'),
    notify = require('gulp-notify');

var Config = {
    cache: (typeof argv.cache !== 'undefined' ? !! argv.cache : false),
    imagemin: {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    },
    paths: {
        app: {
            root: 'app',
            js: 'app/js',
            scss: 'app/scss',
            css: 'app/css',
            img: 'app/img',
            lib: 'app/lib',
            extra: [
                //'app/foo/**/*',
                //'app/bar/**/*'
            ]
        },
        build: {
            root: 'dist',
            js: 'dist/js',
            css: 'dist/css',
            img: 'dist/img',
            lib: 'dist/lib',
            extra: [
                //'dist/foo/',
                //'dist/bar/'
            ]
        }
    }
}

gulp.task('scss', function() {
    var onError = function(err) {
        notify.onError({
            title: "Gulp",
            subtitle: "Failure!",
            message: "Error: <%= error.message %>",
            sound: "Beep"
        })(err);
        this.emit('end');
    };

    return gulp.src(Config.paths.app.scss + '/index.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        .pipe(prefix())
        .pipe(rename('main.css'))
        .pipe(gulp.dest(Config.paths.app.css))
        .pipe(reload({
            stream: true
        }))
        .pipe(cssmin())
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(Config.paths.build.css))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: Config.paths.build.root + '/'
        }
    });
});

gulp.task('deploy', function() {
    return gulp.src(Config.paths.build.root + '/**/*')
        .pipe(deploy());
});

gulp.task('js', function() {
    gulp.src(Config.paths.app.js + '/*.js')
        .pipe(uglify())
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        .pipe(concat('j.js'))
        .pipe(gulp.dest(Config.paths.build.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('scss-lint', function() {
    gulp.src(Config.paths.app.scss + '/**/*.scss')
        .pipe(cache('scsslint'))
        .pipe(scsslint());
});

gulp.task('minify-html', function() {
    var opts = {
        comments: true,
        spare: true
    };

    gulp.src(Config.paths.app.root + '/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(Config.paths.build.root + '/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('jshint', function() {
    gulp.src(Config.paths.build.js + '/j.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(Config.paths.app.scss + '/**/*.scss', ['scss']);
    gulp.watch(Config.paths.app.js + '/*.js', ['jshint', 'js']);
    gulp.watch(Config.paths.app.img + '/*', ['imgmin']);
    gulp.watch(Config.paths.app.root + '/*.html', ['minify-html']);
});

gulp.task('imgmin', function() {
    return gulp.src(Config.paths.app.img + '/*')
        .pipe(imagemin(Config.imagemin))
        .pipe(gulp.dest(Config.paths.build.img));
});

gulp.task('default', ['browser-sync', 'js', 'imgmin', 'minify-html', 'scss', 'watch']);
