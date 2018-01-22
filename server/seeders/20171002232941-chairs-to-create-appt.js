
'use strict';
const faker = require('faker');
const uuid = require('uuid').v4;
const moment = require('moment');

// accountId2 (Liberty)
const accountId = '72954241-3652-4792-bae5-5bfed53d37b7';
// const enterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

module.exports = {
  up: async function (queryInterface) {
    const chairs = [
      {
        id: uuid(),
        accountId,
        description: 'This was seeded so I could create appts',
        name: 'Chair Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Chairs', chairs);
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
