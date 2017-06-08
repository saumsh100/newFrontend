
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const { type, r } = thinky;

const Chat = createModel('Chat', {
  accountId: type.string().uuid(4),
  patientId: type.string().uuid(4),
  patientPhoneNumber: type.string().required(),
  lastTextMessageDate: type.date(),
  lastTextMessageId: type.string(),//.required(),
});

module.exports = Chat;
