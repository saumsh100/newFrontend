

const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
const runSyncClientFeeds = require('../../../feeds/runSyncClientFeeds');

function setupSyncNamespace(io) {
  const sync = io.of(namespaces.sync);
  return authenticate(sync, (socket) => {
    // No need to join rooms, changeFeed acts as the foom
    // socket.join(activeAccountId);
    runSyncClientFeeds(socket);
  });
}

module.exports = setupSyncNamespace;
