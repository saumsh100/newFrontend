
const { omit } = require('lodash');
const bcrypt = require('bcrypt');
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;
const { passwordHashSaltRounds } = require('../config/globals');
const validators = require('../util/validators');

const PatientUser = createModel('PatientUser', {
  avatarUrl: type.string(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  email: type.string().email().required(),
  phoneNumber: type.string().required(),
  password: type.string().required(),
  isPhoneNumberConfirmed: type.boolean().default(false),
}/*, {
  aux: {
    // Unique emails and phoneNumbers
    email: {},
    phoneNumber: {},
  },
}*/);

PatientUser.docOn('saving', (doc) => {
  doc.phoneNumber = validators.validatePhoneNumber(doc.phoneNumber);
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
