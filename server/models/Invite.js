
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Invite = createModel('Invite', {
  sendingUserId: type.string().required(),
  accountId: type.string().required(),
  email: type.string().required(),
  token: type.string().uuid(4).required(),
  enterpriseId: type.string().uuid(4).required(),
});

module.exports = Invite;
