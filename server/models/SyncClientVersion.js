const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const SyncClientVersion = createModel('SyncClientVersion', {
  latest: type.boolean(),
  version: type.number().required(),
  build: type.number(),
  url: type.string(),
});

module.exports = SyncClientVersion;
