'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: 'PATIENT_RECALL_BATCH_SIZE',
          defaultValue: '100',
          description: 'The batch size of patient recall sync',
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
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const configurations = await queryInterface
          .sequelize.query(`
            SELECT * FROM "Configurations"
            WHERE "name"='PATIENT_RECALL_BATCH_SIZE';
          ` , { transaction: t });

        const configurationIds = configurations[0].map(c => c.id);
        await queryInterface.bulkDelete('AccountConfigurations', {
          configurationId: configurationIds,
        }, { transaction: t });

        await queryInterface.bulkDelete('Configurations', {
          name: [
            'PATIENT_RECALL_BATCH_SIZE',
          ],
        }, {transaction: t});
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },
};
