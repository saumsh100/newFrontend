
import io from 'socket.io-client';

// const URL = 'http://localhost:5000';

// IMPORTANT because the app is served via iframe do not need to connect by URL

const socket = io.connect('/dash');

export default socket;
