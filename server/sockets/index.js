const Server = require('socket.io');
const setupDashNsp = require('./namespaces/dash');
const redis = require('socket.io-redis');
const globals = require('../config/globals');

const redisOptions = {
  host: globals.redis.host,
  port: globals.redis.port,
};

module.exports = function (server) {
  const io = new Server(server);
  // io.adapter(redis(redisOptions));
  setupDashNsp(io);
};
