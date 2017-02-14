
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Token = createModel('Token', {
  appointmentId: type.string().uuid(4).required(),
});

module.exports = Token;
