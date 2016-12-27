const thinky = require('../config/thinky');
const type = thinky.type;

const Account = thinky.createModel('Account', {
  id: type.string().uuid(4),
  name: type.string(),
  vendastaId: type.string(),
  smsPhoneNumber: type.string(),
  // users: []
}, {
  pk: 'id',
});

module.exports = Account;
