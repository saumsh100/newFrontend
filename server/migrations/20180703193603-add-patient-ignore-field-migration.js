
'use strict';

const uuid = require('uuid').v4;
const migrationFieldName = 'IGNORED_PRACTITIONER_PMS_IDS';

module.exports = {
  up:  (queryInterface) => {
    queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: migrationFieldName,
          defaultValue: '[]',
          description: 'A json array of PMS Practitioner Ids whose patients are not synced',
          type: 'json',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Configurations', {
      name: [
        migrationFieldName,
      ],
    });
  },
};
