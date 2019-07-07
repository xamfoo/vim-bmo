import execa from 'execa';
import fs from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';
import tmp from 'tmp';
import * as vim from '../src/lib';

describe('vim', () => {
  const PKG_DIR = pkgDir.sync();

  const setup = async (optionsOrCallback = {}, callback) => {
    const opts = typeof optionsOrCallback === 'function'
      ? {}
      : optionsOrCallback;

    const cb = typeof optionsOrCallback === 'function'
      ? optionsOrCallback
      : cb;

    const vimrc = tmp.fileSync({ dir: PKG_DIR });

    try {
      const vimrcContent = `
        set runtimepath^=${PKG_DIR} runtimepath+=${PKG_DIR}/after
        let &packpath = &runtimepath
        call vimjs#start({ 'bin': '${path.join(PKG_DIR, 'bin', 'vimjs.js')}' })
      `;
      fs.writeFileSync(vimrc.fd, vimrcContent, 'utf8');
      await execa('vim', [
        '-nNesc',
        'let&verbose=1|let&viminfo=""|source%|echo""|qall!',
        vimrc.name
      ]).catch(console.error)
        .then(console.log);
      cb();
    } catch (e) {
      vimrc.removeCallback();
      throw e;
    }
  };

  it('test setup', () => setup(() => {
    expect(true).toBe(false);
    // await new Promise((resolve, reject) => {
    //   tmp.file({ dir: pkgDir.sync() }, (err, path, _, cleanup) => {
    //     if (err) reject(err);
       
    //     console.log('File: ', path);
    //     resolve();
    //     // cleanup();
    //   });
    // });
  }));
});
