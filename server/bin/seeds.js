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
const accountId2 = uuid();
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


const SEEDS = {
  Appointment: [
    {
      startTime: new Date(2017, 0, 13, 12, 30, 0, 0),
      endTime: new Date(2017, 0, 13, 10, 30, 0, 0),
      title: 'Sooner Availability',
      id: uuid(),
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,
    },

    {
      startTime: new Date(2017, 0, 28, 12, 30, 0, 0),
      endTime: new Date(2017, 0, 28, 12, 30, 0, 0),
      title: 'Sooner Availability',
      id: uuid(),
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,
    },
    {
      startTime: new Date(2017, 1, 28, 12, 30, 0, 0),
      endTime: new Date(2017, 1, 28, 12, 30, 0, 0),
      title: 'Sooner Availability',
      id: uuid(),
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId2,
      chairId: chairId,
    },
    {
      startTime: new Date(2017, 2, 28, 12, 30, 0, 0),
      endTime: new Date(2017, 2, 28, 12, 30, 0, 0),
      title: 'regular check',
      id: uuid(),
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,
    },
    {
      startTime: new Date(2017, 2, 29, 12, 30, 0, 0),
      endTime: new Date(2017, 2, 29, 12, 30, 0, 0),
      title: 'check',
      id: uuid(),
      accountId,
      patientId: alexPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,
    },
    {
      startTime: new Date(2017, 3, 29, 12, 30, 0, 0),
      endTime: new Date(2017, 3, 29, 12, 30, 0, 0),
      title: 'Later Availability',
      id: uuid(),
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
      startTime: new Date(2016, 2, 29, 14, 30, 0, 0),
      endTime: new Date(2016, 2, 29, 16, 30, 0, 0),

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
      startTime: new Date(2017, 1, 4, 16, 0, 0, 0),
      endTime: new Date(2016, 1, 4, 17, 0, 0, 0),

      patientId: sergeyPatientId,
      accountId: accountId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,

      isClinicConfirmed: true,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
    {
      id: uuid(),
      title: 'Sergey\'s appointment',
      startTime: new Date(2016, 2, 29, 18, 30, 0, 0),
      endTime: new Date(2016, 2, 29, 20, 30, 0, 0),
      patientId: sergeyPatientId,
      accountId: accountId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,

      isClinicConfirmed: true,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },


    {
      id: uuid(),
      title: 'Sergey\'s appointment',
      startTime: moment({hour: 23, minute: 10})._d,
      endTime: moment({hour: 23, minute: 50})._d,

      patientId: sergeyPatientId,
      accountId: accountId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,

      isClinicConfirmed: true,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
  ],

Request: [
    {
      id: uuid(),
      title: 'Sergey\'s appointment',
      startTime: moment({hour: 23, minute: 10})._d,
      endTime: moment({hour: 23, minute: 50})._d,

      patientId: sergeyPatientId,
      accountId: accountId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,

      isClinicConfirmed: false,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
    {
      accountId,
      id: uuid(),
      title: 'Justin\'s appointment',
      startTime: moment({hour: 13, minute: 10})._d,
      endTime: moment({hour: 13, minute: 50})._d,
      patientId: justinPatientId,
      serviceId: serviceId2,
      practitionerId: practitionerId2,
      chairId: chairId,

      isClinicConfirmed: false,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    }
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
      accountId,
      birthday: moment({year: 1993, month: 6, day: 15})._d,
      gender: 'male',
      language: 'English',
      insurance: {
        insurance: 'insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      firstName: 'Sergey',
      lastName: 'Skovorodnikov',
      phoneNumber: '+17782422626',
      id: sergeyPatientId,
      accountId,
      birthday: moment({year: 1983, month: 2, day: 6})._d,
      gender: 'male',
      language: 'English',
    },
    {
      firstName: 'Mark',
      lastName: 'Joseph',
      phoneNumber: '+17788654451',
      id: uuid(),
      accountId: accountId2,
      birthday: moment({year: 1996, month: 4, day: 25})._d,
      gender: 'male',
      language: 'English',
    },
    {
      firstName: 'Alex',
      lastName: 'Bashliy',
      phoneNumber: '+19782521845',
      id: alexPatientId,
      accountId,
      birthday: moment({year: 1997, month: 3, day: 4})._d,
      gender: 'male',
      language: 'English',
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
      practitioners: [ practitionerId ],
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
    {
      id: serviceId2,
      accountId: accountId,
      name: 'Lost Filling',
      practitioners: [ practitionerId ],
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
  ],

  Practitioner: [
    {
      id: practitionerId,
      accountId: accountId,
      // services: [ serviceId ],
      serviceId: serviceId,
      firstName: 'Chelsea',
      lastName: 'Mansfield',
    },
    {
      id: practitionerId2,
      accountId,
      // services: [serviceId],
      serviceId: serviceId,
      firstName: 'Perry',
      lastName: 'Cox',
    },
  ],

  TextMessage: [
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: 'from Chelsea 1',
      createdAt: new Date(2017, 0, 1, 12, 30, 0, 0),
      read: false,
      senderId: alexPatientId,
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: 'from Chelsea 2',
      createdAt: new Date(2017, 0, 6, 12, 30, 0, 0),
      read: false,
      senderId: alexPatientId,
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: '33333 Chelsea 1',
      createdAt: new Date(2017, 0, 1, 12, 30, 0, 0),
      read: false,
      senderId: alexPatientId,
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: '33333332231 Chelsea 2',
      createdAt: new Date(2017, 0, 6, 12, 30, 0, 0),
      read: false,
      senderId: alexPatientId,
    },
    {
      id: uuid(),
      patientId: justinPatientId,
      accountId,
      body: 'from Chelsea2',
      createdAt: new Date(2017, 0, 2, 12, 30, 0, 0),
      read: false,
      senderId: accountId,
    },
    {
      id: uuid(),
      patientId: justinPatientId,
      accountId,
      body: 'from Perry 1',
      createdAt: new Date(2017, 0, 3, 12, 30, 0, 0),
      read: false,
      senderId: accountId,
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: 'from Perry to alex 1',
      createdAt: new Date(2017, 0, 4, 11, 30, 0, 0),
      read: false,
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: 'from Perry to Alex 2',
      createdAt: new Date(2017, 0, 4, 12, 30, 0, 0),
      read: false,
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: 'from Perry to alex 1',
      createdAt: new Date(2017, 0, 4, 11, 30, 0, 0),
      read: false,
    },
    {
      id: uuid(),
      patientId: alexPatientId,
      accountId,
      body: 'from Perry to Alex 2',
      createdAt: new Date(2017, 0, 4, 12, 30, 0, 0),
      read: false,
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
};

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
