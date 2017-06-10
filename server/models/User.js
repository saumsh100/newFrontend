
const bcrypt = require('bcrypt');
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const User = createModel('User', {
  avatarUrl: type.string(),
  firstName: type.string(),
  lastName: type.string(),
  username: type.string().email().required(),
  password: type.string().required(),
  activeAccountId: type.string().uuid(4),
  permissionId: type.string().uuid(4),
});

User.define('isValidPasswordAsync', function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, match) => {
      if (err) reject(err);
      if (!match) reject(new Error('Invalid password'));
      return resolve(true);
    });
  });
});

// NOTE: this function does not save the model!
User.define('setPasswordAsync', function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) reject(err);
      this.password = hashedPassword;
      return resolve(this);
    });
  });
});

module.exports = User;
