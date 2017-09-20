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
        await queryInterface.createTable('Configurations', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          defaultValue: {
            type: Sequelize.STRING,
          },

          description: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          type: {
            type: Sequelize.STRING,
          },

          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          deletedAt: {
            type: Sequelize.DATE,
          },
        }, { transaction: t });

        await queryInterface.createTable('AccountConfigurations', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          value: {
            type: Sequelize.STRING,
          },

          configurationId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'Configurations',
              key: 'id',
            },
            onUpdate: 'cascade',
          },

          accountId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'Accounts',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
          },

          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          deletedAt: {
            type: Sequelize.DATE,
          },
        }, {
          transaction: t,
          uniqueKeys: {
            actions_unique: {
              fields: ['accountId', 'configurationId'],
            },
          },
        });

        await queryInterface.bulkInsert('Configurations', [{
          id: uuid(),
          name: 'APPOINTMENT_BATCH_SIZE',
          defaultValue: '100',
          description: 'The batch size of appointment sync',
          type: 'integer',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'PATIENT_BATCH_SIZE',
          defaultValue: '100',
          type: 'integer',
          description: 'The batch size of patient sync',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'PROCEDURE_BATCH_SIZE',
          defaultValue: '100',
          type: 'integer',
          description: 'The batch size of procedure sync',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'ADAPTER_TYPE',
          type: 'string',
          description: 'The adapter type',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, {
          id: uuid(),
          name: 'CONNECTOR_ENABLED',
          defaultValue: '0',
          type: 'boolean',
          description: 'Is connector enabled',
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
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.dropTable('AccountConfigurations', { transaction: t });
        await queryInterface.dropTable('Configurations', { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  }
};
