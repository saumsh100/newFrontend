
import Appointment from './Appointment';
import moment from 'moment';
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const AddressSchema = require('./schemas/Address');
const PreferencesSchema = require('./schemas/Preferences');
const { validatePhoneNumber } = require('../util/validators');

const type = thinky.type;
const r = thinky.r;

function validatePatient(doc) {
  return validatePhoneNumbers(doc);
}

function validatePhoneNumbers(doc) {
  doc.homePhoneNumber = validatePhoneNumber(doc.homePhoneNumber);
  doc.mobilePhoneNumber = validatePhoneNumber(doc.mobilePhoneNumber);
  doc.workPhoneNumber = validatePhoneNumber(doc.workPhoneNumber);
  doc.otherPhoneNumber = validatePhoneNumber(doc.otherPhoneNumber);

  // Only need for batchSaving...
  return doc;
}

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
}, {
  unique: {
    email: ['accountId'],
    mobilePhoneNumber: ['accountId'],
  },

  sanitize: validatePatient,
});

Patient.defineStatic('performantPredicate', function (a, b, onError) {
  if (a.email && b.email
      && a.accountId === b.accountId && a.email === b.email) {
    onError('email', a);
    return true;
  }

  if (a.mobilePhoneNumber && b.mobilePhoneNumber
      && a.accountId === b.accountId && a.mobilePhoneNumber === b.mobilePhoneNumber) {
    onError('mobilePhoneNumber', a);
    return true;
  }
});

Patient.ensureIndex('accountId');

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

module.exports = Patient;
