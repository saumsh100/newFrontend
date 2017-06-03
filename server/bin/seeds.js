
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const moment = require('moment');
const { r } = require('../config/thinky');
const faker = require('faker');
const fs = require('fs');
const seedDatabase = require('../util/seedDatabase');
const { time } = require('../util/time');
// For hashing passwords for User seeds
// TODO: pull fromm global config, cause needs to be reused with deserialization
const config = require('../config/globals');
const saltRounds = config.passwordHashSaltRounds;

import Reminder from '../fixtures/reminders';
import appointmentFixtures from '../fixtures/appointments';


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

const oneHour = 1 * 60 * 60;
const recentStartTime = r.now().add(oneHour);

const accountId = '2aeab035-b72c-4f7a-ad73-09465cbf5654';
const accountId2 = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const syncTestAccId = 'beefb035-b72c-4f7a-ad73-09465cbf5654';

const justinUserId = uuid();
const alexUserId = uuid();
const sergeyUserId = uuid();
const jdUserId = uuid();
const syncUserId = uuid();
const vstUserId = uuid();

const alexPatientId = uuid();
const alexPatientId2 = uuid();
const markPatientId = uuid();
const justinPatientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const sergeyPatientId = uuid();

const justinFamilyId = '50271221-c5ee-46b3-baf5-95df3acaa6e7';

const practitionerId = uuid();
const practitionerId2 = uuid();
const practitionerId3 = uuid();
const practitionerId4 = '4f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId5 = '5f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId6 = '6f439ff8-c55d-4423-9316-a41240c4d329';

const chairId = '7f439ff8-c55d-4423-9316-a41240c4d329';

const serviceId = uuid();
const serviceId2 = uuid();
const serviceId3 = uuid();
const cleanupServiceId = '5f439ff8-c55d-4423-9316-a41240c4d329';

const appointmentId1 = uuid();
const appointmentId2 = uuid();

const alexChatId = uuid();
const markChatId = uuid();
const justinChatId = uuid();
const sergeyChatId = uuid();

const weeklyScheduleId = uuid();
const weeklyScheduleId2 = uuid();
const weeklyScheduleId3 = '79b9ed42-b82b-4fb5-be5e-9dfded032bdf';

const hour8 = new Date(1970, 1, 1, 8, 0);
const hour5 = new Date(1970, 1, 1, 17, 0);

const justinPhoneNumber = '+17808508886';
const sergeyPhoneNumber = '+17782422626';
const alexPhoneNumber = '+19782521845';
const markPhoneNumber = '+17788654451';

const clinicPhoneNumber = '+17786558613';

const mainEnterprise = {
  id: uuid(),
  name: 'General enterprise',
};

// TODO: order of seeding matters...

const genericTextMessageSeeds = (chatId, patientPhone, clinicPhone, lastDate) => {
  const time1 = lastDate || faker.date.past();

  return [
    {
      chatId,
      to: patientPhone,
      from: clinicPhone,
      body: 'Hey! Just testing out our new messaging service.',
      createdAt: moment(time1).subtract(3, 'days')._d,
      read: true,
    },
    {
      chatId,
      to: clinicPhone,
      from: patientPhone,
      body: 'Hi there!',
      createdAt: moment(time1).subtract(2, 'days')._d,
      read: true,
    },
    {
      chatId,
      to: patientPhone,
      from: clinicPhone,
      body: 'How were you doing yesterday?',
      createdAt: moment(time1).subtract(1, 'days')._d,
      read: true,
    },
    {
      chatId,
      to: clinicPhone,
      from: patientPhone,
      body: 'I was good thanks! And you?',
      createdAt: moment(time1)._d,
      read: false,
    },
  ];
};

const initiateNumbersArray = (length) => {
  const arr = new Array(length);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = i;
  }

  return arr;
};

const largeUnreadTextMessageSeeds = (chatId, patientPhone, clinicPhone) => {
  return initiateNumbersArray(100).map((index) => {
    return {
      chatId,
      to: clinicPhone,
      from: patientPhone,
      body: index.toString(),
      createdAt: new Date(2017, 1, 2, 12, index, 0, 0),
      read: false,
    };
  });
};

const randomAppointments = [];
const randomPatients = [];
let randomMessages = [];
const randomChats = [];

