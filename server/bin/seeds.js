
const bcrypt = require('bcrypt');
const seedDatabase = require('../util/seedDatabase');
const uuid = require('uuid').v4;
const moment = require('moment');
// For hashing passwords for User seeds
// TODO: pull fromm global config, cause needs to be reused with deserialization
const saltRounds = 10;


/**
 * Seeds Map is organized by:
 *
 * {
 *    [TABLE_NAME1]: [ MODEL1_DATA, ],
 *    [TABLE_NAME2]: [ MODEL2_DATA, ],
 *    ...
 * }
 *
 */


const accountId = uuid();
const justinPatientId = uuid();
const sergeyPatientId = uuid();
const lonnyUserId = uuid();
const justinUserId = uuid();
const markUserId = uuid();
const ashmeetUserId = uuid();
const sergeyUserId = uuid();

const alexUserId = uuid();
const alexPatientId = uuid();
const practitionerId = uuid();
const practitionerId2 = uuid();
const chairId = uuid();
const serviceId = uuid();
const serviceId2 = uuid();
const appointmentId1 = uuid();
const appointmentId2 = uuid();

const SEEDS = {
  Appointment: [
    {
      startTime: new Date(2017, 1, 10, 10, 30, 0, 0),
      endTime: new Date(2017, 1, 10, 11, 30, 0, 0),
      title: 'Sooner Availability',
      id: appointmentId1,
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId2,
      practitionerId: practitionerId2,
      chairId: chairId,
    },

    {
      startTime: new Date(2017, 1, 9, 9, 0, 0, 0),
      endTime: new Date(2017, 1, 9, 17, 0, 0, 0),
      title: 'Full day',
      id: uuid(),
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId2,
      practitionerId: practitionerId,
      chairId: chairId,
    },

    {
      startTime: new Date(2017, 1, 8, 9, 0, 0, 0),
      endTime: new Date(2017, 1, 8, 17, 0, 0, 0),
      title: 'Full day',
      id: uuid(),
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId2,
      practitionerId: practitionerId,
      chairId: chairId,
    },

    {
      startTime: new Date(2017, 1, 10, 12, 30, 0, 0),
      endTime: new Date(2017, 1, 10, 13, 30, 0, 0),
      title: 'Later Availability',
      id: appointmentId2,
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,
    },
    {
      accountId,
      id: uuid(),
      title: 'Justin\'s appointment',
      startTime: new Date(2017, 1, 9, 14, 30, 0, 0),
      endTime: new Date(2017, 1, 9, 15, 30, 0, 0),

      patientId: justinPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId2,
      chairId: chairId,

      isClinicConfirmed: true,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
    {
      id: uuid(),
      title: 'Sergey\'s appointment',
      startTime: new Date(2017, 1, 9, 16, 0, 0, 0),
      endTime: new Date(2017, 1, 9, 17, 0, 0, 0),

      patientId: sergeyPatientId,
      accountId: accountId,
      serviceId: serviceId,
      practitionerId: practitionerId2,
      chairId: chairId,

      isClinicConfirmed: true,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
  ],

  User: [
    {
      username: 'lonny@carecru.com',
      password: bcrypt.hashSync('lonny', saltRounds),
      id: lonnyUserId,
      activeAccountId: accountId,
      // accounts: [accountId],
    },
    {
      username: 'mark@carecru.com',
      password: bcrypt.hashSync('mark', saltRounds),
      id: markUserId,
      activeAccountId: accountId,
      // accounts: [accountId],
    },
    {
      username: 'justin@carecru.com',
      password: bcrypt.hashSync('justin', saltRounds),
      id: justinUserId,
      activeAccountId: accountId,
      // accounts: [accountId],
    },
    {
      username: 'ashmeet@carecru.com',
      password: bcrypt.hashSync('ashmeet', saltRounds),
      id: ashmeetUserId,
      activeAccountId: accountId,
      // accounts: [accountId],
    },
    {
      username: 'sergey@carecru.com',
      password: bcrypt.hashSync('sergey', saltRounds),
      id: sergeyUserId,
      activeAccountId: accountId,
      // accounts: [accountId],
    },
    {
      username: 'alex@carecru.com',
      password: bcrypt.hashSync('alex', saltRounds),
      id: alexUserId,
      activeAccountId: accountId,
    },
  ],

  Patient: [
    {
      firstName: 'Justin',
      lastName: 'Sharp',
      phoneNumber: '+17808508886',
      id: justinPatientId,
    },
    {
      firstName: 'Sergey',
      lastName: 'Skovorodnikov',
      phoneNumber: '+17782422626',
      id: sergeyPatientId,
    },
    {
      firstName: 'Mark',
      lastName: 'Joseph',
      phoneNumber: '+17788654451',
      id: uuid(),
    },
    {
      firstName: 'Alex',
      lastName: 'Bashliy',
      phoneNumber: '+19782521845',
      id: alexPatientId,
      email: 'alex.bashliy@keenethics.com',
      appointmentPreference: 'both',
    },
  ],

  Account: [
    {
      name: 'Beckett Dental',
      vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      smsPhoneNumber: '+17786558613',
      id: accountId,
    },
  ],

  Permission: [
    {
      id: uuid(),
      userId: lonnyUserId,
      accountId,
      role: 'OWNER',
      permissions: { reviews: { create: true } }, // test permission
    },
    {
      id: uuid(),
      userId: justinUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
    },
    {
      id: uuid(),
      userId: ashmeetUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
    },
    {
      id: uuid(),
      userId: markUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
    },
    {
      id: uuid(),
      userId: sergeyUserId,
      accountId,
      role: 'VIEWER',
      permissions: {},
    },
  ],

  Service: [
    {
      id: serviceId,
      accountId: accountId,
      name: 'Routine Checkup',
      practitioners: [practitionerId],
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
    {
      id: serviceId2,
      accountId: accountId,
      name: 'Another service',
      practitioners: [practitionerId2],
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
    {
      id: uuid(),
      accountId: accountId,
      name: 'third service',
      practitioners: [practitionerId2],
      duration: 50,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
  ],

  Practitioner: [
    {
      id: practitionerId,
      accountId: accountId,
      firstName: 'Chelsea',
      lastName: 'Mansfield',
    },
    {
      id: practitionerId2,
      accountId,
      firstName: 'Perry',
      lastName: 'Cox',
    },
  ],

  TextMessage: [
    {
      id: uuid(),
      patientId: alexPatientId,
      practitionerId,
      body: 'from Chelsea 1',
      createdAt: new Date(2017, 0, 1, 12, 30, 0, 0),
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      practitionerId,
      body: 'from Chelsea 2',
      createdAt: new Date(2017, 0, 6, 12, 30, 0, 0),
    },
    {
      id: uuid(),
      patientId: justinPatientId,
      practitionerId,
      body: 'from Chelsea2',
      createdAt: new Date(2017, 0, 2, 12, 30, 0, 0),
    },
    {
      id: uuid(),
      patientId: justinPatientId,
      practitionerId: practitionerId2,
      body: 'from Perry 1',
      createdAt: new Date(2017, 0, 3, 12, 30, 0, 0),
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      practitionerId: practitionerId2,
      body: 'from Perry to alex 1',
      createdAt: new Date(2017, 0, 4, 11, 30, 0, 0),
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      practitionerId: practitionerId2,
      body: 'from Perry to Alex 2',
      createdAt: new Date(2017, 0, 4, 12, 30, 0, 0),
    },
  ],

  Chair: [
    {
      id: chairId,
      accountId: accountId,
      name: 'Chair 1',
      description: '',
    },
  ],

  Token: [
    {
      id: uuid(),
      appointmentId: appointmentId1,
    },
    {
      id: uuid(),
      appointmentId: appointmentId2,
    },
  ],
};


console.log(SEEDS);

seedDatabase(SEEDS)
  .then(() => {
    console.log('Successfully executed bin/seeds.');
    process.exit();
  })
  .catch((err) => {
    console.error('Unsuccessfully executed bin/seeds.');
    console.error(err);
    process.exit(1);
  });
