import rabbitjs from 'rabbit.js';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import schema from 'CareCruGraphQL/data/schema';

const http = require('http');

const globals = require('../config/globals');
const app = require('./app');
const createSocketIOServer = require('../sockets/createSocketServer');
const bindSocketHandlers = require('../sockets');

// Set up pub in routes for pub subs
const context = rabbitjs.createContext(globals.rabbit);

const pub = context.socket('PUB', { routing: 'topic' });
pub.connect('events');

// Socket.io needs a NodeJS HTTP server
const server = http.createServer(app);

// Pass in server so socket.io can bind necessary paths to it
const io = createSocketIOServer(server);

// TODO: For the love of god remove this...
global.io = io;

// Setup socket connections and event handlers
bindSocketHandlers(io);

app.set('socketio', io);
app.set('pub', pub);

// Bind to supplied port
server.listen(globals.port, () => {
  console.log(`CareCru HTTP Server is running on port ${globals.port}`);

  new SubscriptionServer({
    execute,
    subscribe,
    schema,
    onConnect: params => params,
  }, {
    server,
    path: '/subscriptions',
  });
});
