
const thinky = require('../config/thinky');
const type = thinky.type;

const Token = thinky.createModel('Token', {
  id: type.string(),
  appointmentId: type.string(),
});


module.exports = Token;
