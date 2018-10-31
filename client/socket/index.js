
import io from 'socket.io-client';
import { getSocketUrl } from '../util/hub';

// const URL = 'http://localhost:5000';

// IMPORTANT because the app is served via iframe do not need to connect by URL
class Socket {
  constructor() {
    this.socket = null;
    this.connect();
  }

  connect() {
    this.socket = io.connect(`${getSocketUrl()}/dash`);
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
