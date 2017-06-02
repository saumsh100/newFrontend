const type = require('../config/thinky').type;
const createModel = require('./createModel');

const AuthToken = createModel('AuthToken', {
  modelId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4),
  enterpriseId: type.string().uuid(4),

  role: type.string(),
  permissions: type.object().allowExtra(true),
  enterpriseRole: type.string(),
});

module.exports = AuthToken;
