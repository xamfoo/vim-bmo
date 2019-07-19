export const builder = yargs => yargs
  .command(
    'start',
    'Start server',
    yargs => yargs
      .option('host', {
        describe: 'Host name for server',
        type: 'string',
        default: 'localhost'
      })
      .option('port', {
        describe: 'Port for server',
        type: 'number'
      }),
    argv => require('./start').default(argv)
  )
  .command('stop', 'Stop server', () => {}, argv => require('./stop').default(argv))
  .demandCommand()
  .recommendCommands()
  .strict();

export const handler = () => {};
