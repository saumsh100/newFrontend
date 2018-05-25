
import io from 'socket.io-client';
import { getSocketUrl } from '../util/hub';

// const URL = 'http://localhost:5000';

// IMPORTANT because the app is served via iframe do not need to connect by URL
const socket = io.connect(`${getSocketUrl()}/dash`);

export default socket;
