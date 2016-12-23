
const thinky = require('../config/thinky');
const type = thinky.type;

const Permission = thinky.createModel('Permission', {
  id: type.string().uuid(4),
  scopes: [type.string()],
  role: type.string(),
});

module.exports = Permission;
