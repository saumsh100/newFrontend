
const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');

function setupSyncNamespace(io) {
  const sync = io.of(namespaces.sync);
  return authenticate(sync, (socket) => {
    const { activeAccountId } = socket.decoded_token;
    socket.join(activeAccountId);
  });
}

module.exports = setupSyncNamespace;
