const Server = require('socket.io');
const setupDashNsp = require('./namespaces/dash');
const setupSyncNsp = require('./namespaces/sync');
const sharedChangeFeeds = require('./sharedChangeFeeds');

module.exports = function (server) {
  const io = new Server(server);

  console.log('1 creating sync namespace; counter=');
  const syncNsp = setupSyncNsp(io);
  console.log('3 creating dash namespace');
  const dashNsp = setupDashNsp(io);

  console.log('5 Created SocketIO namespaces.');
  sharedChangeFeeds(syncNsp, dashNsp);
  console.log('6 Created shared change feeds');
};
