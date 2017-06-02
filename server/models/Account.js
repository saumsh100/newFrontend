
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
  clinicName: type.string(),
  bookingWidgetPrimaryColor: type.string(),
  weeklyScheduleId: type.string().uuid(4),
  googleAnalytics: type.boolean().default(false),
  loyality: type.boolean().default(false),
  referals: type.boolean().default(false),
  enterpriseId: type.string().uuid(4).required(),
  // users: []
});

module.exports = Account;
