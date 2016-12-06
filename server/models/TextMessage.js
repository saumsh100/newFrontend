
const thinky = require('../config/thinky');
const type = thinky.type;

const TextMessage = thinky.createModel('TextMessage', {
  // Twilio MessageSID
  id: type.string(),
  to: type.string(),
  from: type.string(),
  message: type.string(),
  status: type.string(),
  createdAt: type.date(),
}, {
  pk: 'id',
});

module.exports = TextMessage;
