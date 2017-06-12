
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const UUID = type.string().uuid(4);

const EnterprisePermission = createModel('EnterprisePermission', {
  enterpriseId: UUID,
  userId: UUID,
  role: type.string().enum('OWNER', 'ADMIN', 'MANAGER'),
});

module.exports = EnterprisePermission;
