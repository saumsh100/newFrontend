'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Patients', 'lastRestorativeApptId', {
          type: Sequelize.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'lastRestorativeDate', {
          type: Sequelize.DATE,
        }, { transaction: t });

        await queryInterface.bulkInsert('CronConfigurations', [{
          id: uuid(),
          name: 'CRON_LAST_RESTORATIVE',
          defaultValue: null,
          description: 'The last time the Cron for a patients Last Restorative was run',
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
        await queryInterface.removeColumn('Patients', 'lastRestorativeDate', { transaction: t });
        await queryInterface.removeColumn('Patients', 'lastRestorativeApptId', { transaction: t });
        return queryInterface.bulkDelete('CronConfigurations', {
          name: [
            'CRON_LAST_RESTORATIVE',
          ],
        });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  }
};

