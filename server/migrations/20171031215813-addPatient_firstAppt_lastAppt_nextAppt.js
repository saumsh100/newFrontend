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

        const Patients = await queryInterface.sequelize.query('SELECT * FROM "Patients"', { transaction: t });

        const updatePatientsData = [];

        Patients[0].forEach((patient) => {
          updatePatientsData.push({
            id: patient.id,
          });
        });

        /**
         * Iterating over every patient and getting all their appointments
         */
        for (let i = 0; i < updatePatientsData.length; i += 1) {
          const patientApps = await queryInterface.sequelize.query(`
          SELECT * FROM "Appointments" WHERE "patientId" = :id 
          AND "isCancelled" = false AND "isDeleted" = false AND "isPending" = false ORDER BY "startDate" DESC`,
            {
              replacements: updatePatientsData[i],
              transaction: t,
            });

          const apps = patientApps[0];

          if (apps.length === 1) {
            // Setting first and last appointment when there is only one appointment
            if (moment(apps[0].startDate).isBefore(new Date())) {
              await queryInterface.sequelize.query(`
                UPDATE "Patients"
                SET "firstApptId" = :id
                WHERE id = :patientId
              `, {
                replacements: apps[0],
                transaction: t,
              });
              await queryInterface.sequelize.query(`
                UPDATE "Patients"
                SET "lastApptId" = :id
                WHERE id = :patientId
              `, {
                replacements: apps[0],
                transaction: t,
              });

              // Setting next appointment when there is only one appointment
            } else if (moment(apps[0].startDate).isAfter(new Date())) {
              await queryInterface.sequelize.query(`
                UPDATE "Patients"
                SET "nextApptId" = :id
                WHERE id = :patientId
              `, {
                replacements: apps[0],
                transaction: t,
              });
            }

            // If greater than one appointment calculate next and last appointment
          } else if (apps.length > 1) {
            const today = new Date();

            let nextAppt = null;
            let lastAppt = null;
            let nextApptId = null;
            let lastApptId = null;

            for (let j = 0; j < apps.length; j += 1) {
              const startDate = apps[j].startDate;

              if (!nextAppt && moment(startDate).isAfter(today)) {
                nextAppt = apps[j].startDate;
                nextApptId = apps[j].id;
              } else if (moment(startDate).isAfter(today) && moment(startDate).isBefore(nextAppt)) {
                nextAppt = apps[j].startDate;
                nextApptId = apps[j].id;
                break;
              }
            }

            for (let k = 0; k < apps.length; k += 1) {
              const startDate = apps[k].startDate;

              if (!lastAppt && moment(startDate).isBefore(today)) {
                lastAppt = apps[k].startDate;
                lastApptId = apps[k].id;
                break;
              }
            }

            const endAppointment = apps[apps.length - 1];

            // Set first appointment if the appointment at the end of the array is before today.
            if (moment(endAppointment.startDate).isBefore(today)) {
              await queryInterface.sequelize.query(`
                UPDATE "Patients"
                SET "firstApptId" = :firstApptId
                WHERE id = :patientId
              `, {
                replacements: {
                  firstApptId: endAppointment.id,
                  patientId: updatePatientsData[i].id,
                },
                transaction: t,
              });
            }

            await queryInterface.sequelize.query(`
                UPDATE "Patients"
                SET "lastApptId" = :lastApptId
                WHERE id = :patientId
              `, {
                replacements: {
                  lastApptId,
                  patientId: updatePatientsData[i].id,
                },
                transaction: t,
              });

            await queryInterface.sequelize.query(`
                UPDATE "Patients"
                SET "nextApptId" = :nextApptId
                WHERE id = :patientId
              `, {
                replacements: {
                  nextApptId,
                  patientId: updatePatientsData[i].id,
                },
                transaction: t,
              });
          }
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
