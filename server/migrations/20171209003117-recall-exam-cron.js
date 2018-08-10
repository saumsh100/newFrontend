'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Patients', 'lastRecallApptId', {
          type: Sequelize.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'lastRecallDate', {
          type: Sequelize.DATE,
        }, { transaction: t });

        await queryInterface.bulkInsert('CronConfigurations', [{
          id: uuid(),
          name: 'CRON_LAST_RECALL',
          defaultValue: null,
          description: 'The last time the Cron for a patients Last Recall was run',
          type: 'isoString',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });

      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Patients', 'lastRecallDate', { transaction: t });
        await queryInterface.removeColumn('Patients', 'lastRecallApptId', { transaction: t });

        const cronConfig = await queryInterface
          .sequelize.query(`SELECT * FROM "CronConfigurations" WHERE name = 'CRON_LAST_RECALL'`
            , { transaction: t });

        await queryInterface.bulkDelete('AccountCronConfigurations', {
          cronConfigurationId: cronConfig[0][0].id,
        }, { transaction: t });

        return queryInterface.bulkDelete('CronConfigurations', {
          name: [
            'CRON_LAST_RECALL',
          ],
        }, { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },
};
