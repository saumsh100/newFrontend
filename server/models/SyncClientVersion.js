const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const SyncClientVersion = createModel('SyncClientVersion', {
  version: type.number().required(),
  build: type.number(),
  url: type.string().required(),
  key: type.string().required(),
  secret: type.string().required(),
});

module.exports = SyncClientVersion;
