
const bcrypt = require('bcrypt');
const thinky = require('../config/thinky');

const type = thinky.type;

const User = thinky.createModel('User', {
  id: type.string().uuid(4),
  accounts: [type.string().uuid(4)],
  username: type.string().email().required(),
  password: type.string().required(),
  activeAccountId: type.string().uuid(4),
  permissionId: type.string(),
  toJson: type.virtual().default(function() {
    const {
      id,
      username,
      activeAccountId,
    } = this;
    
    return {
      id,
      username,
      activeAccountId,
    };
  }),
}, {
  pk: 'id',
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
