export const builder = yargs => yargs
  .positional('file', {
    describe: 'Configuration file',
    type: 'string'
  })
  .option('host', {
    describe: 'Host name for server',
    type: 'string',
    default: 'localhost'
  })
  .option('port', {
    describe: 'Port for server',
    type: 'number'
  })
  .option('start', {
    describe: 'Should start server with given host and port if needed',
    type: 'boolean',
    default: true,
  });

export const handler = argv => require('./handler').default(argv);
