const type = require('../config/thinky').type;
const createModel = require('./createModel');

const AuthToken = createModel('AuthToken', {
  modelId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4),
});

module.exports = AuthToken;
