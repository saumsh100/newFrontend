
import io from 'socket.io-client'; // eslint-disable-line import/no-extraneous-dependencies
import { getSocketUrl } from '../util/hub';

// IMPORTANT because the app is served via iframe do not need to connect by URL
class Socket {
  constructor() {
    this.socket = null;
    this.connect();
  }

  connect() {
    this.socket = io.connect(`${getSocketUrl()}/dash`, { transports: ['websocket'] });

    this.socket.on('reconnect_attempt', () => {
      this.socket.io.opts.transports = ['polling', 'websocket'];
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  reconnect() {
    this.disconnect();
    this.connect();
  }
}

export const socketInstance = new Socket();
export default socketInstance.socket;
