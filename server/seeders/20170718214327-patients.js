const faker = require('faker');
const uuid = require('uuid').v4;

const enterpriseId = uuid();
const accountId = '2aeab035-b72c-4f7a-ad73-09465cbf5654';
const accountId2 = '1aeab035-b72c-4f7a-ad73-09465cbf5654';

module.exports = {
  up: async function (queryInterface, Sequelize) { // eslint-disable-line
    queryInterface.bulkInsert('Enterprise', [{
      id: enterpriseId,
      name: 'Zero Enterprise',
    }]);

    queryInterface.bulkInsert('Enterprise', [
      {
        id: accountId,
        name: 'Zero Account - Zero Enterprise',
        enterpriseId,
      },
      {
        id: accountId2,
        name: 'First Account - Zero Enterprise',
        enterpriseId,
      },
    ]);



    for (let i = 0; i < 100; i += 1) {
      const lastDate = faker.date.past();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumberFormat(0);
      const patientObject = {
        accountId: account.id,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
        birthDate: faker.date.past(),
        gender: 'male',
        language: 'English',
        lastAppointmentDate: faker.date.past(),
        insurance: {
          insurance: 'Lay Health Insurance',
          memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
          contract: '4234rerwefsdfsd',
          carrier: 'sadasadsadsads',
          sin: 'dsasdasdasdadsasad',
        },
      };

      await PatientModel.create(patientObject);
    }
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
