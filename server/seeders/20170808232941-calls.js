'use strict';
const faker = require('faker');
const uuid = require('uuid').v4;
const moment = require('moment');

const accountId = '62954241-3652-4792-bae5-5bfed53d37b7';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const patients = [];
    const calls = [];
    for (let i = 0; i < 100; i += 1) {
      const firstName = faker.name.firstName('male');
      const lastName = faker.name.lastName();
      const phoneNumber = faker.phone.phoneNumber('+1##########');
      const id = uuid();
      patients.push({
        id,
        accountId,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@google.ca`,
        mobilePhoneNumber: phoneNumber,
        cellPhoneNumber: phoneNumber,
        birthDate: faker.date.between(moment().subtract(100, 'days'), moment()),
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

      calls.push({
        id: uuid(),
        accountId,
        patientId: id,
        dateTime: faker.date.past(),
        answered: faker.random.boolean(),
        voicemail: false,
        wasApptBooked: faker.random.boolean(),
        duration: faker.random.number(),
        priorCalls: 0,
        recording: null,
        recordingDuration: null,
        startTime: faker.date.past(),
        totalCalls: 1,
        callerCity: 'Vancouver',
        callerCountry: 'Canada',
        callerName: firstName,
        callerNum: phoneNumber,
        callSource: 'Direct',
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Patients', patients);
    await queryInterface.bulkInsert('Calls', calls);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
