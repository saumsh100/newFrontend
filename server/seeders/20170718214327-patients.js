const faker = require('faker');
const uuid = require('uuid').v4;

const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';

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
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      appointments.push(appointment);
    }

    await queryInterface.bulkInsert('Appointments', appointments);
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
