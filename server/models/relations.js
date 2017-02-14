
const Account = require('./Account');
const Appointment = require('./Appointment');
const Chair = require('./Chair');
const Chat = require('./Chat');
const Patient = require('./Patient');
const Permission = require('./Permission');
const Practitioner = require('./Practitioner');
const Request = require('./Request');
const Service = require('./Service');
const TextMessage = require('./TextMessage');
const Token = require('./Token');
const User = require('./User');

// define relations
User.belongsTo(Account, 'activeAccount', 'activeAccountId', 'id');
Permission.belongsTo(User, 'user', 'userId', 'id');
Permission.belongsTo(Account, 'account', 'accountId', 'id');

// TODO check if we need
// User.hasAndBelongsToMany(Account, 'accounts', 'id', 'id')
// Account.hasAndBelongsToMany(User, 'users', 'id', 'id')

// foreign keys in Appointment
Appointment.belongsTo(Patient, 'patient', 'patientId', 'id');
Appointment.belongsTo(Account, 'account', 'accountId', 'id');
Appointment.belongsTo(Service, 'service', 'serviceId', 'id');
Appointment.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id');
Appointment.belongsTo(Chair, 'chair', 'chairId', 'id');

Token.hasOne(Appointment, 'appointment', 'appointmentId', 'id');

Request.belongsTo(Patient, 'patient', 'patientId', 'id');
Request.belongsTo(Account, 'account', 'accountId', 'id');
Request.belongsTo(Service, 'service', 'serviceId', 'id');
Request.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id');
Request.belongsTo(Chair, 'chair', 'chairId', 'id');

Patient.hasMany(Appointment, 'appointments', 'id', 'patientId');
Service.belongsTo(Account, 'account', 'accountId', 'id');
Practitioner.belongsTo(Account, 'account', 'accountId', 'id');
Chair.belongsTo(Account, 'account', 'accountId', 'id');
Patient.belongsTo(Account, 'account', 'accountId', 'id');
// Service.hasAndBelongsToMany(Practitioner, 'practitioners', 'id', 'id')
// Practitioner.hasAndBelongsToMany(Service, 'services', 'id', 'id')
Account.hasMany(TextMessage, 'textMessages', 'id', 'accountId');
Account.hasMany(Patient, 'patients', 'id', 'accountId');

Chat.hasOne(Patient, 'patient', 'patientId', 'id');
Chat.hasOne(Account, 'account', 'accountId', 'id');
Chat.hasMany(TextMessage, 'textMessages', 'id', 'chatId');
