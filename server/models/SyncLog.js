const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const SyncLog = createModel('SyncLog', {
  accountId: type.string().uuid(4).required(),
  version: type.string(),
  adapter: type.string(),

  operation: type.string().enum('create', 'update', 'delete', 'sync').required(),
  success: type.boolean(),

  // payload: type.string(),
  model: type.string(),
  documentId: type.string().uuid(4),

  // patientId: type.string().uuid(4),
  // appointmentId: type.string().uuid(4),

  errorMessage: type.string(),
  stackTrace: type.string(),
});

module.exports = SyncLog;
