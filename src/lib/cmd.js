import { VIM_COMMAND } from './actionTypes';

export const execute = (command, options = {}) => {
  if (typeof command !== 'string') {
    throw new Error('command should be a string');
  }

  if (options.silent != null && typeof options.silent !== 'boolean') {
    throw new Error('silent should be a boolean');
  }

  return {
    type: VIM_COMMAND,
    payload: {
      command,
      options: {
        silent: options.silent,
      },
    }
  };
}
