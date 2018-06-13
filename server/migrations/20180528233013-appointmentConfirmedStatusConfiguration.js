'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: 'APPOINTMENT_CONFIRMED_STATUSES_READ',
          defaultValue: '[]',
          description: 'A json array of statuses that will be used to determine if an Appointment is confirmed',
          type: 'json',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          name: 'APPOINTMENT_CONFIRMED_STATUS_WRITE',
          defaultValue: '',
          description: 'The custom status that will be set on an Appointment when CareCru confirms it',
          type: 'string',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          name: 'APPOINTMENT_UNCONFIRMED_STATUS_WRITE',
          defaultValue: '',
          description: 'The custom status that will be set on an Appointment when CareCru unconfirms it',
          type: 'string',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        ], { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('AccountConfigurations', {});
    return queryInterface.bulkDelete('Configurations', {
      name: [
        'APPOINTMENT_CONFIRMED_STATUS_READ',
        'APPOINTMENT_CONFIRMED_STATUS_WRITE',
        'APPOINTMENT_UNCONFIRMED_STATUS_WRITE',
      ],
    });
  }
};
