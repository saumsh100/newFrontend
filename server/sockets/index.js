
const setupDashNamespace = require('./namespaces/dash');
const setupSyncNamespace = require('./namespaces/sync');

module.exports = function (io) {
  const syncNsp = setupSyncNamespace(io);
  const dashNsp = setupDashNamespace(io);
};
