
const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
// const runDashboardFeeds = require('../../../feeds/runDashboardFeeds');

function setupDashboardNamespace(io) {
  const dash = io.of(namespaces.dash);
  return authenticate(dash, (socket) => {
    // runDashboardFeeds(socket);

    const { activeAccountId } = socket.decoded_token;
    socket.join(activeAccountId);
  });
}

module.exports = setupDashboardNamespace;
