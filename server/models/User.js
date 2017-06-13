
const bcrypt = require('bcrypt');
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;
const { passwordHashSaltRounds } = require('../config/globals');

const User = createModel('User', {
  firstName: type.string().required(),
  lastName: type.string().required(),
  username: type.string().email().required(),
  password: type.string().required(),
  activeAccountId: type.string().uuid(4).required(),
  enterpriseId: type.string().uuid(4).required(),
  permissionId: type.string().uuid(4).required(),
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
    bcrypt.hash(password, passwordHashSaltRounds, (err, hashedPassword) => {
      if (err) reject(err);
      this.password = hashedPassword;
      return resolve(this);
    });
  });
});

module.exports = User;
