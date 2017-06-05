
const { type } = require('../config/thinky');
const createModel = require('./createModel');

const SentRecall = createModel('SentRecall', {
  sentDate: type.date(),
  recallId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  patientId: type.string().uuid(4).required(),
  isConfirmed: type.boolean().default(false),
});

module.exports = SentRecall;
