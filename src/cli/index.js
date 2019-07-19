import yargs from 'yargs';
import * as init from './init';
import * as server from './server';

export default async () => {
  yargs
    .command(['$0', 'init'], 'Generate vimscript for initialization', init)
    .command('server', 'Server commands', server)
    .demandCommand()
    .recommendCommands()
    .strict()
    .parse();
};
