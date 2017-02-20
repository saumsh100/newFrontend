
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Patient = createModel('Patient', {
  accountId: type.string().required(),
  firstName: type.string().required(),
  middleName: type.string(),
  lastName: type.string().required(),
  email: type.string(),
  phoneNumber: type.string(),
  email: type.string().email(),
  birthDate: type.date().required(),
  insurance: type.object().allowNull(),

  // TODO: this needs to be modified to support priorities and a standard structure
  appointmentPreference: type.string().enum(['email', 'sms', 'both']).default('both'),
});

// TODO: change to findOne as a general Model function
Patient.defineStatic('findByPhoneNumber', function (phoneNumber) {
  return this.filter({ phoneNumber }).nth(0).run();
});

module.exports = Patient;
