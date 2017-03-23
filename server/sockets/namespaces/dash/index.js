const socketIoJwt = require('socketio-jwt');
const globals = require('../../../config/globals');


module.exports = function setupDashNsp(io) {
  const dashNsp = io.of('/dash');

  dashNsp
    .on('connection', socketIoJwt.authorize({
      secret: globals.tokenSecret,
      //timeout: 15000,
    }))
    .on('authenticated', (socket) => {
      const roomName = socket.decoded_token.activeAccountId;
      console.log(`dashNsp connection. roomName=${roomName}`);
      
      socket.join(roomName);
      console.log('active rooms', io.sockets.adapter.rooms);
      console.log(`Opening room: ${roomName}`);
      socket.to(roomName).emit('newJoin', 'dash board joined');

      socket.on('sendToRoom', (data) => {
        const room = io.nsps['/dash'].adapter.rooms[roomName];
        console.log('clients in this room: ', room.length);
        console.log(`Sending to all in the room ${roomName}: data=${data.msg}`);

        io.nsps['/dash'].in(roomName).emit('roomMessage', `${data.msg} ${roomName}`);
      });
    })
    .on('unauthorized', (socket) => {
      console.log('ERR unauth');
    });
  return dashNsp;
};
