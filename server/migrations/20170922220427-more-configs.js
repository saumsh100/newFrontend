'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: 'FAMILY_BATCH_SIZE',
          defaultValue: '100',
          description: 'The batch size of family sync',
          type: 'integer',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'CHAIR_BATCH_SIZE',
          defaultValue: '100',
          type: 'integer',
          description: 'The batch size of chair sync',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'PRACTITIONER_BATCH_SIZE',
          defaultValue: '100',
          type: 'integer',
          description: 'The batch size of practitioner sync',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'PRACTITIONER_SCHEDULE_BATCH_SIZE',
          defaultValue: '100',
          type: 'integer',
          description: 'The batch size of practitioner schedule sync',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'FULL_SYNC_INTERVAL',
          type: 'integer',
          defaultValue: '300',
          description: 'The full sync interval',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'QUICK_SYNC_INTERVAL',
          type: 'integer',
          defaultValue: '20',
          description: 'The quick sync interval',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'CACHE_ENGINE',
          type: 'string',
          defaultValue: 'REDIS',
          description: 'The cache engine',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'FULL_SYNC_ENABLED',
          defaultValue: '1',
          type: 'boolean',
          description: 'Is full sync enabled',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'QUICK_SYNC_ENABLED',
          defaultValue: '1',
          type: 'boolean',
          description: 'Is quick sync enabled',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
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
    return queryInterface.bulkDelete('Configurations', {
      name: [
        'FAMILY_BATCH_SIZE',
        'CHAIR_BATCH_SIZE',
        'PRACTITIONER_BATCH_SIZE',
        'PRACTITIONER_SCHEDULE_BATCH_SIZE',
        'FULL_SYNC_INTERVAL',
        'QUICK_SYNC_INTERVAL',
        'CACHE_ENGINE',
        'FULL_SYNC_ENABLED',
        'QUICK_SYNC_ENABLED',
      ],
    });
  },
};
