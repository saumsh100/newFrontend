
'use strict';
const faker = require('faker');
const uuid = require('uuid').v4;
const moment = require('moment');

// accountId2
const accountId = '72954241-3652-4792-bae5-5bfed53d37b7';
const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

module.exports = {
  up: async function (queryInterface) {
    const practitioner1 = {
      id: uuid(),
      accountId,
      type: 'Dentist',
      firstName: 'Timothy',
      lastName: 'Sharp',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const practitioner2 = {
      id: uuid(),
      accountId,
      type: 'Dentist',
      firstName: 'Stacy',
      lastName: 'Lee',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const patient1 = {
      id: uuid(),
      accountId,
      firstName: 'Justin',
      lastName: 'Timberlake',
      email: `justin+1@carecru.com`,
      mobilePhoneNumber: '+17808508886',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const patient2 = {
      id: uuid(),
      accountId,
      firstName: 'Stacy',
      lastName: 'Lee',
      email: `justin+2@carecru.com`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // This appointment needs a review sent...
    const appointment1 = {
      id: uuid(),
      accountId,
      practitionerId: practitioner1.id,
      patientId: patient1.id,
      startDate: (new Date(2017, 8, 18, 8, 0)).toISOString(),
      endDate: (new Date(2017, 8, 18, 9, 0)).toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await queryInterface.bulkInsert('Practitioners', [practitioner1, practitioner2]);
    await queryInterface.bulkInsert('Patients', [patient1]);
    await queryInterface.bulkInsert('Appointments', [appointment1]);
  },

  down: function (queryInterface) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
