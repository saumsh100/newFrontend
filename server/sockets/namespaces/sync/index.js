// const Appointment = require('../../../models/Appointment');
const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');
const sharedChangeFeeds = require('../../sharedChangeFeeds');

const nsps = globals.namespaces;

const socketIoOptions = {
  secret: globals.tokenSecret,
  timeout: 15000,
};

module.exports = function setupSyncNsp(io) {
  const syncNsp = io.of(nsps.sync);
  syncNsp
    .on('connection', socketIoJwt.authorize(socketIoOptions))
    .on('authenticated', (socket) => {
      const accountIdFromSocket = socket.decoded_token.activeAccountId;
      const roomName = accountIdFromSocket;

      // TODO JWT token verification
      console.log(`syncNsp connection. Joining client to roomName=${roomName}`);
      console.log('active rooms', io.sockets.adapter.rooms);
      socket.join(roomName);

      // true means that this change feed will send to the dashboard only
      // const isSyncedWithPMS = true;
      // sharedChangeFeeds(io.of(nsps.dash), accountIdFromSocket, isSyncedWithPMS, 'SyncNsp');
    })
    .on('unauthorized', (msg) => {
      console.err('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
  console.log('2 setupSyncNsp: done configuring callbacks');
  return syncNsp;
};
