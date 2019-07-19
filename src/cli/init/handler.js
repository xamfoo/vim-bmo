import execa from 'execa';
import fs from 'fs';
import path from 'path';
import uuidv1 from 'uuid/v1';
import net from 'net';
import * as server from '../../lib/utils/server';

const getServerConfig = async ({ host, port, start }) => {
  if (!start) {
    if (server.isValidPort(port)) {
      return { host, port };
    }
    throw Error(`Invalid port: ${port}`);
  }

  return await server.start({ host, port });
};

export default async (argv) => {
  const serverConfig = await getServerConfig({
    host: argv.host,
    port: argv.port,
    start: argv.start,
  });
  console.log('serverConfig', serverConfig);

  const vimClientId = uuidv1();
  console.log(`echo ${JSON.stringify(argv)}`);
};
