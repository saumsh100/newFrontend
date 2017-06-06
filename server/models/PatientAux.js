
const thinky = require('../config/thinky');
const createModel = require('./createModel');

const type = thinky.type;

const PatientAux = createModel('PatientAux', {
  mobilePhoneNumber: type.string(),
}, { pk: mobilePhoneNumber + '.' + accountId });

module.exports = PatientAux;
