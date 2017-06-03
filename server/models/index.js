
import Account from './Account';
import Account_Patient from './Account_Patient';
import Appointment from './Appointment';
import Call from './Call';
import Chair from './Chair';
import Chat from './Chat';
import Enterprise from './Enterprise';
import Family from './Family';
import Invite from './Invite';
import OAuth from './OAuth';
import Patient from './Patient';
import Permission from './Permission';
import Practitioner from './Practitioner';
import Practitioner_Service from './Practitioner_Service';
import PractitionerTimeOff from './PractitionerTimeOff';
import Recall from './Recall';
import Reminder from './Reminder';
import Request from './Request';
import Reservation from './Reservation';
import SentRecall from './SentRecall';
import SentReminder from './SentReminder';
import Service from './Service';
import SyncClientError from './SyncClientError';
import SyncClientVersion from './SyncClientVersion';
import TextMessage from './TextMessage';
import Token from './Token';
import User from './User';
import WaitSpot from './WaitSpot';
import WeeklySchedule from './WeeklySchedule';
const AuthToken = require('./AuthToken');
const EnterprisePermission = require('./EnterprisePermission');

module.exports = {
  Account,
  Account_Patient,
  Appointment,
  Chair,
  Chat,
  Call,
  Enterprise,
  Invite,
  Patient,
  Family,
  OAuth,
  Permission,
  Practitioner,
  Practitioner_Service,
  PractitionerTimeOff,
  Request,
  Reminder,
  Recall,
  Reservation,
  SentReminder,
  SentRecall,
  Service,
  SyncClientError,
  SyncClientVersion,
  TextMessage,
  Token,
  User,
  WaitSpot,
  WeeklySchedule,
  AuthToken,
  EnterprisePermission,
};

/**
 * Account Relations
 */

Account.belongsTo(Enterprise, 'enterprise', 'enterpriseId', 'id');
Account.hasOne(WeeklySchedule, 'weeklySchedule', 'weeklyScheduleId', 'id');
Account.hasMany(TextMessage, 'textMessages', 'id', 'accountId');
Account.hasMany(Service, 'services', 'id', 'accountId');
Account.hasMany(Practitioner, 'practitioners', 'id', 'accountId');
Account.hasMany(Reminder, 'reminders', 'id', 'accountId');
Account.hasAndBelongsToMany(Patient, 'patients', 'id', 'id');
//Account.hasMany(User, 'users', 'id', 'activeAccountId');

/**
 * Appointment Relations
 */

Appointment.belongsTo(Patient, 'patient', 'patientId', 'id');
Appointment.belongsTo(Account, 'account', 'accountId', 'id');
Appointment.belongsTo(Service, 'service', 'serviceId', 'id');
Appointment.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id');
Appointment.belongsTo(Chair, 'chair', 'chairId', 'id');
Appointment.hasMany(SentReminder, 'sentReminders', 'id', 'appointmentId');

/**
 * Chair Relations
 */

Chair.belongsTo(Account, 'account', 'accountId', 'id');

/**
 * Chat Relations
 */

Chat.hasOne(Account, 'account', 'accountId', 'id');
Chat.hasOne(Patient, 'patient', 'patientId', 'id');
Chat.hasMany(TextMessage, 'textMessages', 'id', 'chatId');

/**
 * Enterprise Relations
 */

Enterprise.hasMany(Account, 'accounts', 'id', 'enterpriseId');

/**
 * Family Relations
 */

// One to many: family has multiple patients, but patient can be in one family
Family.hasMany(Patient, 'patients', 'id', 'familyId');

/**
 * OAuth Relations
 */

OAuth.belongsTo(Patient, 'patient', 'patientId', 'id');

/**
 * Patient Relations
 */

Patient.belongsTo(Family, 'family', 'familyId', 'id');
Patient.hasMany(Appointment, 'appointments', 'id', 'patientId');
Patient.hasMany(OAuth, 'oauthTokens', 'id', 'patientId');
Patient.belongsTo(Account, 'account', 'accountId', 'id');
Patient.hasAndBelongsToMany(Account, 'accounts', 'id', 'id');

/**
 * Permission Relations
 */

Permission.belongsTo(User, 'user', 'userId', 'id');
Permission.belongsTo(Account, 'account', 'accountId', 'id');
Permission.hasMany(User, 'users', 'userId', 'id');

/**
 * Practitioner Relations
 */

Practitioner.hasMany(Appointment, 'appointments', 'id', 'practitionerId');
Practitioner.belongsTo(Account, 'account', 'accountId', 'id');
Practitioner.hasMany(Reservation, 'reservations', 'id', 'practitionerId');
Practitioner.hasMany(Request, 'requests', 'id', 'practitionerId');
Practitioner.hasOne(WeeklySchedule, 'weeklySchedule', 'weeklyScheduleId', 'id');
Practitioner.hasMany(PractitionerTimeOff, 'timeOffs', 'id', 'practitionerId');
Practitioner.hasAndBelongsToMany(Service, 'services', 'id', 'id');

/**
 * Request Relations
 */

Request.belongsTo(Patient, 'patient', 'patientId', 'id');
Request.belongsTo(Account, 'account', 'accountId', 'id');
Request.belongsTo(Service, 'service', 'serviceId', 'id');
Request.belongsTo(Practitioner, 'practitioner', 'practitionerId', 'id');
Request.belongsTo(Chair, 'chair', 'chairId', 'id');

/**
 * Service Relations
 */

Service.belongsTo(Account, 'account', 'accountId', 'id');
Service.hasAndBelongsToMany(Practitioner, 'practitioners', 'id', 'id');
Service.hasMany(Reservation, 'reservations', 'id', 'serviceId');
Service.hasMany(Request, 'requests', 'id', 'serviceId');

/**
 * Token Relations
 */

Token.hasOne(Appointment, 'appointment', 'appointmentId', 'id');

/**
 * User Relations
 */

User.belongsTo(Account, 'activeAccount', 'activeAccountId', 'id');

/**
 * WaitSpot Relations
 */

WaitSpot.hasOne(Patient, 'patient', 'patientId', 'id');
WaitSpot.hasOne(Account, 'account', 'accountId', 'id');
