
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const moment = require('moment');
const { r } = require('../config/thinky');
const faker = require('Faker');
const fs = require('fs');
const seedDatabase = require('../util/seedDatabase');
const { time } = require('../util/time');
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

const accountId = '2aeab035-b72c-4f7a-ad73-09465cbf5654';
const accountId2 = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const syncTestAccId = 'beefb035-b72c-4f7a-ad73-09465cbf5654';

const justinUserId = uuid();
const alexUserId = uuid();
const sergeyUserId = uuid();
const jdUserId = uuid();
const syncUserId = uuid();

const alexPatientId = uuid();
const alexPatientId2 = uuid();
const markPatientId = uuid();
const justinPatientId = uuid();
const sergeyPatientId = uuid();

const practitionerId = uuid();
const practitionerId2 = uuid();
const practitionerId3 = uuid();
const practitionerId4 = '4f439ff8-c55d-4423-9316-a41240c4d329';

const chairId = uuid();

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
      startDate: recentStartTime.add(50 * oneHour),
      endDate: recentStartTime.add(51 * oneHour),
      patientId: "e8950859-6903-426f-9b52-efabd483f8dd",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(52 * oneHour),
      endDate: recentStartTime.add(54 * oneHour),
      patientId: "c7a04662-35be-448c-bb63-83f94713b9b5",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(53 * oneHour),
      endDate: recentStartTime.add(55 * oneHour),
      patientId: "2ac72466-5c52-4a14-8f60-4341516b7d0a",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(54 * oneHour),
      endDate: recentStartTime.add(55 * oneHour),
      patientId: "b6ee696e-41c9-42bb-886c-0637ec54896f",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(55 * oneHour),
      endDate: recentStartTime.add(56 * oneHour),
      patientId: "9917e3f5-c558-44fa-8f32-e3cd1adde9ab",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(57 * oneHour),
      endDate: recentStartTime.add(58 * oneHour),
      patientId: "d729f619-34d7-4979-8970-327940541053",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(58 * oneHour),
      endDate: recentStartTime.add(59 * oneHour),
      patientId: "05415c97-c38a-4ad0-867a-87ee561cd173",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(59 * oneHour),
      endDate: recentStartTime.add(60 * oneHour),
      patientId: "4b0d43f7-db99-4f0d-8d20-9210893d4553",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(60 * oneHour),
      endDate: recentStartTime.add(61 * oneHour),
      patientId: "4b0d43f7-db99-4f0d-8d20-9210893d4553",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(62 * oneHour),
      endDate: recentStartTime.add(63 * oneHour),
      patientId: "374e2080-eefe-4f8d-952c-006b2404b0e6",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(64 * oneHour),
      endDate: recentStartTime.add(65 * oneHour),
      patientId: "dff8be6c-a1af-43f6-b75b-46e55723a00d",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(66 * oneHour),
      endDate: recentStartTime.add(67 * oneHour),
      patientId: "8bcfd355-a063-4cd0-a7a0-4435a0609392",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(67 * oneHour),
      endDate: recentStartTime.add(68 * oneHour),
      patientId: "d7d646b4-9e89-4209-8309-e45595e359bf",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },{
      accountId,
      startDate: recentStartTime.add(69 * oneHour),
      endDate: recentStartTime.add(70 * oneHour),
      patientId: "a96e1d9a-533e-4df7-8e34-3bfe8e34ee53",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(71 * oneHour),
      endDate: recentStartTime.add(72 * oneHour),
      patientId: "ce58576c-574d-4b9c-9797-985d30d3d16f",
      serviceId,
      practitionerId,
      chairId,
      note: 'Fifth',
    },
    {
      accountId,
      startDate: recentStartTime.add(73 * oneHour),
      endDate: recentStartTime.add(74 * oneHour),
      patientId: "5d16aefd-0695-4bee-a44e-1f67f16ede62",
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
    }
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
      firstName: 'Mark',
      lastName: 'Joseph',
      phoneNumber: markPhoneNumber,
      birthDate: moment({year: 1996, month: 4, day: 25})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      gender: 'male',
      status: 'Active',
      language: 'English',
      isSyncedWithPMS: false,
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
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      language: 'English',
      email: 'alex.bashliy@keenethics.com',
      appointmentPreference: 'both',
      isSyncedWithPMS: false,
    },
    // account 2
    {
      id: alexPatientId2,
      accountId: accountId2,
      firstName: 'Alex2',
      lastName: 'Bashliy2',
      phoneNumber: alexPhoneNumber,
      birthDate: moment({year: 1997, month: 3, day: 4})._d,
      gender: 'male',
      status: 'Active',
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      language: 'English',
      email: 'alex.bashliy@keenethics.com',
      appointmentPreference: 'both',
      isSyncedWithPMS: false,
    },
    {
      id:"c7a04662-35be-448c-bb63-83f94713b9b5",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Giavani",
      lastName:"Lidington",
      email:"glidington0@nhs.uk",
      gender:"Male",
      phoneNumber:"420-(903)866-7999",
      language:"Hungarian",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"2ac72466-5c52-4a14-8f60-4341516b7d0a",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Sibelle",
      lastName:"McCamish",
      email:"smccamish1@chicagotribune.com",
      gender:"Female",
      phoneNumber:"380-(402)435-3833",
      language:"Malayalam",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"b6ee696e-41c9-42bb-886c-0637ec54896f",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Amber",
      lastName:"Quincee",
      email:"aquincee2@goo.ne.jp",
      gender:"Female",
      phoneNumber:"63-(783)921-5707",
      language:"Bosnian",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"9917e3f5-c558-44fa-8f32-e3cd1adde9ab",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Nannie",
      lastName:"Lundbech",
      email:"nlundbech3@howstuffworks.com",
      gender:"Female",
      phoneNumber:"48-(373)231-0455",
      language:"Bosnian",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"d729f619-34d7-4979-8970-327940541053",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Barret",
      lastName:"Fitchett",
      email:"bfitchett4@google.es",
      gender:"Male",
      phoneNumber:"7-(572)971-8381",
      language:"Hebrew",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"05415c97-c38a-4ad0-867a-87ee561cd173",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Claybourne",
      lastName:"Grimsdale",
      email:"cgrimsdale5@angelfire.com",
      gender:"Male",
      phoneNumber:"995-(194)950-2203",
      language:"Pashto",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"4b0d43f7-db99-4f0d-8d20-9210893d4553",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Cross",
      lastName:"Grenkov",
      email:"cgrenkov6@google.cn",
      gender:"Male",
      phoneNumber:"55-(848)778-9962",
      language:"Czech",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"374e2080-eefe-4f8d-952c-006b2404b0e6",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Dorthea",
      lastName:"Strewthers",
      email:"dstrewthers7@sbwire.com",
      gender:"Female",
      phoneNumber:"502-(500)473-8915",
      language:"Tetum",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"dff8be6c-a1af-43f6-b75b-46e55723a00d",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Lavina",
      lastName:"Tipping",
      email:"ltipping8@youtube.com",
      gender:"Female",
      phoneNumber:"374-(668)347-3210",
      language:"Albanian",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"8bcfd355-a063-4cd0-a7a0-4435a0609392",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Gill",
      lastName:"Ambrosoli",
      email:"gambrosoli9@cbsnews.com",
      gender:"Female",
      phoneNumber:"61-(142)394-4200",
      language:"Kazakh",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"d7d646b4-9e89-4209-8309-e45595e359bf",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Valerie",
      lastName:"Presdie",
      email:"vpresdiea@cocolog-nifty.com",
      gender:"Female",
      phoneNumber:"86-(146)244-3303",
      language:"Korean",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"a96e1d9a-533e-4df7-8e34-3bfe8e34ee53",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Kerrin",
      lastName:"Borrel",
      email:"kborrelb@dmoz.org",
      gender:"Female",
      phoneNumber:"86-(768)393-8626",
      language:"Latvian",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"ce58576c-574d-4b9c-9797-985d30d3d16f",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Margalit",
      lastName:"Kettleson",
      email:"mkettlesonc@unc.edu",
      gender:"Female",
      phoneNumber:"351-(336)922-8509",
      language:"Hebrew",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"5d16aefd-0695-4bee-a44e-1f67f16ede62",
      accountId,
      isSyncedWithPMS: false,
      firstName:"Roderick",
      lastName:"Chazelle",
      email:"rchazelled@mashable.com",
      gender:"Male",
      phoneNumber:"57-(542)199-5799",
      language:"Amharic",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
    {
      id:"e8950859-6903-426f-9b52-efabd483f8dd",
      accountId,
      isSyncedWithPMS: false,
      firstName: "Seamus",
      lastName: "Penvarden",
      email: "spenvardene@php.net",
      gender: "Male",
      phoneNumber: "249-(286)574-7400",
      langauge: "Hebrew",
      birthDate: moment({year: 1983, month: 2, day: 6})._d,
      lastAppointmentDate: new Date(2017, 3, 3, 15, 0),
      insurance: {
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      },
    },
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
      accountId,
      thursday: {
        endTime: time(14, 30),
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
      street: '#101 – 1312 Marine Drive',
      country: 'Canada',
      state: 'BC',
      city: 'North Vancouver',
      zipCode: '92509',
      vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      smsPhoneNumber: clinicPhoneNumber,
      logo: '/images/beckett_dental.png',
      address: '#101 – 1312 Marine Drive',
      bookingWidgetPrimaryColor: '#f29b12',
    },
    {
      id: accountId2,
      weeklyScheduleId: weeklyScheduleId2,
      name: 'Liberty Dental',
      street: 'Street Adress',
      country: 'US',
      state: 'CA',
      city: 'Los Angeles',
      zipCode: '90210',
      // vendastaId: 'UNIQUE_CUSTOMER_IDENTIFIER',
      // smsPhoneNumber: clinicPhoneNumber,
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
      smsPhoneNumber: clinicPhoneNumber,
      logo: '/images/beckett_dental.png',
      address: '#101 – 1312 Random Drive',
      bookingWidgetPrimaryColor: '#f29b12',
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
      firstName: 'Mark',
      lastName: 'Joseph',
      // weeklyScheduleId: weeklyScheduleId2,
      isCustomSchedule: false,
      // services: [],
    },
    {
      id: practitionerId4,
      accountId: accountId2,
      firstName: 'Justin',
      lastName: 'Sharp',
      weeklyScheduleId: weeklyScheduleId3,
      isCustomSchedule: true,
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
    // Mark's services
    {
      Practitioner_id: practitionerId3,
      Service_id: cleanupServiceId,
    },
    // Justin's services
    {
      Practitioner_id: practitionerId4,
      Service_id: cleanupServiceId,
    },
  ],

  Service: [
    {
      id: serviceId,
      accountId,
      name: 'Routine Checkup',
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      // See Practitioner_Service, but essentially it is this...
      // practitioners: [ practitionerId ],
    },
    {
      id: serviceId2,
      accountId,
      name: 'Another service',
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
      // See Practitioner_Service, but essentially it is this...
      // practitioners: [ practitionerId2 ],
    },
    {
      accountId,
      name: 'Lost Filling',
      duration: 30,
      bufferTime: 0,
      unitCost: 40,
    },
    {
      id: cleanupServiceId,
      accountId: accountId2,
      name: 'Cleanup',
      duration: 60,
      bufferTime: 0,
      unitCost: 40,
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

  SyncClientVersion: [
    {
      version: 2.0,
      url: 'http://carecru.dev:8080/api/updater/download',
      key: '',
      secret: '',
      build: 1,
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
