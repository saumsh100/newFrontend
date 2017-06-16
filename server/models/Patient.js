
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const AddressSchema = require('./schemas/Address');
const PreferencesSchema = require('./schemas/Preferences');
const { validatePhoneNumber } = require('../util/validators');

const UniqueFieldError = new Error('Unique Field Validation Error');

const type = thinky.type;
const r = thinky.r;

const Patient = createModel('Patient', {
  accountId: type.string().required(),
  avatarUrl: type.string(),
  email: type.string(),
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
  patientUserId: type.string(),

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
Patient.docOn('saving', validatePatient); // <<< doc is in `doc` param
// Patient.pre('save', validatePatient); // <<< doc is in the scope

Patient.pre('save', async function (next) {
  // Grab all patients in the account
  // let sequence;
  let filterSequence = {};
  const emailFilter = r.row('email').eq(this.email);
  const phoneFilter = r.row('mobilePhoneNumber').eq(this.mobilePhoneNumber);

  if (this.email) {
    filterSequence = emailFilter;
  }

  if (this.mobilePhoneNumber) {
    filterSequence = phoneFilter;
  }

  if (this.email && this.mobilePhoneNumber) {
    filterSequence = emailFilter.or(phoneFilter);
  }

  const patients = await Patient.filter({ accountId: this.accountId }).filter(filterSequence).run();
  if (!patients.length) {
    return next();
  }

  if (patients.length > 1) {
    return next(UniqueFieldError);
  }

  // By now we can guarantee that there is one patient in the array
  const [patient] = patients;

  // If it is saving for first time, this.id will be undefined (if not seeded, seeds sometimes add id)
  if (patient.id !== this.id) {
    return next(UniqueFieldError);
  }

  return next();
});

function validatePatient(doc) {
  validatePhoneNumbers(doc);
}

function validatePhoneNumbers(doc) {
  doc.homePhoneNumber = validatePhoneNumber(doc.homePhoneNumber);
  doc.mobilePhoneNumber = validatePhoneNumber(doc.mobilePhoneNumber);
  doc.workPhoneNumber = validatePhoneNumber(doc.workPhoneNumber);
  doc.otherPhoneNumber = validatePhoneNumber(doc.otherPhoneNumber);
}

module.exports = Patient;
