const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const SyncClientVersion = createModel('SyncClientVersion', {
  latest: type.boolean(),
  major: type.number().required(),
  minor: type.number(),
});

module.exports = SyncClientVersion;
