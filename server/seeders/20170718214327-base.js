const faker = require('faker');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const moment = require('moment');

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
  enterpriseId,
  weeklyScheduleId,
  name: 'Test Account',
  city: 'Belgrade',
  twilioPhoneNumber: clinicPhoneNumber,
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const account2 = {
  id: accountId2,
  enterpriseId,
  city: 'Kostolac',
  name: 'Test Account 2',
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

    for (let i = 0; i < 100; i += 1) {
      const firstName = faker.name.firstName('male');
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
        updatedAt: new Date(),
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
    }]);

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
