import fs from 'fs';
import path from 'path';
import process from 'process';

const STATE_FILE_NAME = '.vim-bmo';
const { HOME } = process.env;

export const read = () => new Promise((resolve, reject) => {
  fs.readFile(path.join(HOME, STATE_FILE_NAME), 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      reject(err);
    }
    else {
      resolve(data ? JSON.parse(data) : {});
    }
  });
});

export const write = state => new Promise((resolve, reject) => {
  fs.writeFile(
    path.join(HOME, STATE_FILE_NAME),
    JSON.stringify(state),
    'utf8',
    (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    }
  );
});
