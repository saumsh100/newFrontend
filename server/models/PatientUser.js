
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const PatientUser = createModel('PatientUser', {
  email: type.string(),
  firstName: type.string(),
  lastName: type.string(),
  mobilePhoneNumber: type.string(),
});

module.exports = PatientUser;
