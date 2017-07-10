const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const SyncClientVersion = createModel('SyncClientVersion', {
  major: type.number(),
  minor: type.number(),
  patch: type.number(),
  build: type.number(),
  url: type.string(),
  key: type.string(),
  secret: type.string(),
  filename: type.string(),
  path: type.string(),
  bucket: type.string(),
});

module.exports = SyncClientVersion;
