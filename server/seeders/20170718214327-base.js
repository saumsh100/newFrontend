
const faker = require('faker');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const procedures = require('../fixtures/procedures/procedureDump.json');

// eslint-disable-next-line
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const timeWithZone = (hours, minutes, timezone) =>
  moment(new Date(1970, 1, 0, hours, minutes))
    .tz(timezone)
    .toDate();

const passwordHashSaltRounds = 10;

const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';
const accountId2 = '72954241-3652-4792-bae5-5bfed53d37b7';
const managerPermissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';
const ownerPermissionId = '74d4e661-1155-4494-8fdb-c4ec0ddf804d';
const superAdminPermissionId = '64d4e661-1155-4494-8fdb-c4ec0ddf804d';
const managerUserId = '6668f250-e8c9-46e3-bfff-0249f1eec6b8';
const ownerUserId = '5668f250-e8c9-46e3-bfff-0249f1eec6b8';
const superAdminUserId = '4668f250-e8c9-46e3-bfff-0249f1eec6b8';
const weeklyScheduleId = '79b9ed42-b82b-4fb5-be5e-9dfded032bdf';
const weeklyScheduleId2 = '89b9ed42-b82b-4fb5-be5e-9dfded032bdf';
const clinicPhoneNumber = '+17786558613';
const addressId = uuid();
const addressId2 = uuid();
const timezone = 'America/Vancouver';
const startTime = timeWithZone(8, 0, timezone);
const endTime = timeWithZone(17, 0, timezone);

const ROLES = {
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  SUPERADMIN: 'SUPERADMIN',
};

const enterprise = {
  id: enterpriseId,
  name: 'Test Enterprise',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  plan: 'ENTERPRISE',
};

const account = {
  id: accountId,
  vendastaId: 'Liberty Chiropractic',
  enterpriseId,
  addressId,
  name: 'Test Account',
  twilioPhoneNumber: clinicPhoneNumber,
  lastSyncDate: '2017-11-17T20:20:30.932Z',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  canSendReviews: false,
  timezone,
};

const address = {
  id: addressId,
  city: 'Belgrade',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  timezone,
};

const account2 = {
  id: accountId2,
  vendastaId: 'Liberty Chiropractic',
  enterpriseId,
  addressId: addressId2,
  contactEmail: 'info@libertychiropractic.ca',
  website: 'http://carecru.ngrok.io/tests/sites/reviews.html',
  googlePlaceId: 'ChIJP-dQSDEioFMRBpVTwZ2_h1o',
  facebookUrl: 'https://www.facebook.com/libertychiroedm/',
  bookingWidgetPrimaryColor: '#4D3069',
  name: 'Liberty Chiropractic',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  phoneNumber: '+17808508886',
  canSendReviews: true,
  twilioPhoneNumber: '+15874003884',
  timezone,
};

const address2 = {
  id: addressId2,
  city: 'Edmonton',
  state: 'AB',
  street: '10204 112th St.',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  timezone,
};

