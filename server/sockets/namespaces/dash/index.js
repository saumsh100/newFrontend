

const authenticate = require('../authenticate');
const { namespaces } = require('../../../config/globals');
const runDashboardFeeds = require('../../../feeds/runDashboardFeeds');
const twilio = require('../../../config/globals').twilio;
const twilioClient = require('../../../config/twilio');
const Chat = require('../../../models/Chat');
const TextMessage = require('../../../models/TextMessage');
const normalize = require('../../../routes/api/normalize');


function setupDashboardNamespace(io) {
  const dash = io.of(namespaces.dash);
  return authenticate(dash, (socket) => {
    console.log('socket authenticated!');
    runDashboardFeeds(socket);

    socket.on('room', (room) => {
      socket.join(room.id);
    });
  });
}

module.exports = setupDashboardNamespace;
