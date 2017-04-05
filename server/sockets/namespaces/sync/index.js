// const Appointment = require('../../../models/Appointment');
const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');
const Appointment = require('../../../models/Appointment');
const normalize = require('../../../routes/api/normalize');

const nsps = globals.namespaces;

const socketIoOptions = {
  secret: globals.tokenSecret,
  timeout: 15000,
};

module.exports = function setupSyncNsp(io) {
  let cursor = null;
  io.of(nsps.sync)
    .on('connection', socketIoJwt.authorize(socketIoOptions))
    .on('authenticated', (socket) => {
      const accountIdFromSocket = socket.decoded_token.activeAccountId;
      const roomName = accountIdFromSocket;

      // TODO JWT token verification
      console.log(`syncNsp connection. Joining client to roomName=${roomName}`);
      console.log('active rooms', JSON.stringify(io.sockets.adapter.rooms));
      socket.join(roomName);

      Appointment
        .filter({ accountId: accountIdFromSocket, isSyncedWithPMS: false })
        .changes({ squash: true })
        .then((feed) => {
          cursor = feed;
          feed.each((error, doc) => {
            if (error) throw new Error('Feed error');

            // close rethinkdb change feed on socket disconnect, not on namespace disconnect
            socket.on('disconnect', () => {
              console.log('[ INFO ] SIO DISCONNECT. Closing feed.');
              feed.close();
            });

            if (doc.getOldValue() === null) {
              console.log('[ INFO ] CREATE | from=sync; socketId=', socket.id);
              // io.of('/sync').in(doc.accountId).emit('add:Appointment', normalize('appointment', doc));
              socket.emit('add:Appointment', normalize('appointment', doc));
            } else {
              // Updated
              console.log('[ INFO ] UPDATE | from=sync; socketId=', socket.id);
              // io.of('/sync').in(doc.accountId).emit('update:Appointment', normalize('appointment', doc));
              // socket.emit('update:Appointment', normalize('appointment', doc));
            }
          });
        });
    })
    .on('unauthorized', (msg) => {
      console.err('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
    // .on('disconnect', () => {
    //   console.log('[ INFO ] SIO DISCONNECT. Closing feed.');
    //   cursor.close();
    // });
};
