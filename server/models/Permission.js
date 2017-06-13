
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

// Every User hasOne Permission
const Permission = createModel('Permission', {
  // userId: type.string().required(),

  // maps to preset permissions
  role: type.string().enum('SUPERADMIN', 'OWNER', 'MANAGER').required(),

  // over rides preset for more granular access
  permissions: type.object().allowExtra(true),
  canAccessAllAccounts: type.boolean().default(true),
  allowedAccounts: type.array(),
});

module.exports = Permission;
