/// <binding ProjectOpened='_watch, _bowerCopy' />
var gulp = require('gulp'),
    fs = require("fs"),
    del = require("del"),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    lzmajs = require('gulp-lzmajs');

// configuration --------------------------------------------------
var initPath = function () {
    eval("var pathData = " + String(fs.readFileSync("./bundle.json")));

    var filePath = {};
    var paths = {};

    var p = {
        file: {},
        watch: {}
    };

    // init regex for replacing path patterns
    var createRegs = function (patterns) {
        var regs = {};
        for (var pathName in patterns)
            regs[pathName] = new RegExp('#' + pathName + '#', 'gi');
        return regs;
    };

    // replace all path pattern
    var replacePath = function (data, regs, patterns) {
        for (var pathName in regs) {
            data = data.replace(regs[pathName], patterns[pathName]);
        }
        return data;
    };

    for (var group in pathData.bundle) {
        p.file[group] = {};
        p.watch[group] = [];
        var patterns = pathData.path[group],
            bundles = pathData.bundle[group],
            regs = createRegs(patterns);
        for (var bundleName in bundles) {
            // replace patterns in bundle value
            if (typeof bundles[bundleName] == 'string') {
                bundles[bundleName] = replacePath(bundles[bundleName], regs, patterns);
                p.watch[group].push(bundles[bundleName]);
            } else {
                for (var i = 0, l = bundles[bundleName].length; i < l; i++) {
                    bundles[bundleName][i] = replacePath(bundles[bundleName][i], regs, patterns);
                    p.watch[group].push(bundles[bundleName][i]);
                }
            }

            // replace patterns in bundle name
            var idx = bundleName.lastIndexOf('/');
            var bundleName_dest = '/';
            var bundleName_file = bundleName;
            if (idx < 0) {
                bundleName_dest = '/';
                bundleName_file = bundleName;
            } else {
                bundleName_dest = bundleName.substring(0, idx + 1);
                bundleName_file = bundleName.substring(idx + 1);
            }

            bundleName_dest = replacePath(bundleName_dest, regs, patterns);
            if (!(bundleName_dest in p.file[group])) p.file[group][bundleName_dest] = {};
            p.file[group][bundleName_dest][bundleName_file] = pathData.bundle[group][bundleName];
        }
    }

    return p;
};
var p = initPath();

var filePath = p.file;
var watchPath = p.watch;


// task --------------------------------------------------
// copy lib from bower to www-root
gulp.task("_bowerCopy", ['_bowerClear'], function (cb) {
    // bower
    var f = filePath.bower;
    for (var dest in f) {
        for (var pkg in f[dest]) {
            gulp.src(f[dest][pkg])
              .pipe(gulp.dest(dest));
        }
    }
    cb(null);
});

// Clean task
gulp.task('_bowerClear', function (cb) {
    var f = filePath.bower;
    var clearDest = [];
    for (var dest in f) clearDest.push(dest + "*");
    del(clearDest);
    cb(null);
});

// watch modifying of less files
gulp.task('_watch', function () {
    gulp.start('less');
    gulp.start('js');
    var lessWatcher = watch(watchPath.less, function () {
        gulp.start('less');
    });
    var jsWatcher = watch(watchPath.js, function () {
        gulp.start('js');
    });
    watch("bundle.json", function () {
        var p = initPath();

        filePath = p.file;
        watchPath = p.watch;
        gulp.start('less');
        gulp.start('js');

        lessWatcher.close();
        jsWatcher.close();

        lessWatcher = watch(watchPath.less, function () {
            gulp.start('less');
        });
        jsWatcher = watch(watchPath.js, function () {
            gulp.start('js');
        });
    });
});


// .............................. Handle style file
// transfrom less to css file
// combine multiple files
gulp.task('less', function () {
    var f = filePath.less;
    for (var dest in f) {
        for (var bundle in f[dest]) {
            gulp.src(f[dest][bundle])
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(less())
                .pipe(concat(bundle + '.css'))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(dest));
        }
    }
});
// .............................. Handle js file
// combine & minimize js file
gulp.task('js', function () {
    var f = filePath.js;
    for (var dest in f) {
        for (var bundle in f[dest]) {
            gulp.src(f[dest][bundle])
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(concat(bundle + '.js'))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(dest));

            gulp.src(f[dest][bundle])
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(concat(bundle + '.min.js'))
                .pipe(uglify())
                .pipe(lzmajs())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(dest));
        }
    }
});
