'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: 'BIDIRECTIONAL_SYNC_ENABLED',
          defaultValue: '1',
          description: 'Turns bidirectional sync functionality on or off.',
          type: 'boolean',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('AccountConfigurations', {});
    return queryInterface.bulkDelete('Configurations', {
      name: [
        'BIDIRECTIONAL_SYNC_ENABLED',
      ],
    });
  },
};
