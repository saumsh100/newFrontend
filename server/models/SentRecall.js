
const { type } = require('../config/thinky');
const createModel = require('./createModel');

const PHONE = 'phone';
const EMAIL = 'email';
const SMS = 'sms';

const SentRecall = createModel('SentRecall', {
  recallId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  patientId: type.string().uuid(4).required(),
  isSent: type.boolean().default(false),

  // Hacky fix for RemindersList algo so that we don't send farther away reminders
  // after sending the short ones
  lengthSeconds: type.number().required(),
  primaryType: type.string().enum(SMS, PHONE, EMAIL).required(),
});

module.exports = SentRecall;
