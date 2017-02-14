
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Account = createModel('Account', {
  name: type.string().required(),
  vendastaId: type.string(),
  smsPhoneNumber: type.string(),
  // users: []
});

module.exports = Account;
