
const faker = require('faker');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const moment = require('moment');
const procedures = require('../fixtures/procedures/procedureDump.json');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


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
const clinicPhoneNumber = '+17786558613';
const addressId = uuid();
const addressId2 = uuid();


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
  weeklyScheduleId,
  addressId,
  name: 'Test Account',
  twilioPhoneNumber: clinicPhoneNumber,
  lastSyncDate: '2017-11-17T20:20:30.932Z',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
  canSendReviews: false,
};

const address = {
  id: addressId,
  city: 'Belgrade',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
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
};

const address2 = {
  id: addressId2,
  city: 'Edmonton',
  state: 'AB',
  street: '10204 112th St.',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
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
  id: uuid(),
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

const WeeklySchedule = {
  id: weeklyScheduleId,
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

module.exports = {
  up: async function (queryInterface, Sequelize) { // eslint-disable-line
    await queryInterface.bulkInsert('Enterprises', [enterprise]);

    await queryInterface.bulkInsert('WeeklySchedules', [WeeklySchedule]);

    await queryInterface.bulkInsert('Addresses', [address, address2]);

    await queryInterface.bulkInsert('Accounts', [account, account2]);

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

    const patients = [];
    const deliveredProcedures = [];

    for (let i = 0; i < 100; i += 1) {
      const firstName = faker.name.firstName('male');
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumberFormat(0);
      const id = uuid();
      patients.push({
        id,
        accountId,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
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
        createdAt: faker.date.past(),
        pmsCreatedAt: faker.date.past(),
        updatedAt: new Date(),
      });

      const primaryInsuranceAmount = faker.finance.amount(0, 200, 2);

      const secondaryInsuranceAmount = faker.finance.amount(0, 200, 2);

      const patientAmount = faker.finance.amount(0, 200, 2);

      const discountAmount = faker.finance.amount(0, 200, 2);

      const totalAmount = parseFloat(patientAmount) + parseFloat(secondaryInsuranceAmount) +
      parseFloat(primaryInsuranceAmount) - parseFloat(discountAmount);

      deliveredProcedures.push({
        id: uuid(),
        accountId,
        primaryInsuranceAmount,
        secondaryInsuranceAmount,
        patientAmount,
        discountAmount,
        totalAmount,
        units: 1.00,
        createdAt: faker.date.past(),
        entryDate: faker.date.past(),
        updatedAt: new Date(),
        patientId: id,
        procedureCode: procedures[Math.floor(Math.random() * procedures.length)].code,
      });
    }

    for (let i = 0; i < 30; i += 1) {
      const firstName = faker.name.firstName('female');
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumberFormat(0);
      patients.push({
        id: uuid(),
        accountId,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
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
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Patients', patients);

    await queryInterface.bulkInsert('DeliveredProcedures', deliveredProcedures);

    const practitioners = [];

    for (let i = 0; i < 10; i += 1) {
      practitioners.push({
        id: uuid(),
        accountId,
        type: 'Hygienist',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Practitioners', practitioners);

    const appointments = [];
    for (let i = 0; i < patients.length; i += 2) {
      const patient = patients[i];
      const appointment = {
        id: uuid(),
        accountId,
        practitionerId: practitioners[Math.floor(Math.random() * 10) + 0].id,
        patientId: patient.id,
        startDate: moment().add('-30', 'days').add('-5', 'minutes').toISOString(),
        endDate: moment().add('-30', 'days').add('30', 'minutes').toISOString(),
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
      const phoneNumber = faker.phone.phoneNumberFormat(0);
      patients2.push({
        id: uuid(),
        accountId: accountId2,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
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
        pmsCreatedAt: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Patients', patients2);

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
        startDate: moment().add('-30', 'days').add('-5', 'minutes').toISOString(),
        endDate: moment().add('-30', 'days').add('30', 'minutes').toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      appointments2.push(appointment);
    }

    await queryInterface.bulkInsert('Chairs', [{
      id: uuid(),
      accountId,
      name: 'Chair 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: uuid(),
      accountId,
      name: 'Chair 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ]);

    // await queryInterface.bulkInsert('Appointments', appointments2);
  },

  down(queryInterface, Sequelize) { // eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
