const moment = require('moment');
'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Patients', 'firstApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'lastApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'nextApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
        }, { transaction: t });

        console.log('------started migration------')
        const appointments = await queryInterface.sequelize.query(`SELECT * FROM "Appointments" WHERE "isCancelled" = false 
        AND "isDeleted" = false AND "isPending" = false ORDER BY "patientId", "startDate" DESC `, { transaction: t });

        console.log('------finished fetching appointments------')

        const apps = appointments[0];
        const today = new Date();

        let j = 0;
        while (j < apps.length) {
          const currentPatient = apps[j].patientId;
          console.log('------setting patient------', apps[j].patientId);

          let nextAppt = null;
          let lastAppt = null;
          let nextApptId = null;
          let lastApptId = null;
          let firstApptId = null;

          let count = 0;
          let i = j;
          while (i < apps.length && currentPatient === apps[i].patientId) {
            count += 1;
            const startDate = apps[i].startDate;
            if (moment(startDate).isAfter(today)) {
              nextAppt = apps[i].startDate;
              nextApptId = apps[i].id;
            } else if (moment(startDate).isBefore(today) && count === 1) {
              lastAppt = apps[i].startDate;
              lastApptId = apps[i].id;
              firstApptId = apps[i].id;
            } else if (moment(startDate).isBefore(today) && !lastAppt) {
              lastAppt = apps[i].startDate;
              lastApptId = apps[i].id;
              firstApptId = null;
            }
            i += 1;
          }

          if (count > 1 && moment(apps[i - 1].startDate).isBefore(today)) {
            firstApptId = apps[i - 1].id;
          }

          if (currentPatient) {
            await queryInterface.sequelize.query(`
              UPDATE "Patients"
              SET "firstApptId" = :firstApptId, "lastApptId" = :lastApptId, "nextApptId" = :nextApptId
              WHERE id = :patientId
            `, {
              replacements: {
                firstApptId,
                lastApptId,
                nextApptId,
                patientId: currentPatient,
              },
              transaction: t,
            });
          }

          j = i;
        }
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, DataTypes) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Patients', 'firstApptId', { transaction: t });
        await queryInterface.removeColumn('Patients', 'lastApptId', { transaction: t });
        await queryInterface.removeColumn('Patients', 'nextApptId', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  }
};
