
const Server = require('socket.io');
// const socketAdapter = require('../config/socketAdapter');

/**
 * createSocketServer will return the instance of io
 *
 * @param socket.io server
 * @returns {IO Server}
 */
function createSocketServer(server) {
  const io = new Server(server);

  // Bind adapter for distributed emits to rooms (need a central store for sockets)
  // io.adapter(socketAdapter);
  return io;
}

module.exports = createSocketServer;
