const { calcFirstNextLastAppointment } = require('../lib/firstNextLastAppointment');

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
        await queryInterface.addColumn('Patients', 'firstApptDate', {
          type: DataTypes.DATE,
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'lastApptDate', {
          type: DataTypes.DATE,
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'nextApptDate', {
          type: DataTypes.DATE,
        }, { transaction: t });

        const appointments = await queryInterface.sequelize.query(`SELECT * FROM "Appointments" WHERE "patientId" IS NOT NULL AND "isCancelled" = false 
        AND "isDeleted" = false AND "isPending" = false ORDER BY "patientId", "startDate" DESC `, { transaction: t });

        const apps = appointments[0];

        await calcFirstNextLastAppointment(apps,
          async (patientId, appointmentsObj) => {
            await queryInterface.sequelize.query(`
              UPDATE "Patients"
              SET "firstApptId" = :firstApptId, "firstApptDate" = :firstApptDate, "lastApptId" = :lastApptId, "lastApptDate" = :lastApptDate, "nextApptId" = :nextApptId, "nextApptDate" = :nextApptDate   
              WHERE id = :patientId`, {
                replacements: {
                  ...appointmentsObj,
                  patientId,
                },
                transaction: t,
              });
            console.log(`Set First/Next/Last Appointment for: ${patientId}`);
          });
      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Patients', 'firstApptDate', { transaction: t });
        await queryInterface.removeColumn('Patients', 'lastApptDate', { transaction: t });
        await queryInterface.removeColumn('Patients', 'nextApptDate', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },
};
