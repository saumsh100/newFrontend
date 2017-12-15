
const uuid = require('uuid').v4;
const accountId = '72954241-3652-4792-bae5-5bfed53d37b7';

module.exports = {
  up: async function (queryInterface) {
    const recalls = [
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
        interval: '1 months',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
        interval: '1 weeks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
        interval: '-1 weeks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
        interval: '-1 months',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const reminders = [
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
        interval: '21 days',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
        interval: '7 days',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['email', 'sms'],
        interval: '2 days',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        accountId,
        primaryType: 'email',
        primaryTypes: ['sms'],
        interval: '2 hours',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Recalls', recalls);
    await queryInterface.bulkInsert('Reminders', reminders);
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
