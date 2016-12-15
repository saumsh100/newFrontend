
const thinky = require('../config/thinky');
const type = thinky.type;

const User = thinky.createModel('User', {
  id: type.string(),
  username: type.string().email().required(),
  password: type.string().required(),
}, {
  pk: 'id',
});

module.exports = User;
