
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const AddressSchema = require('./schemas/Address');
const PreferencesSchema = require('./schemas/Preferences');
const PatientAux = require('./PatientAux');
const validators = require('../util/validators');

const type = thinky.type;

const Patient = createModel('Patient', {
  accountId: type.string(),
  avatarUrl: type.string(),
  email: type.string(),
  password: type.string(),
  pmsId: type.string(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  middleName: type.string(),

  phoneNumber: type.string(),
  homePhoneNumber: type.string(),
  mobilePhoneNumber: type.string(),
  workPhoneNumber: type.string(),
  otherPhoneNumber: type.string(),
  prefContactPhone: type.string(),

  lastAppointmentDate: type.date(),
  notes: type.string(),
  gender: type.string(),
  prefName: type.string(),
  language: type.string(),
  address: AddressSchema,
  preferences: PreferencesSchema,
  type: type.string(),
  birthDate: type.date(),
  insurance: type.object().allowNull(),
  isDeleted: type.boolean().default(false),
  isSyncedWithPMS: type.boolean().default(false),
  familyId: type.string(),

  // TODO: this needs to be modified to support priorities and a standard structure
  appointmentPreference: type.string().enum(['email', 'sms', 'both']).default('both'),
  status: type.string().enum(['Active', 'InActive']).default('Active'),
});

/*
function checkUniqueAttributes() {
  for (every unique field in Patient model) {
    check if field exists in the aux table;
  }
}

- how to mark a field that it should be unique
*/

/**
 * - check if PatientAux table has this phone number in it
 * TODO create aux table
 * Check aux patient table to see if the phone number is unique.
 * @return boolean true if it is, false otherwise
 */
// function isUnique(number) {
//   console.log('verifying uniqueness of the number:', number);
//   PatientMobilePhoneNumberAuxClinicIdTable
//     .get(mobilePhoneNumber)
//     //.filter(accountId)
//     .then((matches) => {
//       console.log('creating the aux table');
//       const patientAuxData = Object.assign({}, { mobilePhoneNumber: number });
//       PatientAux.save(patientAuxData);
//       return true;
//     })
//     .catch(error => console.log('TODO do something about the error', error));
// }

// TODO: change to findOne as a general Model function
Patient.defineStatic('findByPhoneNumber', function (phoneNumber) {
  return this.filter({ mobilePhoneNumber: phoneNumber }).nth(0).run();
});

/**
 * Return preferred phone number of this patient
 */
Patient.define('getPreferredPhoneNumber', () => {
  const prefPhone = this.prefContactPhone;
  return this[prefPhone];
});

/**
 * Fires on document create and update
 */
Patient.docOn('saving', validatePatient);
// Patient.pre('save', validatePatient);

function validatePatient(doc) {
  isUnique(doc.mobilePhoneNumber);
  // validators.validatePhoneNumber(doc.phoneNumber);
  // validators.validatePhoneNumber(doc.mobileNumber);
  // validators.validatePhoneNumber(doc.workNumber);
  // validators.validatePhoneNumber(doc.otherPhoneNumber);
}

module.exports = Patient;
