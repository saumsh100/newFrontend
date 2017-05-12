
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Patient = createModel('Patient', {
  accountId: type.string(),
  pmsId: type.string(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  middleName: type.string(),
  phoneNumber: type.string(),
  mobileNumber: type.string(),
  email: type.string(),
  lastAppointmentDate: type.date(),
  notes: type.string(),
  gender: type.string(),
  prefName: type.string(),
  language: type.string(),
  prefContactPhone: type.string(),
  address: type.string(),
  type: type.string(),
  birthDate: type.date(),
  insurance: type.object().allowNull(),
  isDeleted: type.boolean(),
  isSyncedWithPMS: type.boolean().required().default(true),

  // TODO: this needs to be modified to support priorities and a standard structure
  appointmentPreference: type.string().enum(['email', 'sms', 'both']).default('both'),
  status: type.string().enum(['Active', 'InActive']).default('Active'),
});

// TODO: change to findOne as a general Model function
Patient.defineStatic('findByPhoneNumber', function (phoneNumber) {
  return this.filter({ phoneNumber }).nth(0).run();
});

module.exports = Patient;
