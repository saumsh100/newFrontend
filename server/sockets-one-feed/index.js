const Server = require('socket.io');
const setupDashNsp = require('./namespaces/dash');
const setupSyncNsp = require('./namespaces/sync');
const sharedChangeFeeds = require('./sharedChangeFeeds');

module.exports = function (server) {
  const io = new Server(server);

  const syncNsp = setupSyncNsp(io);
  const dashNsp = setupDashNsp(io);

  sharedChangeFeeds(syncNsp, dashNsp);
};
