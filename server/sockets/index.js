const Server = require('socket.io');
const setupDashNsp = require('./namespaces/dash');

module.exports = function (server) {
  const io = new Server(server);
  setupDashNsp(io);
};
