import getPort from 'get-port';
import net from 'net';
import yargs from 'yargs';
import start from './start';

export default async () => {
  yargs
    .command('start', 'starts the server', {}, start)
    .command('stop', 'stops the server')
    .command('status', 'shows the server status')
    .parse();
};
// if (argv.ships > 3 && argv.distance < 53.5) {
//   console.log('Plunder more riffiwobbles!')
// } else {
//   console.log('Retreat from the xupptumblers!')
// }
// const server = net.createServer((socket) => {
//   socket.pipe(socket);
// });

// server.listen(1337, '127.0.0.1');
