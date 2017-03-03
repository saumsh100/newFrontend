
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const moment = require('moment');
const { r } = require('../config/thinky');
const fs = require('fs');
const seedDatabase = require('../util/seedDatabase');
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

const oneHour = 1 * 60 * 60;
const recentStartTime = r.now().add(oneHour);

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

const weeklyScheduleId = uuid();

const mondayHoursId = uuid();
const tuesdayHoursId = uuid();
const wednesdayHoursId = uuid();
const thursdayHoursId = uuid();
const fridayHoursId = uuid();
const saturdayHoursId = uuid();
const sundayHoursId = uuid();

const hour8 = new Date(1970, 1, 1, 8, 0);
const hour5 = new Date(1970, 1, 1, 17, 0);

const justinPhoneNumber = '+17808508886';
const sergeyPhoneNumber = '+17782422626';
const alexPhoneNumber = '+19782521845';
const markPhoneNumber = '+17788654451';

const clinicPhoneNumber = '+17786558613';

// TODO: order of seeding matters...

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

const SEEDS = {
  Appointment: [
    {
      id: appointmentId1,
      accountId,
      startTime: recentStartTime,
      endTime: recentStartTime.add(oneHour),
      patientId: alexPatientId,
      serviceId: serviceId2,
      practitionerId,
      chairId,
      note: 'First',
    },
    {
      accountId,
      startTime: recentStartTime.add(oneHour),
      endTime: recentStartTime.add(2 * oneHour),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
      note: 'Second',
    },
    {
      accountId,
      startTime: recentStartTime.add(23 * oneHour),
      endTime: recentStartTime.add(24 * oneHour),
      patientId: justinPatientId,
      serviceId,
      practitionerId,
      chairId,
      note: 'Third',
    },
    {
      accountId,
      startTime: recentStartTime.add(48 * oneHour),
      endTime: recentStartTime.add(49 * oneHour),
      patientId: markPatientId,
      serviceId,
      practitionerId,
      chairId,
      note: 'Fourth',
    },
    {
      id: appointmentId2,
      accountId,
      startTime: recentStartTime.add(49 * oneHour),
      endTime: recentStartTime.add(50 * oneHour),
      patientId: alexPatientId,
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startTime: recentStartTime.add(72 * oneHour),
      endTime: recentStartTime.add(73 * oneHour),
      patientId: justinPatientId,
      practitionerId: practitionerId2,
      serviceId,
      chairId,
      isPatientConfirmed: true,
      isSyncedWithPMS: true,
      isCancelled: false,
      note: 'Sixth',
    },

    // OTHER DATES

    {
      accountId,
      startTime: new Date(2017, 2, 29, 12, 30, 0, 0),
      endTime: new Date(2017, 2, 29, 12, 30, 0, 0),
      patientId: sergeyPatientId,
      serviceId,
      practitionerId,
      chairId,
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
      accountId,
      startTime: moment({hour: 23, minute: 10})._d,
      endTime: moment({hour: 23, minute: 50})._d,
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
      startTime: moment({hour: 13, minute: 10})._d,
      endTime: moment({hour: 13, minute: 50})._d,
      patientId: justinPatientId,
      serviceId: serviceId2,
      practitionerId: practitionerId2,
      chairId,
      isConfirmed: false,
      isCancelled: false,
      note: 'testing note 2....',
    },
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
      email: 'justin@carecru.com',
      phoneNumber: justinPhoneNumber,
      birthDate: moment({year: 1993, month: 6, day: 15})._d,
      gender: 'male',
      language: 'English',
      status: 'Active',
      insurance: {
        insurance: 'GMC Health Insurance',
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
      email: 'sergey@carecru.com',
      phoneNumber: sergeyPhoneNumber,
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      gender: 'male',
      status: 'Active',
      language: 'English',
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id: markPatientId,
      accountId,
      firstName: 'Mark',
      lastName: 'Joseph',
      phoneNumber: markPhoneNumber,
      birthDate: moment({year: 1996, month: 4, day: 25})._d,
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
      birthDate: moment({year: 1997, month: 3, day: 4})._d,
      gender: 'male',
      status: 'Active',
      language: 'English',
      email: 'alex.bashliy@keenethics.com',
      appointmentPreference: 'both',
    },
  ],

  /*DailySchedule: [
    {
      id: mondayHoursId,
      isClosed: true,
      startTime: hour8,
      endTime: hour5,
    },
    {
      id: tuesdayHoursId,
      isClosed: false,
      startTime: hour8,
      endTime: hour5,
    },
    {
      id: wednesdayHoursId,
      isClosed: false,
      startTime: hour8,
      endTime: hour5,
    },
    {
      id: thursdayHoursId,
      isClosed: false,
      startTime: hour8,
      endTime: hour5,
    },
    {
      id: fridayHoursId,
      isClosed: false,
      startTime: hour8,
      endTime: hour5,
    },
    {
      id: saturdayHoursId,
      isClosed: true,
      startTime: hour8,
      endTime: hour5,
    },
    {
      id: sundayHoursId,
      isClosed: true,
      startTime: hour8,
      endTime: hour5,
    },
  ],*/

  WeeklySchedule: [
    {
      id: weeklyScheduleId,
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
  ],

  Account: [
    {
      id: accountId,
      weeklyScheduleId,
      name: 'Beckett Dental',
      street: '354 Beach Ave',
      country: 'United States',
      state: 'California',
      city: 'Riverside',
      zipCode: '92509',
      vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      smsPhoneNumber: clinicPhoneNumber,
      logo: 'images/availabilies_sidebar_logo_2.png',
      address: '194-105 East 3rd 7 ave Vancouver, BC Canda V1B 2C3',
      clinicName: 'PACIFIC HEART DENTAL',
      bookingWidgetPrimaryColor: '#0597d8',
    },
  ],

  Permission: [
    {
      userId: justinUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
    },
    {
      userId: alexUserId,
      accountId,
      role: 'OWNER',
      permissions: {},
    },
    {
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
  ],

  TextMessage: [
    ...genericTextMessageSeeds(alexChatId, alexPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(justinChatId, justinPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(markChatId, markPhoneNumber, clinicPhoneNumber),
    ...genericTextMessageSeeds(sergeyChatId, sergeyPhoneNumber, clinicPhoneNumber),
    ...largeUnreadTextMessageSeeds(justinChatId, justinPhoneNumber, clinicPhoneNumber),
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
