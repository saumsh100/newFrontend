
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Account = createModel('Account', {
  name: type.string().required(),
  street: type.string(),
  country: type.string(),
  state: type.string(),
  city: type.string(),
  zipCode: type.string(),
  vendastaId: type.string(),
  smsPhoneNumber: type.string(),
  logo: type.string(),
  address: type.string(),
  clinicName: type.string(),
  weeklyScheduleId: type.string().uuid(4),
  // users: []
});

module.exports = Account;
