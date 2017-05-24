

const Account = require('./Account');
const Appointment = require('./Appointment');
const Chair = require('./Chair');
const Chat = require('./Chat');
const Enterprise = require('./Enterprise');
const WeeklySchedule = require('./WeeklySchedule');
const Patient = require('./Patient');
const Family = require('./Family');
const Permission = require('./Permission');
const Practitioner = require('./Practitioner');
const PractitionerTimeOff = require('./PractitionerTimeOff');
const Request = require('./Request');
const Service = require('./Service');
const TextMessage = require('./TextMessage');
const Token = require('./Token');
const User = require('./User');
const Reservation = require('./Reservation');
const WaitSpot = require('./WaitSpot');

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

// One to many: family has multiple patients, but patient can be in one family
Family.hasMany(Patient, 'patients', 'id', 'familyId');
Patient.belongsTo(Family, 'family', 'familyId', 'id');

Patient.hasMany(Appointment, 'appointments', 'id', 'patientId');
Practitioner.hasMany(Appointment, 'appointments', 'id', 'practitionerId');
Service.belongsTo(Account, 'account', 'accountId', 'id');
Practitioner.belongsTo(Account, 'account', 'accountId', 'id');
Chair.belongsTo(Account, 'account', 'accountId', 'id');
Patient.belongsTo(Account, 'account', 'accountId', 'id');

Enterprise.hasMany(Account, 'accounts', 'id', 'enterpriseId');

Account.belongsTo(Enterprise, 'enterprise', 'enterpriseId', 'id');
Account.hasOne(WeeklySchedule, 'weeklySchedule', 'weeklyScheduleId', 'id');
Account.hasMany(TextMessage, 'textMessages', 'id', 'accountId');
Account.hasMany(Service, 'services', 'id', 'accountId');
Account.hasMany(Practitioner, 'practitioners', 'id', 'accountId');
//Account.hasMany(User, 'users', 'id', 'activeAccountId');

Chat.hasOne(Account, 'account', 'accountId', 'id');
Chat.hasOne(Patient, 'patient', 'patientId', 'id');
Chat.hasMany(TextMessage, 'textMessages', 'id', 'chatId');

Practitioner.hasMany(Reservation, 'reservations', 'id', 'practitionerId');
Practitioner.hasMany(Request, 'requests', 'id', 'practitionerId');
Practitioner.hasOne(WeeklySchedule, 'weeklySchedule', 'weeklyScheduleId', 'id');
Practitioner.hasMany(PractitionerTimeOff, 'timeOffs', 'id', 'practitionerId');

Practitioner.hasAndBelongsToMany(Service, 'services', 'id', 'id');
Service.hasAndBelongsToMany(Practitioner, 'practitioners', 'id', 'id');

Permission.hasMany(User, 'users', 'userId', 'id');

Account.hasAndBelongsToMany(Patient, 'patients', 'id', 'id');
Patient.hasAndBelongsToMany(Account, 'accounts', 'id', 'id');

Service.hasMany(Reservation, 'reservations', 'id', 'serviceId');
Service.hasMany(Request, 'requests', 'id', 'serviceId');

/* WaitSpot */
WaitSpot.hasOne(Patient, 'patient', 'patientId', 'id');
WaitSpot.hasOne(Account, 'account', 'accountId', 'id');
