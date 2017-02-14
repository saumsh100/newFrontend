
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

const justinUserId = uuid();
const alexUserId = uuid();
const sergeyUserId = uuid();

const alexPatientId = uuid();
const markPatientId = uuid();
const justinPatientId = uuid();
const sergeyPatientId = uuid();

const practitionerId = uuid();
const practitionerId2 = uuid();
const chairId = uuid();

const serviceId = uuid();
const serviceId2 = uuid();

const appointmentId1 = uuid();
const appointmentId2 = uuid();

const alexChatId = uuid();
const markChatId = uuid();
const justinChatId = uuid();
const sergeyChatId = uuid();

const justinPhoneNumber = '+17808508886';
const sergeyPhoneNumber = '+17782422626';
const alexPhoneNumber = '+19782521845';
const markPhoneNumber = '+17788654451';

const clinicPhoneNumber = '+17786558613';

const genericTextMessageSeeds = (chatId, patientPhone, clinicPhone) => {
  return [
    {
      chatId,
      to: patientPhone,
      from: clinicPhone,
      body: 'Hey! Just testing out our new messaging service.',
      createdAt: new Date(2017, 0, 1, 12, 30, 0, 0),
      read: true,
    },
    {
      chatId,
      to: clinicPhone,
      from: patientPhone,
      body: 'Hi there!',
      createdAt: new Date(2017, 0, 1, 12, 45, 0, 0),
      read: true,
    },
    {
      chatId,
      to: patientPhone,
      from: clinicPhone,
      body: 'How were you doing yesterday?',
      createdAt: new Date(2017, 0, 1, 13, 30, 0, 0),
      read: true,
    },
    {
      chatId,
      to: clinicPhone,
      from: patientPhone,
      body: 'I was good thanks! And you?',
      createdAt: new Date(2017, 0, 1, 13, 45, 0, 0),
      read: false,
    },
  ];
};

const SEEDS = {
  Appointment: [
    {
      id: appointmentId1,
      accountId,
      startTime: new Date(2017, 0, 26, 10, 30, 0, 0),
      endTime: new Date(2017, 0, 26, 11, 30, 0, 0),
      patientId: alexPatientId,
      serviceId: serviceId2,
      practitionerId,
      chairId,
    },
    {
      accountId,
      startTime: new Date(2017, 0, 26, 12, 30, 0, 0),
      endTime: new Date(2017, 0, 26, 13, 30, 0, 0),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
    },
    {
      accountId,
      startTime: new Date(2017, 1, 28, 12, 30, 0, 0),
      endTime: new Date(2017, 1, 28, 12, 30, 0, 0),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
    },
    {
      accountId,
      startTime: new Date(2017, 2, 28, 12, 30, 0, 0),
      endTime: new Date(2017, 2, 28, 12, 30, 0, 0),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
    },
    {
      accountId,
      startTime: new Date(2017, 2, 29, 12, 30, 0, 0),
      endTime: new Date(2017, 2, 29, 12, 30, 0, 0),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
    },
    {
      id: appointmentId2,
      accountId,
      startTime: new Date(2017, 3, 29, 12, 30, 0, 0),
      endTime: new Date(2017, 3, 29, 12, 30, 0, 0),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
    },
    {
      accountId,
      startTime: new Date(2016, 2, 29, 14, 30, 0, 0),
      endTime: new Date(2016, 2, 29, 16, 30, 0, 0),
      patientId: justinPatientId,
      practitionerId: practitionerId2,
      serviceId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
    {
      accountId,
      startTime: new Date(2017, 1, 4, 16, 0, 0, 0),
      endTime: new Date(2016, 1, 4, 17, 0, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
    {
      accountId,
      startTime: new Date(2016, 2, 29, 18, 30, 0, 0),
      endTime: new Date(2016, 2, 29, 20, 30, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
    {
      accountId,
      startTime: new Date(2016, 2, 30, 18, 30, 0, 0),
      endTime: new Date(2016, 2, 30, 20, 30, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
  ],

  Request: [
    {
      accountId: accountId,
      id: uuid(),
      title: 'Sergey\'s appointment',
      startTime: moment({hour: 23, minute: 10})._d,
      endTime: moment({hour: 23, minute: 50})._d,

      patientId: sergeyPatientId,
      serviceId: serviceId,
      practitionerId: practitionerId,
      chairId: chairId,

      isClinicConfirmed: false,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
    },
    {
      accountId: accountId,
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
      username: 'justin@carecru.com',
      password: bcrypt.hashSync('justin', saltRounds),
      id: justinUserId,
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
      id: justinPatientId,
      accountId,
      firstName: 'Justin',
      lastName: 'Sharp',
      phoneNumber: justinPhoneNumber,
      birthday: moment({year: 1993, month: 6, day: 15})._d,
      gender: 'male',
      language: 'English',
      status: 'Active',
      insurance: {
        insurance: 'insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id: sergeyPatientId,
      accountId,
      firstName: 'Sergey',
      lastName: 'Skovorodnikov',
      phoneNumber: sergeyPhoneNumber,
      birthday: moment({year: 1983, month: 2, day: 6})._d,
      gender: 'male',
      status: 'Active',
      language: 'English',
    },
    {
      id: markPatientId,
      firstName: 'Mark',
      lastName: 'Joseph',
      phoneNumber: markPhoneNumber,
      accountId: accountId2,
      birthday: moment({year: 1996, month: 4, day: 25})._d,
      gender: 'male',
      status: 'Active',
      language: 'English',
    },
    {
      id: alexPatientId,
      accountId,
      firstName: 'Alex',
      lastName: 'Bashliy',
      phoneNumber: alexPhoneNumber,
      birthday: moment({year: 1997, month: 3, day: 4})._d,
      gender: 'male',
      status: 'Active',
      language: 'English',
      email: 'alex.bashliy@keenethics.com',
      appointmentPreference: 'both',
    },
  ],

  Account: [
    {
      name: 'Beckett Dental',
      vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      smsPhoneNumber: clinicPhoneNumber,
      id: accountId,
    },
  ],

  Permission: [
    {
      id: uuid(),
      userId: justinUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
    },
    {
      id: uuid(),
      userId: alexUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
    },
    {
      id: uuid(),
      userId: sergeyUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
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

  Service: [
    {
      id: serviceId,
      accountId,
      name: 'Routine Checkup',
      allowedPractitioners: [ practitionerId ],
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
    {
      id: serviceId2,
      accountId,
      name: 'Another service',
      allowedPractitioners: [ practitionerId2 ],
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
    {
      accountId,
      name: 'Lost Filling',
      allowedPractitioners: [ practitionerId, practitionerId2 ],
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      customCosts: {},
    },
  ],

  Chat: [
    {
      accountId,
      patientId: alexPatientId,
    },
    {
      accountId,
      patientId: justinPatientId,
    },
    {
      accountId,
      patientId: sergeyPatientId,
    },
    {
      accountId,
      patientId: markPatientId,
    },
  ],

  TextMessage: [
    ...genericTextMessageSeeds(alexChatId, alexPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(justinChatId, justinPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(markChatId, markPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(sergeyChatId, sergeyPhoneNumber, clinicPhoneNumber),
  ],

  Chair: [
    {
      id: chairId,
      accountId,
      name: 'Chair 1',
      description: '',
    },
    {
      accountId,
      name: 'Chair 2',
      description: '',
    },
  ],

  Token: [
    {
      appointmentId: appointmentId1,
    },
    {
      appointmentId: appointmentId2,
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