for (let i = 0; i < 100; i++) {
  const id = uuid();
  const lastDate = faker.date.past();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const phoneNumber = faker.phone.phoneNumberFormat(0);
  const chatId = uuid();
  randomPatients.push({
    id,
    avatarUrl: faker.image.avatar(),
    accountId,
    firstName,
    lastName,
    email: `${firstName}.${lastName}@google.ca`,
    mobilePhoneNumber: phoneNumber,
    birthDate: faker.date.past(),
    gender: 'male',
    langauge: 'English',
    lastAppointmentDate: faker.date.past(),
    insurance: {
      insurance: 'Lay Health Insurance',
      memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
      contract: '4234rerwefsdfsd',
      carrier: 'sadasadsadsads',
      sin: 'dsasdasdasdadsasad',
    },
    isSyncedWithPMS: false,
  });

  randomMessages = randomMessages.concat(genericTextMessageSeeds(chatId, phoneNumber, clinicPhoneNumber, lastDate));


  randomChats.push({
    id: chatId,
    accountId,
    patientId: id,
    lastTextMessageDate: lastDate,
  });

  const appointmentTime = faker.date.future();

  randomAppointments.push({
    accountId,
    startDate: moment(appointmentTime).subtract(1, 'hours')._d,
    endDate: moment(appointmentTime)._d,
    patientId: id,
    serviceId,
    practitionerId,
    chairId,
    note: 'First',
  });
}

const generateDefaultServices = (_accountId) => {
  const createService = serviceData => Object.assign({}, {
    id: uuid(),
    accountId: _accountId,
  }, serviceData);

  let first = createService({
    name: 'New Patient Consultation',
    duration: 30,
  });

  if (_accountId === accountId) {
    first = {
      id: serviceId,
      accountId: _accountId,
      name: 'New Patient Consultation',
      duration: 30,
    };
  }

  return [
    first,

    createService({
      name: 'Toothache',
      duration: 30,
    }),

    createService({
      name: 'Lost Filling',
      duration: 30,
    }),

    createService({
      name: 'Emergency Appointment',
      duration: 30,
    }),

    createService({
      name: 'Regular Checkup & Cleaning',
      duration: 30,
    }),

    createService({
      name: 'Regular Consultation',
      duration: 30,
    }),

    createService({
      name: 'Child Dental Exam',
      duration: 30,
    }),
  ];
};

const generatePracServJoin = (services, _practitionerId) => {
  return services.map((service) => {
    return {
      Service_id: service.id,
      Practitioner_id: _practitionerId,
    };
  });
};

const donnaServices = generateDefaultServices(accountId);
const sunshineServices = generateDefaultServices(accountId2);

