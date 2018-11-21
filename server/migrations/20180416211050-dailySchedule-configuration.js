
'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: 'DAILY_SCHEDULE_BATCH_SIZE',
          defaultValue: '100',
          description: 'The batch size of daily schedule sync',
          type: 'integer',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: (queryInterface) => {
    queryInterface.bulkDelete('AccountConfigurations', {});
    return queryInterface.bulkDelete('Configurations', {
      name: [
        'DAILY_SCHEDULE_BATCH_SIZE',
      ],
    });
  },
};
