
const http = require('http');
const globals = require('../config/globals');
const app = require('./app');
const createSocketIOServer = require('../sockets/createSocketServer');
const bindSocketHandlers = require('../sockets');
const runChangeFeeds = require('../feeds');

// Socket.io needs a NodeJS HTTP server
const server = http.createServer(app);

// Pass in server so socket.io can bind necessary paths to it
const io = createSocketIOServer(server);

// Setup socket connections and event handlers
bindSocketHandlers(io);

// Run RethinkDB changeFeeds that emit to namespaces/rooms/etc.
runChangeFeeds(io);

// Bind to supplied port
server.listen(globals.port, () => {
  console.log(`CareCru HTTP Server is running on port ${globals.port}`);
});
