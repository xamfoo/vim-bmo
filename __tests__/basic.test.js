import execa from 'execa';
import fs from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';
import tmp from 'tmp';

const fnBody = (fn) =>
  fn.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];

describe('vim', () => {
  const PKG_DIR = pkgDir.sync();
  const TMP_DIR = path.join(PKG_DIR, 'tmp');

  const setup = async (optionsOrCallback = {}, callback) => {
    const opts = typeof optionsOrCallback === 'function'
      ? {}
      : optionsOrCallback;

    const cb = typeof optionsOrCallback === 'function'
      ? optionsOrCallback
      : cb;

    try {
      fs.mkdirSync(TMP_DIR);
    } catch (e) {
    }
    const vimrc = tmp.fileSync({ dir: TMP_DIR });
    const vimrcJs = tmp.fileSync({ dir: TMP_DIR });

    try {
      const vimrcJsContent = fnBody(() => {
        module.exports = function (vim) {
          vim.cmd.execute('echo "hello"');
        };
      });
      fs.writeFileSync(vimrcJs.fd, vimrcJsContent, 'utf8');

      const vimrcContent = `
        execute system('${path.join(PKG_DIR, 'bin', 'vimjs.js')} ${vimrcJs.name}')
      `;
      fs.writeFileSync(vimrc.fd, vimrcContent, 'utf8');

      await execa('vim', [
        '-nNesc',
        'let&verbose=1|let&viminfo=""|source%|echo""|qall!',
        vimrc.name
      ]).catch(console.error).then(console.log);
      cb();
    } catch (e) {
      vimrc.removeCallback();
      vimrcJs.removeCallback();
      throw e;
    }
  };

  it('test setup', () => setup(() => {
    expect(true).toBe(false);
  }));
});
