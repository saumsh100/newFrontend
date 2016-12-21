
const thinky = require('../config/thinky');
const type = thinky.type;

const User = thinky.createModel('User', {
  username: type.string().email().required(),
  password: type.string().required(),
}, {
  pk: 'username',
});

module.exports = User;
