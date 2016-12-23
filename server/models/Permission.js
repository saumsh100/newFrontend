
const thinky = require('../config/thinky');
const type = thinky.type;

const Permission = thinky.createModel('Permission', {
  id: type.string().uuid(4),
  // role: type.
});

module.exports = Permission;
