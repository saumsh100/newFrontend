
const Appointment = require('./Appointment');
const Patient = require('./Patient');
const TextMessage = require('./TextMessage');
const User = require('./User');
const Account = require('./Account');

// define relations
User.belongsTo(Account, 'activeAccount', 'activeAccountId', 'id')
Appointment.belongsTo(Patient, 'patient', 'patientId', 'id')
Appointment.belongsTo(Account, 'account', 'accountId', 'id')

module.exports = {
  Appointment,
  Patient,
  TextMessage,
  User,
  Account,
};
