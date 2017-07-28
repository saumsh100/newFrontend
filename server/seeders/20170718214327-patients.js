const faker = require('faker');
const uuid = require('uuid').v4;

const enterpriseId = uuid();
const accountId = '2aeab035-b72c-4f7a-ad73-09465cbf5654';

module.exports = {
  up: async function (queryInterface, Sequelize) { // eslint-disable-line
    await queryInterface.bulkInsert('Enterprises', [{
      id: enterpriseId,
      name: 'Zero Enterprise',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    await queryInterface.bulkInsert('Accounts', [
      {
        id: accountId,
        name: 'Zero Account - Zero Enterprise',
        enterpriseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const patients = [];

    for (let i = 0; i < 100; i += 1) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumberFormat(0);
      patients.push({
        id: uuid(),
        accountId,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Patients', patients);
  },

  down(queryInterface, Sequelize) { // eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
