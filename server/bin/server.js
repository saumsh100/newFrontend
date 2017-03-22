
const http = require('http');
const globals = require('../config/globals');
const app = require('./app');
const setupSocketIO = require('./sockets');

const server = http.createServer(app);

setupSocketIO(server);

server.listen(globals.port, () => {
  console.log(`CareCru HTTP Server is running on port ${globals.port}`);
});
