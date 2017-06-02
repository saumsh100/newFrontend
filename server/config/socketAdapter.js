
const socketRedisAdapter = require('socket.io-redis');
const { redis } = require('./globals');

// TODO: ensure that if we use redis for background jobs it does not conflict
// redis = { host, port }
module.exports = socketRedisAdapter(redis.uri);
