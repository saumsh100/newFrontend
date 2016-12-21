
const thinky = require('../config/thinky');
const type = thinky.type;

const User = thinky.createModel('User', {
  id: type.string().uuid(4),
  username: type.string().email().required(),
  password: type.string().required(),
  activeAccountId: type.string(),
}, {
  pk: 'id',
});

module.exports = User;
