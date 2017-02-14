
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Permission = createModel('Permission', {
  userId: type.string().required(),
  accountId: type.string().required(),

  // maps to preset permissions
  role: type.string().enum('OWNER', 'ADMIN', 'VIEWER').required(),

  // over rides preset for more granular access
  permissions: type.object().allowExtra(true),
});

module.exports = Permission;
