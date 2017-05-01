
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Account_Patient = createModel('Account_Patient', {
  Account_id: type.string().uuid(4).required(),
  Patient_id: type.string().uuid(4).required(),
});

module.exports = Account_Patient;
