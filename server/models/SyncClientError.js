const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const SyncClientError = createModel('SyncClientError', {
  syncId: type.number(),
  accountId: type.string().uuid(4).required(),
  version: type.string(),
  adapter: type.string(),

  operation: type.string().enum('create', 'update', 'remove', 'sync').required(),
  success: type.boolean(),

  model: type.string(),
  documentId: type.string(),
  payload: type.string(),
  customErrorMsg: type.string(),

  errorMessage: type.string(),
  stackTrace: type.string(),
});

module.exports = SyncClientError;
