

const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
// const runSyncClientFeeds = require('../../../feeds/runSyncClientFeeds');

function setupSyncNamespace(io) {
  const sync = io.of(namespaces.sync);
  return authenticate(sync, (socket) => {
    // runSyncClientFeeds(socket);

    const { activeAccountId } = socket.decoded_token;
    socket.join(activeAccountId);
  });
}

module.exports = setupSyncNamespace;
