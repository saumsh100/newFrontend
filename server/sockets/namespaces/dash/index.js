
module.exports = function setupDashNsp(io) {
  const dashNsp = io.of('/dash');

  dashNsp.on('connection', (socket) => {
    console.log('dashNsp connection');

    // Message format is JSON
    // roomName is accountId
    // TODO get account id from JWT instead
    socket.on('openRoom', (data) => {
      const roomName = data.accountId;

      console.log('active rooms', io.sockets.adapter.rooms);
      console.log(`Opening room: ${roomName}`);

      socket.join(roomName);
      socket.to(roomName).emit('newJoin', 'dash board joined');
    });

    // TODO Get account from JWT
    socket.on('sendToRoom', (data) => {
      const roomName = data.accountId;

      console.log('active rooms', io.sockets.adapter.rooms);
      console.log(`Sending to all in the room ${roomName}: data=${data.msg}`);

      socket.to(roomName).emit('roomMessage', `hello all in room ${roomName}`);
    });
  });
  return dashNsp;
};
