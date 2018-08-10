'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Patients', 'dueForRecallExamDate', {
          type: Sequelize.DATE,
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'dueForHygieneDate', {
          type: Sequelize.DATE,
        }, { transaction: t });

        return await queryInterface.bulkInsert('CronConfigurations', [{
          id: uuid(),
          name: 'CRON_DUE_DATE',
          defaultValue: null,
          description: 'The last time the Cron for a patients due date was run',
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

  down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Patients',
          'dueForRecallExamDate',
          { transaction: t },
        );
        await queryInterface.removeColumn(
          'Patients',
          'dueForHygieneDate',
          { transaction: t },
        );

        const cronConfig = await queryInterface
          .sequelize.query("SELECT * FROM \"CronConfigurations\" WHERE name = 'CRON_DUE_DATE'"
            , { transaction: t });

        await queryInterface.bulkDelete('AccountCronConfigurations', {
          cronConfigurationId: cronConfig[0][0].id,
        }, { transaction: t });

        return queryInterface.bulkDelete('CronConfigurations', {
          name: [
            'CRON_DUE_DATE',
          ],
        }, { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
