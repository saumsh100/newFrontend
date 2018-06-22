'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Configurations', [
      {
        id: uuid(),
        name: 'HYGIENE_TYPES',
        // TODO: add the proper Dentrix defaults here
        defaultValue: `[]`,
        description: 'The default continuing care reasons for hygiene',
        type: 'json',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'RECALL_TYPES',
        // TODO: add the proper Dentrix defaults here
        defaultValue: `[]`,
        description: 'The default continuing care reasons for recall',
        type: 'json',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const configurations = await queryInterface
          .sequelize.query(`
            SELECT * FROM "Configurations"
            WHERE "name"='HYGIENE_TYPES' OR "name"='RECALL_TYPES';
          ` , { transaction: t });

        const configurationIds = configurations[0].map(c => c.id);
        await queryInterface.bulkDelete('AccountConfigurations', {
          configurationId: configurationIds,
        }, { transaction: t });

        await queryInterface.bulkDelete('Configurations', {
          name: [
            'HYGIENE_TYPES',
            'RECALL_TYPES',
          ],
        }, { transaction: t });
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },
};
