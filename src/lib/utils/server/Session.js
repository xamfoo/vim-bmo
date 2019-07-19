import { safeJsonParse } from './message';

export default class Session {
  constructor({ connection }) {
    this.connection = connection;
    connection.on('data', this.handleData.bind(this));
  }

  handleData(data) {
    const msg = safeJsonParse(data) || {};

    switch (msg.type) {
      case 'ping':
        this.connection.write(JSON.stringify({
          type: 'pong',
          ...(msg.seq == null ? {} : { seq: msg.seq + 1 }),
        }));
        break;
      default:
    }
  }
}
