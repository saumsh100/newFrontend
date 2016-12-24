
const thinky = require('../config/thinky');
const type = thinky.type;

const Permission = thinky.createModel('Permission', {
  id: type.string().uuid(4),
  userId: type.string(),
  accountId: type.string(),

  // maps to preset permissions
  role: type.string().enum('OWNER', 'ADMIN', 'VIEWER'),

  // over rides preset for more granular access
  permissions: type.object().allowExtra(true)
});

module.exports = Permission;
