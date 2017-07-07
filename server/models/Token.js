
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Token = createModel('Token', {
  // This is not used for appointment confirmations
  appointmentId: type.string().uuid(4),

  // Token
  id: type.string(),
  patientUserId: type.string().uuid(4),
});

module.exports = Token;
