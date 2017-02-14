
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Chat = createModel('Chat', {
  accountId: type.string().uuid(4).required(),
  patientId: type.string().uuid(4).required(),
  lastTextMessageDate: type.date(),
});

module.exports = Chat;
