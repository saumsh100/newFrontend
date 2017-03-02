const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const SyncError = createModel('SyncError', {
  accountId: type.string().uuid(4).required(),
  errorMessage: type.string(),
  stacktrace: type.string(),
});

module.exports = SyncError;
