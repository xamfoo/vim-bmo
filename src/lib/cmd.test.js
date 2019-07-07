import { VIM_COMMAND } from './actionTypes';
import { execute } from './cmd';

describe('execute', () => {
  it('returns command action without options', () => {
    const command= 'command';

    expect(execute(command)).toEqual({
      type: VIM_COMMAND,
      payload: {
        command,
        options: {
          silent: undefined
        },
      }
    });
  });

  it('throws an error when command is invalid', () => {
    expect(() => execute()).toThrow('command');
  });

  it('throws an error when silent option is invalid', () => {
    expect(() => execute('', { silent: 'silent' })).toThrow('silent');
  });
});
