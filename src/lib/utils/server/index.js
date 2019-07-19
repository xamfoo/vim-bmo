import { fork } from 'child_process';
import execa from 'execa';
import net from 'net';
import getPort from 'get-port';
import path from 'path';
import * as stateFile from '../stateFile';
import Session from './Session';
import { safeJsonParse } from './message';

const Status = {
  UP: 'UP',
  DOWN: 'DOWN',
  ERROR: 'ERROR',
};

const randomSeq = () => Math.floor(Math.random() * 4294967296);

export const status = (address) => new Promise((resolve, reject) => {
  const client = new net.Socket();
  const seq = randomSeq();

  client
    .on('error', () => {
      client.destroy();
      resolve(Status.DOWN);
    })
    .on('data', (data) => {
      client.destroy();
      const msg = safeJsonParse(data) || {};
      resolve(
        msg.type === 'pong' && msg.seq === seq + 1
          ? Status.UP
          : Status.ERROR
      );
    })
    .on('close', () => {
      client.destroy();
      resolve(Status.ERROR);
    })
    .connect(address, () => {
      client.write(JSON.stringify({ type: 'ping', seq }));
    });
});

// Returns an object if there are errors. Returns null if valid.
const validateAddress = ({ host, port } = {}) => {
  const errors = {
    ...(!host ? { host: `Missing host ${host}.` } : {}),
    ...(!port || port > -1 ? {} : { port: `Invalid port ${port}.` }),
  };
  return Object.keys(errors).length ? errors : null;
};

const throwInvalidAddress = (address) => {
  const errors = validateAddress(address);
  if (errors) {
    throw new Error(`Invalid address: ${Object.values(errors)}`);
  }
};

// Try to find and reuse an existing server given an address else returns null
const getExistingServer = async (address) => {
  if ((await status(address)) === Status.UP) {
    return address;
  }

  if (!address.port) {
    const state = await stateFile.read();
    if (address.host === state.host && (await status(state)) === Status.UP) {
      return state;
    }
  }

  return null;
};

export const start = async (address) => {
  throwInvalidAddress(address);

  const serverProcess = fork(
    path.join(__dirname, 'startForeground.js'),
    [JSON.stringify(address)],
    { detached: true }
  );

  return new Promise((resolve, reject) => {
    serverProcess.on('error', reject);
    serverProcess.on('message', (m) => {
      const { host, port } = m || {};

      if (host && port) {
        resolve({ host, port });
        serverProcess.disconnect();
        serverProcess.unref();
      }
    });
  });
};

export const startForeground = async (address) => {
  throwInvalidAddress(address);

  const existingAddress = await getExistingServer(address);
  if (existingAddress) return existingAddress;

  const server = net.createServer((connection) => {
    new Session({ connection });
  });

  if (!address.port) {
    let errorCallback;
    server.on('error', error => errorCallback(error));

    while (true) {
      const result = await new Promise(async (resolve, reject) => {
        errorCallback = (error) => {
          if (error.code === 'EADDRINUSE') {
            server.close(resolve);
          }
          else {
            reject(error);
          }
        };

        const newAddress = { ...address, port: await getPort() };
        server.listen(newAddress, async () => {
          await stateFile.write(newAddress);
          resolve(newAddress);
        });
      });

      if (result) {
        return result;
      }
    }
  }

  await new Promise(resolve => server.listen(address, resolve));
  await stateFile.write(address);
  return address;
};
