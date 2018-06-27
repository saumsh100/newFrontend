'use strict';

const uuid = require('uuid').v4;

const APPOINTMENT_MISSED_STATUSES_READ = 'APPOINTMENT_MISSED_STATUSES_READ';
const APPOINTMENT_MISSED_STATUS_WRITE = 'APPOINTMENT_MISSED_STATUS_WRITE';
const APPOINTMENT_UNMISSED_STATUS_WRITE = 'APPOINTMENT_UNMISSED_STATUS_WRITE';

module.exports = {
  up: (queryInterface) => {
    queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [
          {
            id: uuid(),
            name: APPOINTMENT_MISSED_STATUSES_READ,
            defaultValue: '[]',
            description: 'A json array of statuses that will be used to determine if an Appointment is missed',
            type: 'json',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuid(),
            name: APPOINTMENT_MISSED_STATUS_WRITE,
            defaultValue: '',
            description: 'The custom status that will be set on an Appointment when CareCru marks it as isMissed=true',
            type: 'string',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuid(),
            name: APPOINTMENT_UNMISSED_STATUS_WRITE,
            defaultValue: '',
            description: 'The custom status that will be set on an Appointment when CareCru marks it as isMissed=false',
            type: 'string',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ], { transaction: t });
      } catch (e) {
        console.error(e);
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
            WHERE "name"='${APPOINTMENT_MISSED_STATUSES_READ}'
            OR "name"='${APPOINTMENT_MISSED_STATUS_WRITE}'
            OR "name"='${APPOINTMENT_UNMISSED_STATUS_WRITE}';
          `, { transaction: t });

        const configurationIds = configurations[0].map(c => c.id);
        await queryInterface.bulkDelete('AccountConfigurations', {
          configurationId: configurationIds,
        }, { transaction: t });

        await queryInterface.bulkDelete('Configurations', {
          name: [
            APPOINTMENT_MISSED_STATUSES_READ,
            APPOINTMENT_MISSED_STATUS_WRITE,
            APPOINTMENT_UNMISSED_STATUS_WRITE,
          ],
        }, { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
