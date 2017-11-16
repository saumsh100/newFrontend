'use strict';
const uuid = require('uuid').v4;

const correspondenceBatchSizeName = 'CORRESPONDENCE_BATCH_SIZE';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: correspondenceBatchSizeName,
          defaultValue: '100',
          type: 'integer',
          description: 'The batch size of correspondence sync',
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
    return queryInterface.bulkDelete('Configurations', {
      name: [
        correspondenceBatchSizeName,
      ],
    });
  },
};
