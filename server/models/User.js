
const bcrypt = require('bcrypt');
const thinky = require('../config/thinky');

const type = thinky.type;

const User = thinky.createModel('User', {
  id: type.string().uuid(4),
  username: type.string().email().required(),
  password: type.string().required(),
  activeAccountId: type.string(),
  permissionId: type.string(),
  toJson: type.virtual().default(function () {
    const {
      username,
      activeAccountId,
      id,
    } = this;
    return {
      username,
      activeAccountId,
      id,
    };
  }),
}, {
  pk: 'id',
});

User.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = User;
