
'use strict';

const uuid = require('uuid').v4;

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.createTable('SentRemindersPatients', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          
          sentRemindersId: {
            type: Sequelize.UUID,
            primaryKey: true,
            references: {
              model: 'SentReminders',
              key: 'id',
            },
            allowNull: false,
          },
    
          patientId: {
            type: Sequelize.UUID,
            references: {
              model: 'Patients',
              key: 'id',
            },
            allowNull: false,
          },
    
          appointmentId: {
            type: Sequelize.UUID,
            references: {
              model: 'Appointments',
              key: 'id',
            },
            allowNull: false,
          },
          
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          deletedAt: { type: Sequelize.DATE },
        });

        const sentRemindersPatients = await queryInterface
          .sequelize.query('SELECT id AS "sentRemindersId", "patientId", "appointmentId" FROM "SentReminders";');
          
        if (sentRemindersPatients[0].length > 0) {
          await queryInterface.bulkInsert(
            'SentRemindersPatients',
            sentRemindersPatients[0].map(v => ({
              id: uuid(), 
              ...v,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          );
        }

        await queryInterface.renameColumn(
          'SentReminders',
          'patientId',
          'contactedPatientId',
        );

        await queryInterface.addColumn(
          'SentReminders',
          'isFamily',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
        );
            
        await queryInterface.removeColumn(
          'SentReminders',
          'appointmentId',
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'SentReminders',
          'appointmentId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Appointments',
              key: 'id',
            },
          },
        );

        await queryInterface.sequelize.query(`
          UPDATE "SentReminders" SET "appointmentId" = T1."appointmentId"
          FROM "SentRemindersPatients" AS T1
              WHERE "SentReminders"."id" = T1."sentRemindersId"
                AND "SentReminders"."contactedPatientId" = T1."patientId"
            `);

        await queryInterface.renameColumn(
          'SentReminders',
          'contactedPatientId',
          'patientId',
        );
        
        await queryInterface.removeColumn(
          'SentReminders',
          'isFamily',
        );
        
        await queryInterface.dropTable('SentRemindersPatients');
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
