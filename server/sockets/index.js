const Server = require('socket.io');
const setupDashNsp = require('./namespaces/dash');
const setupSyncNsp = require('./namespaces/sync');

module.exports = function (server) {
  const io = new Server(server);
  setupDashNsp(io);
  setupSyncNsp(io);
};
