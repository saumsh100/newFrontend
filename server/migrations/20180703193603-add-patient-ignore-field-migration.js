'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up:  (queryInterface) => {
    queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: 'IGNORED_PRACTITIONER_PMS_IDS',
          defaultValue: '[]',
          description: 'A json array of PMS Practitioner Ids whose patients are not synced',
          type: 'json',
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
    return queryInterface.bulkDelete('Configurations', {
      name: [
        'IGNORED_PRACTITIONER_PMS_IDS',
      ],
    });
  },
};