const SEEDS = {
  Enterprise: [
    mainEnterprise,
    {
      name: 'Absolute Dental',
    },
    {
      name: 'ACCESS',
    },
    {
      name: 'AFFORDABLE Dentures',
    },
  ],

  Reservation: [
    {
      // TODO: make a reservation in a certain timeslot
      accountId: accountId2,
      serviceId: cleanupServiceId,
      startDate: new Date(2017, 2, 4, 17, 30, 0),
      endDate: new Date(2017, 2, 4, 19, 30, 0),
    },
  ],

  Appointment: [
    {
      id: appointmentId1,
      accountId,
      startDate: recentStartTime,
      endDate: recentStartTime.add(oneHour),
      patientId: alexPatientId,
      serviceId: serviceId2,
      practitionerId,
      chairId,
      note: 'First',
    },
    {
      accountId,
      startDate: recentStartTime.add(1 * oneHour),
      endDate: recentStartTime.add(2 * oneHour),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
      note: 'Second',
    },
    {
      accountId,
      startDate: recentStartTime.add(23 * oneHour),
      endDate: recentStartTime.add(24 * oneHour),
      patientId: justinPatientId,
      serviceId,
      practitionerId,
      chairId,
      note: 'Third',
    },
    {
      accountId,
      startDate: recentStartTime.add(48 * oneHour),
      endDate: recentStartTime.add(49 * oneHour),
      patientId: markPatientId,
      serviceId,
      practitionerId,
      chairId,
      note: 'Fourth',
    },
    {
      id: appointmentId2,
      accountId,
      startDate: recentStartTime.add(49 * oneHour),
      endDate: recentStartTime.add(50 * oneHour),
      patientId: alexPatientId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(74 * oneHour),
      endDate: recentStartTime.add(75 * oneHour),
      patientId: justinPatientId,
      practitionerId: practitionerId2,
      serviceId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
      note: 'Kirat Appointment',
    },
    {
      accountId,
      startDate: recentStartTime.add(48 * oneHour),
      endDate: recentStartTime.add(49 * oneHour),
      patientId: markPatientId,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
      note: 'mark appointment',
    },

    // OTHER DATES

    {
      accountId,
      startDate: new Date(2017, 2, 29, 12, 30, 0, 0),
      endDate: new Date(2017, 2, 29, 12, 30, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
    },
    {
      accountId,
      startDate: new Date(2017, 1, 4, 16, 0, 0, 0),
      endDate: new Date(2016, 1, 4, 17, 0, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
      note: 'JD Appointment',
    },
    {
      accountId,
      startDate: new Date(2016, 2, 29, 18, 30, 0, 0),
      endDate: new Date(2016, 2, 29, 20, 30, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
      note: 'Sergey Appointment',
    },
    {
      accountId,
      startDate: new Date(2016, 2, 30, 18, 30, 0, 0),
      endDate: new Date(2016, 2, 30, 20, 30, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
      note: 'Justin Appointment',
    },

    // Availabilities Test
    {
      accountId: accountId2,
      practitionerId: practitionerId4,
      startDate: new Date(2017, 3, 3, 8, 0),
      endDate: new Date(2017, 3, 3, 9, 0),
      serviceId: cleanupServiceId,
      patientId: justinPatientId,
    },
    {
      accountId: accountId2,
      practitionerId: practitionerId4,
      startDate: new Date(2017, 3, 3, 9, 0),
      endDate: new Date(2017, 3, 3, 10, 0),
      serviceId: cleanupServiceId,
      patientId: justinPatientId,
    },
    {
      accountId: accountId2,
      practitionerId: practitionerId4,
      startDate: new Date(2017, 3, 3, 10, 0),
      endDate: new Date(2017, 3, 3, 11, 0),
      serviceId: cleanupServiceId,
      patientId: justinPatientId,
    },

    // For the Reminders Tests
    ...appointmentFixtures,

    // For the patientsManagementTab
    ...randomAppointments,
  ],

  Request: [
    {
      accountId,
      startDate: moment({ hour: 11, minute: 10 })._d,
      endDate: moment({ hour: 22, minute: 50 })._d,
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
      isConfirmed: false,
      isCancelled: false,
      note: 'Some note from patient here....',
    },
    {
      accountId,
      startDate: moment({hour: 13, minute: 10})._d,
      endDate: moment({hour: 13, minute: 50})._d,
      patientId: justinPatientId,
      serviceId: serviceId2,
      practitionerId: practitionerId2,
      chairId,
      isConfirmed: false,
      isCancelled: false,
      note: 'testing note 2....',
    },

    // Availabilities Test
    {
      accountId: accountId2,
      // practitionerId: practitionerId4,
      startDate: new Date(2017, 3, 3, 13, 0),
      endDate: new Date(2017, 3, 3, 14, 0),
      serviceId: cleanupServiceId,
      patientId: justinPatientId,
    },
    {
      accountId: accountId2,
      // practitionerId: practitionerId4,
      startDate: new Date(2017, 3, 3, 14, 0),
      endDate: new Date(2017, 3, 3, 15, 0),
      serviceId: cleanupServiceId,
      patientId: justinPatientId,
    },
  ],

  User: [
    {
      firstName: 'Justin',
      lastName: 'Sharp',
      username: 'justin@carecru.com',
      password: bcrypt.hashSync('justin', saltRounds),
      id: justinUserId,
      activeAccountId: accountId,
      // accounts: [accountId],
    },
    {
      firstName: 'Sergey',
      lastName: 'Skovorodnikov',
      username: 'sergey@carecru.com',
      password: bcrypt.hashSync('sergey', saltRounds),
      id: sergeyUserId,
      activeAccountId: accountId,
      // accounts: [accountId],
    },
    // account 2 user
    {
      firstName: 'Jatinder',
      lastName: 'Dhillion',
      username: 'jd@carecru.com',
      password: bcrypt.hashSync('jd', saltRounds),
      id: jdUserId,
      activeAccountId: accountId2,
      // accounts: [accountId],
    },
    {
      firstName: 'Alex',
      lastName: ' ',
      username: 'alex@carecru.com',
      password: bcrypt.hashSync('alex', saltRounds),
      id: alexUserId,
      activeAccountId: accountId,
    },
    {
      firstName: 'SyncClient',
      lastName: ' ',
      username: 'syncclient@carecru.com',
      password: bcrypt.hashSync('sync', saltRounds),
      id: syncUserId,
      activeAccountId: syncTestAccId,
    },
    {
      firstName: 'Valerij',
      lastName: 'Stukanov',
      username: 'vst@carecru.com',
      password: bcrypt.hashSync('vst', saltRounds),
      id: vstUserId,
      activeAccountId: accountId,
      enterpriseId: mainEnterprise.id,
    },
  ],

  Family: [
    {
      id: justinFamilyId,
      accountId,
      headId: justinPatientId,
    },
  ],

  Patient: [
    {
      id: justinPatientId,
      accountId,
      avatarUrl: faker.image.avatar(),
      firstName: 'Justin',
      lastName: 'Sharp',
      email: 'justin@carecru.com',
      mobilePhoneNumber: justinPhoneNumber,
      birthDate: moment({year: 1993, month: 6, day: 15})._d,
      gender: 'male',
      language: 'English',
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      status: 'Active',
      insurance: {
        insurance: 'GMC Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
      isSyncedWithPMS: false,
      familyId: justinFamilyId,
    },
    {
      id: sergeyPatientId,
      accountId,
      avatarUrl: faker.image.avatar(),
      firstName: 'Sergey',
      lastName: 'Skovorodnikov',
      email: 'sergey@carecru.com',
      mobilePhoneNumber: sergeyPhoneNumber,
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      gender: 'male',
      status: 'Active',
      language: 'English',
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
      isSyncedWithPMS: false,
    },
    {
      id: markPatientId,
      accountId,
      avatarUrl: faker.image.avatar(),
      firstName: 'Mark',
      lastName: 'Joseph',
      mobilePhoneNumber: markPhoneNumber,
      birthDate: moment({year: 1996, month: 4, day: 25})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      gender: 'male',
      status: 'Active',
      language: 'English',
      isSyncedWithPMS: false,
      familyId: justinFamilyId,
    },
    {
      id: alexPatientId,
      accountId,
      avatarUrl: faker.image.avatar(),
      firstName: 'Alex',
      lastName: 'Bashliy',
      mobilePhoneNumber: alexPhoneNumber,
      birthDate: moment({year: 1997, month: 3, day: 4})._d,
      gender: 'male',
      status: 'Active',
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      language: 'English',
      email: 'alex.bashliy@keenethics.com',
      appointmentPreference: 'both',
      isSyncedWithPMS: false,
    },
    // account 2
    {
      id: alexPatientId2,
      avatarUrl: faker.image.avatar(),
      accountId: accountId2,
      firstName: 'Alex2',
      lastName: 'Bashliy2',
      mobilePhoneNumber: alexPhoneNumber,
      birthDate: moment({year: 1997, month: 3, day: 4})._d,
      gender: 'male',
      status: 'Active',
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      language: 'English',
      email: 'alex.bashliy@keenethics.com',
      appointmentPreference: 'both',
      isSyncedWithPMS: false,
    },
    ...randomPatients,
  ],

  WeeklySchedule: [
    {
      id: weeklyScheduleId,
      accountId,
      monday: {
        isClosed: true,
      },

      saturday: {
        isClosed: true,
      },

      sunday: {
        isClosed: true,
      },
    },
    {
      id: weeklyScheduleId2,
      accountId: accountId2,
      wednesday: {
        isClosed: true,
      },

      saturday: {
        isClosed: true,
      },

      sunday: {
        isClosed: true,
      },
    },
    {
      id: weeklyScheduleId3,
      accountId,
      monday: {
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [
          {
            startTime: time(12, 0),
            endTime: time(13, 0),
          },
        ],
      },

      wednesday: {
        isClosed: true,
      },

      friday: {
        isClosed: true,
      },

      saturday: {
        isClosed: true,
      },

      sunday: {
        isClosed: true,
      },
    },
  ],

  Account: [
    {
      id: accountId,
      weeklyScheduleId,
      name: 'Donna Dental',
      address: '#202 - 404 Chesapeake Bay',
      country: 'US',
      state: 'CA',
      city: 'Los Angeles',
      zipCode: '92509',
      vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      twilioPhoneNumber: clinicPhoneNumber,
      logo: '/images/liberty_logo.png',
      bookingWidgetPrimaryColor: '#f29b12',
      enterpriseId: mainEnterprise.id,
    },
    {
      id: accountId2,
      weeklyScheduleId: weeklyScheduleId2,
      name: 'Sunshine Smiles Dental',
      street: '10405 King St.',
      country: 'CA',
      state: 'ON',
      city: 'Toronto',
      zipCode: '90210',
      twilioPhoneNumber: clinicPhoneNumber,

      logo: '/images/liberty_logo.png',
      enterpriseId: mainEnterprise.id,
      // bookingWidgetPrimaryColor: '#f29b12',
      // vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      // twilioPhoneNumber: clinicPhoneNumber,
      // logo: 'images/availabilies_sidebar_logo_2.png',
      // address: '194-105 East 3rd 7 ave Vancouver, BC Canda V1B 2C3',
      // clinicName: 'PACIFIC HEART DENTAL',
      // bookingWidgetPrimaryColor: '#0597d8',
    },
    {
      id: syncTestAccId,
      weeklyScheduleId,
      name: 'Sync Client Dental',
      street: '#101 – 1312 Random Drive',
      country: 'Canada',
      state: 'BC',
      city: 'North Vancouver',
      zipCode: '92509',
      vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      twilioPhoneNumber: clinicPhoneNumber,
      logo: '/images/beckett_dental.png',
      address: '#101 – 1312 Random Drive',
      bookingWidgetPrimaryColor: '#f29b12',
      enterpriseId: mainEnterprise.id,
    },
  ],

  Permission: [
    {
      userId: justinUserId,
      accountId,
      role: 'SUPERADMIN',
      permissions: {},
    },
    {
      userId: alexUserId,
      accountId,
      role: 'VIEWER',
      permissions: {},
    },
    {
      userId: sergeyUserId,
      accountId,
      role: 'ADMIN',
      permissions: {},
    },
    {
      userId: jdUserId,
      accountId: accountId2,
      role: 'OWNER',
      permissions: {},
    },
    {
      userId: syncUserId,
      accountId: syncTestAccId,
      role: 'OWNER',
      permissions: {},
    },
    {
      userId: vstUserId,
      accountId,
      role: 'SUPERADMIN',
      permissions: {},
    },
    {
      userId: vstUserId,
      accountId: accountId2,
      role: 'SUPERADMIN',
      permissions: {},
    },
    {
      userId: vstUserId,
      accountId: syncTestAccId,
      role: 'SUPERADMIN',
      permissions: {},
    },
  ],

  // Keep to wipe table on seed
  AuthToken: [],

  EnterprisePermission: [
    {
      userId: vstUserId,
      enterpriseId: mainEnterprise.id,
      role: 'OWNER',
    },
    {
      userId: justinUserId,
      enterpriseId: mainEnterprise.id,
      role: 'OWNER',
    },
  ],

  Invite: [
    {
      sendingUserId: justinUserId,
      accountId,
      email: 'test@email.com',
      token: uuid(),
    },
  ],

  PractitionerTimeOff: [
    // For tests!
    {
      practitionerId: practitionerId4,
      startDate: new Date(2017, 2, 19, 0, 0), // sunday (2 days)
      endDate: new Date(2017, 2, 20, 23, 59), // monday
    },
    {
      practitionerId: practitionerId4,
      startDate: new Date(2017, 2, 22, 0, 0), // wednesday (1 day)
      endDate: new Date(2017, 2, 22, 23, 59), // wednesday
    },
    {
      practitionerId: practitionerId4,
      startDate: new Date(2017, 2, 24, 0, 0), // friday (3 days)
      endDate: new Date(2017, 2, 26, 23, 59), // sunday
    },
    {
      practitionerId: practitionerId4,
      startDate: new Date(2017, 2, 28, 0, 0), // tuesday (1 day)
      endDate: new Date(2017, 2, 28, 23, 59), // tuesday
    },
  ],

  Practitioner: [
    {
      id: practitionerId,
      accountId,
      firstName: 'Chelsea',
      lastName: 'Mansfield',
      weeklyScheduleId: weeklyScheduleId2,
      isCustomSchedule: true,
      // services: [],
    },
    {
      id: practitionerId2,
      accountId,
      firstName: 'Perry',
      lastName: 'Cox',
      weeklyScheduleId: weeklyScheduleId3,
      isCustomSchedule: true,
      // services: [],
    },
    {
      id: practitionerId3,
      accountId: accountId2,
      firstName: 'Jennifer',
      lastName: 'Love-Hewitt',
      // weeklyScheduleId: weeklyScheduleId2,
      isCustomSchedule: false,
      // services: [],
    },
    {
      id: practitionerId4,
      accountId: accountId2,
      firstName: 'Chelsea',
      lastName: 'Handler',
      weeklyScheduleId: weeklyScheduleId3,
      isCustomSchedule: true,
      // services: [],
    },
    {
      id: practitionerId5,
      accountId: accountId2,
      firstName: 'Will',
      lastName: 'Ferrel',
      isCustomSchedule: false,
      // services: [],
    },
    {
      id: practitionerId6,
      accountId: accountId2,
      firstName: 'Joe',
      lastName: 'Montana',
      isCustomSchedule: false,
      // services: [],
    },
  ],

  Practitioner_Service: [
    // Chelsea's services
    {
      Practitioner_id: practitionerId,
      Service_id: serviceId,
    },
    // Perry's services
    {
      Practitioner_id: practitionerId2,
      Service_id: serviceId2,
    },

    // Availabilities Test
    {
      Practitioner_id: practitionerId3,
      Service_id: cleanupServiceId,
    },
    {
      Practitioner_id: practitionerId4,
      Service_id: cleanupServiceId,
    },

    ...generatePracServJoin(donnaServices, practitionerId),
    ...generatePracServJoin(donnaServices, practitionerId2),

    ...generatePracServJoin(sunshineServices, practitionerId3),
    ...generatePracServJoin(sunshineServices, practitionerId4),
    ...generatePracServJoin(sunshineServices, practitionerId5),
    ...generatePracServJoin(sunshineServices, practitionerId6),
  ],

  Service: [
    {
      id: cleanupServiceId,
      accountId: accountId2,
      name: 'Cleanup',
      duration: 60,
      bufferTime: 0,
      unitCost: 40,
    },

    ...donnaServices,
    ...sunshineServices,
  ],

  Chat: [
    {
      id: alexChatId,
      accountId,
      patientId: alexPatientId,
    },
    {
      id: justinChatId,
      accountId,
      patientId: justinPatientId,
    },
    {
      id: sergeyChatId,
      accountId,
      patientId: sergeyPatientId,
    },
    {
      id: markChatId,
      accountId,
      patientId: markPatientId,
    },

    ...randomChats,
  ],

  TextMessage: [
    ...genericTextMessageSeeds(alexChatId, alexPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(justinChatId, justinPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(markChatId, markPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(sergeyChatId, sergeyPhoneNumber, clinicPhoneNumber),
    ...largeUnreadTextMessageSeeds(justinChatId, justinPhoneNumber, clinicPhoneNumber),
    ...randomMessages,
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
    // account 2
    {
      accountId: accountId2,
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

  OAuth: [
    {
      provider: 'FACEBOOK',
      providerUserId: '1924667691151876',
      patientId: justinPatientId,
    },
  ],

  SyncClientVersion: [
    {
      major: 2,
      minor: 0,
      patch: 0,
      build: 0,
      url: '',
      key: '',
      secret: '',
    },
  ],

  WaitSpot: [
    {
      accountId,
      patientId: justinPatientId,
    },
    {
      accountId,
      patientId: sergeyPatientId,
      preferences: {
        weekends: false,
        evenings: false,
      },

      unavailableDays: [
        moment().toISOString(),
        moment().add(2, 'days').toISOString(),
      ],
    },
  ],

  Reminder,
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
