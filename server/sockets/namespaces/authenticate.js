
const socketIoJwt = require('socketio-jwt');
const { tokenSecret } = require('../../config/globals');

// JWT Connection options
const SOCKET_IO_OPTIONS = {
  secret: tokenSecret,

  // TODO: change to lower value or remove
  timeout: 15000,
};

/**
 * authenticate will take in a socket namespace and bind the appropriate auth handlers
 * and focus on abstracting this all out
 *
 * @param ns
 * @param onAuthenticatedCallBack
 * @returns {*}
 */
function authenticate(ns, onAuthenticatedCallBack) {
  // Authorize socket connection
  ns.on('connection', socketIoJwt.authorize(SOCKET_IO_OPTIONS));

  // TODO: better handling/logging here, thrown Error here will break process
  ns.on('unauthorized', (msg) => {
    console.err('unauthorized socket: ', JSON.stringify(msg.data));
    throw new Error(msg.data.type);
  });

  // Join rooms on successful authentication
  ns.on('authenticated', onAuthenticatedCallBack);

  return ns;
}

module.exports = authenticate;
