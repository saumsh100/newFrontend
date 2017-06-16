
const { omit } = require('lodash');
const bcrypt = require('bcrypt');
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;
const r = thinky.r;
const { passwordHashSaltRounds } = require('../config/globals');
const validators = require('../util/validators');

const UniqueFieldError = new Error('Unique Field Validation Error');

const PatientUser = createModel('PatientUser', {
  avatarUrl: type.string(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  email: type.string().email().required(),
  phoneNumber: type.string().required(),
  password: type.string().required(),
  isPhoneNumberConfirmed: type.boolean().default(false),
});

PatientUser.docOn('saving', (doc) => {
  doc.phoneNumber = validators.validatePhoneNumber(doc.phoneNumber);
});

PatientUser.pre('save', async function (next) {
  let filterSequence = {};
  const emailFilter = r.row('email').eq(this.email);
  const phoneFilter = r.row('phoneNumber').eq(this.phoneNumber);

  if (this.email) {
    filterSequence = emailFilter;
  }

  if (this.phoneNumber) {
    filterSequence = phoneFilter;
  }

  if (this.email && this.phoneNumber) {
    filterSequence = emailFilter.or(phoneFilter);
  }

  const patients = await PatientUser.filter(filterSequence).run();
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

PatientUser.define('isValidPasswordAsync', function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, match) => {
      if (err) reject(err);
      if (!match) reject(new Error('Invalid password'));
      return resolve(true);
    });
  });
});

// NOTE: this function does not save the model!
PatientUser.define('setPasswordAsync', function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, passwordHashSaltRounds, (err, hashedPassword) => {
      if (err) reject(err);
      this.password = hashedPassword;
      return resolve(this);
    });
  });
});

PatientUser.define('makeSafe', function () {
  delete this.password;
  return this;
});

module.exports = PatientUser;
