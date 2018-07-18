
'use strict';

const uuid = require('uuid').v4;
const migrationFieldName = 'DB_CONNECTION_URL';

module.exports = {
  up:  (queryInterface) => {
    queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: migrationFieldName,
          defaultValue: '',
          description: 'The custom db url that the connector will use.',
          type: 'string',
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
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const configurations = await queryInterface
          .sequelize.query(`
            SELECT * FROM "Configurations"
            WHERE "name" = ?;
          ` , { replacements: [migrationFieldName], transaction: t });

        const configurationIds = configurations[0].map(c => c.id);
        await queryInterface.bulkDelete('AccountConfigurations', {
          configurationId: configurationIds,
        }, { transaction: t });

        await queryInterface.bulkDelete('Configurations', {
          name: [
            migrationFieldName
          ],
        }, { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};