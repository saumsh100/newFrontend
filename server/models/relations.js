const Account = require('./Account');
const Appointment = require('./Appointment');
const Chair = require('./Chair');
const Patient = require('./Patient');
const Permission = require('./Permission');
const Practitioner = require('./Practitioner');
const Service = require('./Service');
const TextMessage = require('./TextMessage');
const User = require('./User');
const Token = require('./Token');

// define relations
User.belongsTo(Account, 'activeAccount', 'activeAccountId', 'id')
Permission.belongsTo(User, 'user', 'userId', 'id')
Permission.belongsTo(Account, 'account', 'accountId', 'id')

// TODO check if we need
// User.hasAndBelongsToMany(Account, 'accounts', 'id', 'id')
// Account.hasAndBelongsToMany(User, 'users', 'id', 'id')

// foreign keys in Appointment
Appointment.belongsTo(Patient, 'patient', 'patientId', 'id')
Appointment.belongsTo(Account, 'account', 'accountId', 'id')
Appointment.belongsTo(Service, 'service', 'serviceId', 'id')
Appointment.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id')
Appointment.belongsTo(Chair, 'chair', 'chairId', 'id')
Token.hasOne(Appointment, 'appointment', 'appointmentId', 'id')
Practitioner.hasMany(TextMessage, 'textMessages', 'id', 'practitionerId')
Service.belongsTo(Account, 'account', 'accountId', 'id')
Practitioner.belongsTo(Account, 'account', 'accountId', 'id')
Chair.belongsTo(Account, 'account', 'accountId', 'id')
Service.hasMany(Practitioner, 'practitioners', 'id', 'serviceId')
