
const { type } = require('../config/thinky');
const createModel = require('./createModel');

const PHONE = 'phone';
const EMAIL = 'email';
const SMS = 'sms';

const SentReminder = createModel('SentReminder', {
  sentDate: type.date(),
  reminderId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  patientId: type.string().uuid(4).required(),
  appointmentId: type.string().uuid(4).required(),
  isConfirmed: type.boolean().default(false),
  isSent: type.boolean().default(false),

  // Hacky fix for RemindersList algo so that we don't send farther away reminders
  // after sending the short ones
  lengthSeconds: type.number().required(),
  primaryType: type.string().enum(SMS, PHONE, EMAIL).required(),
});

module.exports = SentReminder;