const managerPermission = {
  id: managerPermissionId,
  role: ROLES.MANAGER,
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const ownerPermission = {
  id: ownerPermissionId,
  role: ROLES.OWNER,
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const superAdminPermission = {
  id: superAdminPermissionId,
  role: ROLES.SUPERADMIN,
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const managerUser = {
  id: managerUserId,
  enterpriseId,
  activeAccountId: accountId,
  permissionId: managerPermissionId,
  username: 'manager@test.com',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  firstName: 'Harvey',
  lastName: 'Dentest',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const ownerUser = {
  id: ownerUserId,
  enterpriseId,
  activeAccountId: accountId,
  permissionId: ownerPermissionId,
  username: 'owner@test.com',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  firstName: 'Harvey',
  lastName: 'Dentest',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const superAdminUser = {
  id: superAdminUserId,
  enterpriseId,
  activeAccountId: accountId,
  permissionId: superAdminPermissionId,
  username: 'superadmin@test.com',
  password: bcrypt.hashSync('!@CityOfBudaTest#$', passwordHashSaltRounds),
  firstName: 'Harvey',
  lastName: 'Dentest',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const superAdminUser2 = {
  id: '83fd6b53-83b1-425a-9c6b-ec120c0e91ae',
  enterpriseId,
  activeAccountId: accountId,
  permissionId: superAdminPermissionId,
  username: 'justin@carecru.com',
  password: bcrypt.hashSync('justin', passwordHashSaltRounds),
  firstName: 'Justin',
  lastName: 'Sharp',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const dailyScheduleTemplate = {
  startTime,
  endTime,
  createdAt: new Date(),
  updatedAt: new Date(),
  accountId,
};

const mondayId = uuid();
const tuesdayId = uuid();
const wednesdayId = uuid();
const thursdayId = uuid();
const fridayId = uuid();
const saturdayId = uuid();
const sundayId = uuid();

const mondayId2 = uuid();
const tuesdayId2 = uuid();
const wednesdayId2 = uuid();
const thursdayId2 = uuid();
const fridayId2 = uuid();
const saturdayId2 = uuid();
const sundayId2 = uuid();

const devDailySchedules = [
  {
    ...dailyScheduleTemplate,
    id: mondayId,
  },
  {
    ...dailyScheduleTemplate,
    id: tuesdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: wednesdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: thursdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: fridayId,
  },
  {
    ...dailyScheduleTemplate,
    id: saturdayId,
  },
  {
    ...dailyScheduleTemplate,
    id: sundayId,
  },
  {
    ...dailyScheduleTemplate,
    id: mondayId2,
  },
  {
    ...dailyScheduleTemplate,
    id: tuesdayId2,
  },
  {
    ...dailyScheduleTemplate,
    id: wednesdayId2,
  },
  {
    ...dailyScheduleTemplate,
    id: thursdayId2,
  },
  {
    ...dailyScheduleTemplate,
    id: fridayId2,
  },
  {
    ...dailyScheduleTemplate,
    id: saturdayId2,
  },
  {
    ...dailyScheduleTemplate,
    id: sundayId2,
  },
];

const weeklySchedule1 = {
  id: weeklyScheduleId,
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  mondayId,
  tuesdayId,
  wednesdayId,
  thursdayId,
  fridayId,
  saturdayId,
  sundayId,
  accountId,
};

const weeklySchedule2 = {
  id: weeklyScheduleId2,
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  mondayId: mondayId2,
  tuesdayId: tuesdayId2,
  wednesdayId: wednesdayId2,
  thursdayId: thursdayId2,
  fridayId: fridayId2,
  saturdayId: saturdayId2,
  sundayId: sundayId2,
  accountId: accountId2,
};

module.exports = {
  // eslint-disable-next-line
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Enterprises', [enterprise]);

    await queryInterface.bulkInsert('Addresses', [address, address2]);

    await queryInterface.bulkInsert('Accounts', [account, account2]);

    await queryInterface.bulkInsert('DailySchedules', devDailySchedules);

    await queryInterface.bulkInsert('WeeklySchedules', [
      weeklySchedule1,
      weeklySchedule2,
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "Accounts" SET "weeklyScheduleId" = '${weeklyScheduleId}' WHERE "id" = '${accountId}';`,
    );

    await queryInterface.sequelize.query(
      `UPDATE "Accounts" SET "weeklyScheduleId" = '${weeklyScheduleId2}' WHERE "id" = '${accountId2}';`,
    );

    await queryInterface.bulkInsert('Permissions', [
      managerPermission,
      ownerPermission,
      superAdminPermission,
    ]);

    await queryInterface.bulkInsert('Users', [
      managerUser,
      ownerUser,
      superAdminUser,
      superAdminUser2,
    ]);

    const families = [];
    const patients = [];
    const deliveredProcedures = [];

    // Create some families
    for (let i = 0; i < 25; i += 1) {
      families.push({
        id: uuid(),
        pmsId: uuid(),
        accountId,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    for (let i = 0; i < 100; i += 1) {
      const firstName = faker.name.firstName('male');
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumber('+1##########');
      const id = uuid();
      const pmsId = uuid();
      const familyPosition = i % families.length;

      if (!families[familyPosition].headId) {
        families[familyPosition].headId = id;
      }

      patients.push({
        id,
        pmsId,
        accountId,
        familyId: i > 5 ? families[familyPosition].id : null,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
        cellPhoneNumber: phoneNumber,
        birthDate: faker.date.between(
          moment().subtract(100, 'years'),
          moment(),
        ),
        gender: 'male',
        language: 'English',
        insurance: JSON.stringify({
          insurance: 'Lay Health Insurance',
          memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
          contract: '4234rerwefsdfsd',
          carrier: 'sadasadsadsads',
          sin: 'dsasdasdasdadsasad',
        }),
        lastHygieneDate: faker.date.past(),
        lastRecallDate: faker.date.past(),
        createdAt: faker.date.past(),
        pmsCreatedAt: faker.date.past(),
        updatedAt: new Date(),
      });

      const primaryInsuranceAmount = faker.finance.amount(0, 200, 2);

      const secondaryInsuranceAmount = faker.finance.amount(0, 200, 2);

      const patientAmount = faker.finance.amount(0, 200, 2);

      const discountAmount = faker.finance.amount(0, 200, 2);

      const totalAmount =
        parseFloat(patientAmount) +
        parseFloat(secondaryInsuranceAmount) +
        parseFloat(primaryInsuranceAmount) -
        parseFloat(discountAmount);

      let code = Math.floor(Math.random() * procedures.length);

      while (procedures[code].code.match(/^d/i)) {
        code = Math.floor(Math.random() * procedures.length);
      }

      deliveredProcedures.push({
        id: uuid(),
        accountId,
        primaryInsuranceAmount,
        secondaryInsuranceAmount,
        patientAmount,
        discountAmount,
        totalAmount,
        units: 1.0,
        createdAt: faker.date.past(),
        entryDate: faker.date.past(),
        updatedAt: new Date(),
        patientId: id,
        procedureCode: procedures[code].code,
        procedureCodeId: `CDA-${procedures[code].code}`,
      });
    }

    for (let i = 0; i < 30; i += 1) {
      const firstName = faker.name.firstName('female');
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumber('+1##########');
      const familyPosition = i % families.length;
      patients.push({
        id: uuid(),
        pmsId: uuid(),
        accountId,
        familyId: i > 5 ? families[familyPosition].id : null,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
        cellPhoneNumber: phoneNumber,
        birthDate: faker.date.between(
          moment().subtract(100, 'years'),
          moment(),
        ),
        gender: 'female',
        language: 'English',
        insurance: JSON.stringify({
          insurance: 'Lay Health Insurance',
          memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
          contract: '4234rerwefsdfsd',
          carrier: 'sadasadsadsads',
          sin: 'dsasdasdasdadsasad',
        }),
        dueForHygieneDate: faker.date.past(),
        dueForRecallExamDate: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    const mobilePhoneNumber = faker.phone.phoneNumber('+1##########');

    patients.push({
      id: uuid(),
      accountId,
      firstName: 'Testy',
      lastName: 'Testerson',
      email: 'testy.testerson@google.ca',
      mobilePhoneNumber,
      cellPhoneNumber: mobilePhoneNumber,
      birthDate: faker.date.between(moment().subtract(100, 'years'), moment()),
      gender: 'female',
      language: 'English',
      insurance: JSON.stringify({
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      }),
      dueForHygieneDate: moment()
        .add(1, 'months')
        .toISOString(),
      dueForRecallExamDate: moment()
        .add(1, 'months')
        .toISOString(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Families', families);

    await queryInterface.bulkInsert('Patients', patients);

    await queryInterface.bulkInsert('DeliveredProcedures', deliveredProcedures);

    const practitionerIds = [
      '19b851d4-5730-41ad-8b85-b3c5f2ee91ff',
      '96eadc09-4c70-4259-9534-c7e112e3b2d6',
      '4c8f5a0b-4a50-4ea1-af22-46362c14833b',
      '714b1556-a077-4cd6-8f7b-aadf0bd163d1',
      '6ecc3d1d-2d8c-4763-baac-f7e3c0c203d5',
      '12594869-c80b-43bb-8e2b-eeae7aead5e0',
      '0200e115-edbd-45f0-a907-8c40fff357e2',
      'f334b97f-21ec-42ad-828e-599bf4c99b1d',
      '69281845-f523-4848-8368-159fb575bd7d',
      'f059e1cd-5593-46ec-90b6-af14dd9c974e',
    ];

    const practitioners = practitionerIds.map(id => ({
      id,
      accountId,
      type: 'Hygienist',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Practitioners', practitioners);

    const appointments = [];
    for (let i = 0; i < patients.length; i += 2) {
      const patient = patients[i];
      const appointment = {
        id: uuid(),
        accountId,
        practitionerId: practitioners[Math.floor(Math.random() * 10) + 0].id,
        patientId: patient.id,
        startDate: moment()
          .add('-30', 'days')
          .add('-5', 'minutes')
          .toISOString(),
        endDate: moment()
          .add('-30', 'days')
          .add('30', 'minutes')
          .toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      appointments.push(appointment);
    }

    // await queryInterface.bulkInsert('Appointments', appointments);

    const patients2 = [];

    for (let i = 0; i < 80; i += 1) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumber('+1##########');
      patients2.push({
        id: uuid(),
        accountId: accountId2,
        pmsId: uuid(),
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
        cellPhoneNumber: phoneNumber,
        birthDate: faker.date.past(),
        gender: 'male',
        language: 'English',
        insurance: JSON.stringify({
          insurance: 'Lay Health Insurance',
          memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
          contract: '4234rerwefsdfsd',
          carrier: 'sadasadsadsads',
          sin: 'dsasdasdasdadsasad',
        }),
        lastHygieneDate: faker.date.past(),
        lastRecallDate: faker.date.past(),
        pmsCreatedAt: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    // Test Patient for Account 2
    patients2.push({
      id: 'a021cf88-1b5c-4d54-a0f4-b6629523b738',
      accountId: accountId2,
      firstName: 'Testy',
      lastName: 'Testerson',
      email: 'testy.testerson@google.ca',
      mobilePhoneNumber: '906-594-6264',
      cellPhoneNumber: '906-594-6264',
      birthDate: faker.date.between(moment().subtract(100, 'years'), moment()),
      gender: 'female',
      language: 'English',
      insurance: JSON.stringify({
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      }),
      dueForHygieneDate: moment()
        .add(1, 'months')
        .toISOString(),
      dueForRecallExamDate: moment()
        .add(1, 'months')
        .toISOString(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });

    patients2.push({
      id: 'a021cf88-1b5c-4d54-a0f4-b6629523b739',
      accountId: accountId2,
      firstName: 'Testen',
      lastName: 'Testerson',
      email: 'testen.testerson@google.ca',
      mobilePhoneNumber: '906-594-6265',
      cellPhoneNumber: '906-594-6265',
      birthDate: faker.date.between(moment().subtract(100, 'years'), moment()),
      gender: 'male',
      language: 'English',
      insurance: JSON.stringify({
        insurance: 'Lay Health Insurance',
        memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
        contract: '4234rerwefsdfsd',
        carrier: 'sadasadsadsads',
        sin: 'dsasdasdasdadsasad',
      }),
      dueForHygieneDate: moment()
        .add(1, 'months')
        .toISOString(),
      dueForRecallExamDate: moment()
        .add(1, 'months')
        .toISOString(),
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Patients', patients2);

    await queryInterface.bulkInsert(
      'PatientSearches',
      patients
        .filter((_, index) => index < 10)
        .map(patient => ({
          id: uuid(),
          userId: superAdminUser2.id,
          accountId,
          patientId: patient.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
    );

    await queryInterface.bulkInsert(
      'PatientSearches',
      patients2
        .filter((_, index) => index < 10)
        .map(patient => ({
          id: uuid(),
          userId: superAdminUser2.id,
          accountId: accountId2,
          patientId: patient.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
    );

    const practitioners2 = [];

    for (let i = 0; i < 10; i += 1) {
      practitioners2.push({
        id: uuid(),
        accountId: accountId2,
        type: 'Hygienist',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Practitioners', practitioners2);

    const appointments2 = [];
    for (let i = 0; i < patients2.length; i += 2) {
      const patient = patients2[i];
      const appointment = {
        id: uuid(),
        accountId: accountId2,
        practitionerId: practitioners2[Math.floor(Math.random() * 10) + 0].id,
        patientId: patient.id,
        startDate: moment()
          .add('-30', 'days')
          .add('-5', 'minutes')
          .toISOString(),
        endDate: moment()
          .add('-30', 'days')
          .add('30', 'minutes')
          .toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      appointments2.push(appointment);
    }

    const chair1Id = uuid();
    const chair2Id = uuid();
    await queryInterface.bulkInsert('Chairs', [
      {
        id: chair1Id,
        accountId,
        name: 'Chair 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: chair2Id,
        accountId,
        name: 'Chair 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const todaysApps = [];
    for (let i = 0; i < 5; i += 2) {
      const startDateMinutes = i * 15;
      const patient = patients[i];
      const appointment = {
        id: uuid(),
        accountId,
        practitionerId: practitioners[Math.floor(Math.random() * 10) + 0].id,
        patientId: patient.id,
        startDate: moment()
          .add(`${startDateMinutes}`, 'minutes')
          .toISOString(),
        endDate: moment()
          .add(`${startDateMinutes + 15}`, 'minutes')
          .toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        chairId: chair2Id,
        isCancelled: false,
        isPatientConfirmed: i === 0,
      };

      todaysApps.push(appointment);
    }

    const prevDay = moment().subtract(1, 'day');
    const prevDayApp = {
      id: uuid(),
      accountId,
      practitionerId: practitioners[Math.floor(Math.random() * 10) + 0].id,
      patientId: patients[patients.length - 1].id,
      startDate: prevDay.toISOString(),
      endDate: moment(prevDay)
        .add(15, 'minutes')
        .toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      chairId: chair1Id,
      isCancelled: false,
      isPatientConfirmed: false,
    };

    const prevDayCancelledApp = {
      id: uuid(),
      accountId,
      practitionerId: practitioners[Math.floor(Math.random() * 10) + 0].id,
      patientId: patients[patients.length - 2].id,
      startDate: moment().toISOString(),
      endDate: moment(prevDay)
        .add(15, 'minutes')
        .toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      chairId: chair1Id,
      isCancelled: true,
      isPatientConfirmed: false,
    };

    todaysApps.push(prevDayApp);
    todaysApps.push(prevDayCancelledApp);

    await queryInterface.bulkInsert('Appointments', todaysApps);
  },
  // eslint-disable-next-line
  down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
