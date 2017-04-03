// const Appointment = require('../../../models/Appointment');
const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');
const Appointment = require('../../../models/Appointment');

const nsps = globals.namespaces;

const socketIoOptions = {
  secret: globals.tokenSecret,
  timeout: 15000,
};

module.exports = function setupSyncNsp(io) {
  io.of(nsps.sync)
    .on('connection', socketIoJwt.authorize(socketIoOptions))
    .on('authenticated', (socket) => {
      const accountIdFromSocket = socket.decoded_token.activeAccountId;
      const roomName = accountIdFromSocket;

      // TODO JWT token verification
      console.log(`syncNsp connection. Joining client to roomName=${roomName}`);
      console.log('active rooms', io.sockets.adapter.rooms);
      socket.join(roomName);

      Appointment
        .filter({ accountId: accountIdFromSocket, isSyncedWithPMS: true })
        .changes({ squash: true })
        .then((feed) => {
          feed.each((error, doc) => {
            if (error) throw new Error('Feed error');

            if (doc.getOldValue() === null) {
              console.log('[ INFO ] CREATE from=sync', doc);
              io.of('/dash').in(doc.accountId).emit('add:Appointment', doc);
            } else {
              // Updated
              console.log('[ INFO ] UPDATE from=sync', doc);
              io.of('/dash').in(doc.accountId).emit('add:Appointment', doc);
            }
          });
        });
    })
    .on('unauthorized', (msg) => {
      console.err('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
};
