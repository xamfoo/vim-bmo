'use strict';

const exitHook = require('exit-hook');
const log = require('fancy-log');
const { dest, parallel, series, src } = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const rimraf = require('rimraf');
const sane = require('sane');

const LIB_DIR = './lib';

function clean(cb) {
  rimraf(LIB_DIR, cb);
}

function build(cb) {
  return src('src/**/*.js', { ignore: '**/*.test.js' })
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(dest(LIB_DIR));
}

function buildWatch(cb) {
  return new Promise(() => {
    const watcher = sane('src', {
      glob: ['**/*.js'],
      watchman: true,
    });

    exitHook(() => {
      watcher.close();
      cb();
    });

    const onChangeOrAdd = (filePath, root, _stat) => {
      const errors = [];
      src(path.join(root, filePath), { base: root })
        .pipe(sourcemaps.init())
        .pipe(babel().on('error', e => errors.push(e)))
        .pipe(sourcemaps.write())
        .pipe(dest(LIB_DIR))
        .on('end', () => {
          if (errors.length) {
            errors.forEach(e => log.error(e.message));
          }
          else {
            log.info('Compiled:', path.join(LIB_DIR, filePath));
          }
        });
    };

    watcher.on('ready', () => { log.info('Watching...') });
    watcher.on('change', onChangeOrAdd);
    watcher.on('add', onChangeOrAdd);
    watcher.on('delete', (filePath, root) => {
      const libFilePath = path.join(LIB_DIR, filePath);

      rimraf(libFilePath, () => {
        log.info('Deleted:', libFilePath);
      });
    });
  });
}

exports.build = series(clean, build);
exports.watch = series(clean, build, buildWatch);
