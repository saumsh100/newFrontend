
import http from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import url from 'url';
import schema from 'CareCruGraphQL/data/schema';
import app from './app';
import globals from '../config/globals';
import createSocketIOServer from '../sockets/createSocketServer';
import bindSocketHandlers from '../sockets';


// Socket.io needs a NodeJS HTTP server
const server = http.createServer(app);

// Pass in server so socket.io can bind necessary paths to it
const io = createSocketIOServer(server);
global.io = io;

// Setup socket connections and event handlers
bindSocketHandlers(io);

app.set('socketio', io);

// Bind to supplied port
server.listen(globals.port, () => {
  console.log(`CareCru HTTP Server is running on port ${globals.port}`);
  const subscriptionServer = SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
      onConnect: params => params,
    },
    {
      path: '/subscriptions',
      noServer: true,
    },
  );

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url);

    if (pathname === '/subscriptions') {
      subscriptionServer.wsServer.handleUpgrade(request, socket, head, (ws) => {
        subscriptionServer.wsServer.emit('connection', ws, request);
      });
    }
  });
});
