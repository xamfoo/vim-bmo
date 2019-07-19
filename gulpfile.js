'use strict';

const commandExists = require('command-exists');
const exitHook = require('exit-hook');
const log = require('fancy-log');
const { dest, parallel, series, src } = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const rimraf = require('rimraf');
const sane = require('sane');
const execa = require('execa');

const LIB_DIR = './lib';
const TMP_DIR = './tmp';
const WATCHMAN = !!commandExists.sync('watchman');

function clean(cb) {
  rimraf(LIB_DIR, () => {
    rimraf(TMP_DIR, cb);
  });
}

function build() {
  if (build.count > 1) {
    return build.progress;
  }

  build.count += 1;
  build.progress = build.progress
    .catch(() => {})
    .then(() => new Promise((resolve, reject) => {
      src('src/**/*.js', { ignore: '**/*.test.js' })
        .pipe(sourcemaps.init())
        .pipe(babel().on('error', err => {
          log.error(err.message);
          build.count -= 1;
          reject(err);
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(LIB_DIR))
        .on('end', () => {
          build.count -= 1;
          resolve();
        });
    }));

  return build.progress;
};
Object.assign(build, { progress: Promise.resolve(), count: 0 });

function buildWatch(cb) {
  let fullBuildDone = false;
  const fullBuild = () => fullBuildDone
    ? Promise.resolve()
    : build().then(() => {
      log.info(`Build completed: ${LIB_DIR}`);
      fullBuildDone = true;
    }).catch(() => {
      log.warn(`Incomplete build: ${LIB_DIR}\nPlease fix errors above to complete build: ${LIB_DIR}`);
    });

  return new Promise(() => {
    fullBuild().then(() => {
      const watcher = sane('src', {
        glob: ['**/*.js'],
        ignored: ['**/*.test.js'],
        watchman: WATCHMAN,
      });

      exitHook(() => {;
        watcher.close();
        cb();
      });

      const onChangeOrAdd = (filePath, root, _stat) => {
        if (!fullBuildDone) {
          fullBuild();
          return;
        }

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
  });
}

exports.start = series(clean, buildWatch);
exports.build = series(clean, build);
