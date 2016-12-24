
const Appointment = require('./Appointment');
const Patient = require('./Patient');
const TextMessage = require('./TextMessage');
const User = require('./User');
const Account = require('./Account');
const Permission = require('./Permission');

// define relations
User.belongsTo(Account, 'activeAccount', 'activeAccountId', 'id')
Permission.belongsTo(User, 'user', 'userId', 'id')
Permission.belongsTo(Account, 'account', 'accountId', 'id')

User.hasAndBelongsToMany(Account, 'accounts', 'id', 'id')
// Account.hasAndBelongsToMany(User, 'users', 'id', 'id')

Appointment.belongsTo(Patient, 'patient', 'patientId', 'id')
Appointment.belongsTo(Account, 'account', 'accountId', 'id')

module.exports = {
  Appointment,
  Patient,
  TextMessage,
  Permission,
  User,
  Account,
};
