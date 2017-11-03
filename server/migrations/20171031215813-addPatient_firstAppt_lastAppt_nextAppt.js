const CalcFirstNextLastAppointment = require('../lib/firstNextLastAppointment');

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
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'lastApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'nextApptId', {
          type: DataTypes.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        const appointments = await queryInterface.sequelize.query(`SELECT * FROM "Appointments" WHERE "patientId" IS NOT NULL AND "isCancelled" = false 
        AND "isDeleted" = false AND "isPending" = false ORDER BY "patientId", "startDate" DESC `, { transaction: t });

        const apps = appointments[0];

        CalcFirstNextLastAppointment(apps,
          async (currentPatient, firstApptId, nextApptId, lastApptId) => {
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
            console.log(`Set First/Next/Last Appointment for: ${currentPatient}`);
          });
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
