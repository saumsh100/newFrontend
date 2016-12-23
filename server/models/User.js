
const bcrypt = require('bcrypt');
const thinky = require('../config/thinky');

const type = thinky.type;

const User = thinky.createModel('User', {
  username: type.string().email().required(),
  password: type.string().required(),
}, {
  pk: 'username',
});

User.pre('save', function (next) {
  console.log('from presave', this);
  // https://github.com/neumino/thinky/issues/11#issuecomment-241878621
  // should it be done in this way?? code below is broken

  // if(!this.isModified('password')) console.log('modified');
  // if(!this.isModified('password')) return next();
  // const password = bcrypt.hashSync(password, 10);
  next();
});

module.exports = User;
